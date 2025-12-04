#!/usr/bin/env python

import asyncio
import io
import base64
import json
from pathlib import Path
import traceback
import tomllib
import math

import websockets
from websockets import WebSocketServerProtocol
import pyparadigm as pp
import pygame as pg
import argh
import numpy as np

from .conview import RuntimeState, SessionState, MatrixSummary
from . import conview
from .core import SideInfo, ImgCoords, MatCoords, ImgSize, MatShape
from .area_tracker import AreaTracker
from .utils import cut, index_2_mni, mni_2_index, encode_surface, threshold_slice

render_shape = ImgSize(1400, 700)
pg.font.init()

async def handler(websocket: WebSocketServerProtocol, rt_state: RuntimeState):
    await websocket.send(json.dumps(get_init_data(rt_state)))
    session_state = SessionState()
    while True:
        try:
            message = await websocket.recv()
            print("rx msg: ", message)
            resp = process_msg(message, rt_state, session_state)
            if resp is not None:
                await websocket.send(json.dumps(resp))
        except websockets.ConnectionClosedOK:
            break
        except Exception as e:
            print("Error:", e)
            traceback.print_exception(e)
            await websocket.send(json.dumps(dict(
                mtype="DeathRattle", msg=str(e))))
            
def process_msg(msg, rt_state: RuntimeState, session_state: SessionState):
    try:
        decoded_msg = json.loads(msg)
        match decoded_msg["mtype"]:
            case "GetImg": 
                resp = get_image(decoded_msg, rt_state, session_state)
            case "GetImgWithPos":
                resp = get_img_with_pos(decoded_msg, rt_state, session_state)
            case _:
                resp = unknown_msg(decoded_msg)
        if resp is not None:
            print("responding:\n", render_msg(resp))
        return resp
    except json.JSONDecodeError as e:
        print("error:", e)
        return dict(mtype="Invalid", desc="Can't decode JSON", content=msg)


def render_msg(x):
    match x["mtype"]:
        case "Img":
            return summarize_img_msg(x)

        case "ImgWithCoord":
            x = {**x}
            x["val"] = "<BASE64>"
            if "matrix" in x:
                x["matrix"] = summarize_matrix(x["matrix"])
            return repr(x)

    
def unknown_msg(x):
    return dict(mtype="UnknownMsg", msg=x)


def summarize_img_msg(msg):
    matrix_info = summarize_matrix(msg.get("matrix"))
    if matrix_info is None:
        return "Img <DATA>"
    return f"Img <DATA> {matrix_info}"


def summarize_matrix(matrix):
    if not matrix:
        return None
    # handle bundle with region/network
    if "region" in matrix:
        reg = matrix.get("region") or {}
        net = matrix.get("network") or {}
        return f"[bundle reg:{_shape(reg)} net:{_shape(net)}]"
    return f"[matrix {_shape(matrix)}]"


def _shape(mdict):
    if not mdict:
        return "?@? 0x0"
    values = mdict.get("values") or []
    rows = len(values)
    cols = len(values[0]) if rows else 0
    axis = mdict.get("axis", "?")
    index = mdict.get("index", "?")
    return f"{axis}@{index} {rows}x{cols}"


def get_init_data(rt_state: RuntimeState):
    return dict(      
        mtype="InitData",
        atlas_image_map={atlas_id: list(matrix_map.keys())
            for atlas_id, matrix_map in rt_state.atlas_to_matrix_map.items()},
        min_mni=index_2_mni(rt_state.bg_img.affine, (0, 0, 0)),
        max_mni=index_2_mni(rt_state.bg_img.affine, np.asarray(rt_state.bg_img.shape) - [1, 1, 1]),
        cmaps=rt_state.cmaps)


def get_img_with_pos(msg, rt_state: RuntimeState, session_state: SessionState):
    img_x_rel = msg["pos"]["x"]
    img_y_rel = msg["pos"]["y"]
    res = session_state.area_tracker.find_area(
        (img_x_rel * render_shape.w, img_y_rel * render_shape.h))
    print("find area result: ", repr(res))
    if res is not None:
        # area is "{side}-{index}"
        area_name, rel_coords, area_rect = res
        [side, _, index] = area_name.partition("-")
        index = int(index)
        mat_shape = MatShape(*cut(rt_state.bg_img.shape, index))
        mat_coords = image_coords_2_mat_coords(ImgCoords(*rel_coords), area_rect, mat_shape)

        # mat Coords are 2D, we need to go to 3D, so we need to know which
        # dimension is missing, and what the missing value is
        mat_index = list(mat_coords)
        index_coords = session_state.last_renderd_index[side]
        mat_index.insert(index, index_coords[index])
        mni_index = index_2_mni(rt_state.bg_img.affine, mat_index)

        # patch the found out coord into the msg before handing it to get_image()
        msg_field = f"infos_{side.lower()}"
        side_info = msg[msg_field]
        side_info["coords"] = mni_index
        msg[msg_field] = side_info

        # if the left side is clicked, the corresponding 3d volume from the 4d image
        # must be loaded
        if side == "L":
            atlas_img = rt_state.atlanti[msg["atlas_name"]].img
            atlas_label = atlas_img.get_fdata()[tuple(mat_index)].item()
            msg["idx_4d"] = atlas_label

        # compute the image and attach the coords to the response, because the
        # frontend can't know
        res_msg = get_image(msg, rt_state, session_state)
        res_msg["mtype"] = "ImgWithCoord"
        res_msg["coords_l"] = msg["infos_l"]["coords"]
        res_msg["coords_r"] = msg["infos_r"]["coords"]
        res_msg["idx_4d"] = msg["idx_4d"]
        return res_msg

    
def image_coords_2_mat_coords(imgCoord: ImgCoords, imgSize: ImgSize,
                              matSize: MatShape):
    relX = imgCoord.x / imgSize.w
    relY = imgCoord.y / imgSize.h
    # When creating an image from a mat, it is rotated by 90 degree, the coords
    # need to be adjusted for that
    relRow = relX
    relCol = 1 - relY
    row = relRow * matSize.rows
    col = relCol * matSize.cols
    return MatCoords(round(row), round(col))


def get_image(msg, rt_state, session_state):
    atlas_name = msg["atlas_name"]
    atlas_data = rt_state.atlanti[atlas_name]
    four_d_img_name = msg["img_name"]
    four_d_img = rt_state.atlas_to_matrix_map[atlas_name][four_d_img_name]

    four_d_idx = msg["idx_4d"]
    infos_l = decode_side_info(msg["infos_l"])
    infos_r = decode_side_info(msg["infos_r"])
    infos_r = conview.resolve_connectivity_vrange(infos_r, four_d_img)

    surf = pg.Surface(render_shape)
    label_l, label_r, connectivities, r_idx, selected_col_id, value_l, value_r, color_l, color_r, vrange_l, vrange_r = conview.render_img(atlas_data.img, rt_state.bg_img, four_d_img, four_d_idx,
                       infos_l, infos_r, surf, session_state, atlas_data.labels)

    matrix_payload = build_matrix_payload(
        rt_state.matrix_summaries[atlas_name][four_d_img_name],
        infos_r,
        four_d_idx,
        selected_col_id)

    return dict(
        mtype="Img",
        val=encode_surface(surf),
        label_l=label_l,
        label_r=label_r,
        value_l=float(value_l),
        value_r=float(value_r),
        color_l=color_l,
        color_r=color_r,
        vrange_l=list(vrange_l),
        vrange_r=list(vrange_r),
        matrix=matrix_payload)


def build_matrix_payload(matrix_summary: MatrixSummary, infos_r: SideInfo, selected_row_id: int, selected_col_id: int | None):
    """
    Build a region-to-region payload (plus optional network aggregation) with labels and centers.
    """
    if matrix_summary is None:
        return None

    region_base = matrix_summary.base_payload.get("region") or {}
    net_base = matrix_summary.base_payload.get("network")

    def threshold_values(values, threshold):
        low, high = threshold
        if values is None:
            return None, None, None

        def should_hide(v):
            av = abs(v)
            if low is not None and high is not None:
                return av < low or av > high
            if low is not None:
                return av < low
            if high is not None:
                return av > high
            return False

        masked = []
        kept_vals = []
        for row in values:
            new_row = []
            for v in row:
                if v is None:
                    new_row.append(None)
                    continue
                if should_hide(v):
                    new_row.append(None)
                else:
                    new_row.append(v)
                    kept_vals.append(v)
            masked.append(new_row)

        vmin = min(kept_vals) if kept_vals else None
        vmax = max(kept_vals) if kept_vals else None
        return masked, vmin, vmax

    region_vals, reg_min, reg_max = threshold_values(region_base.get("values", []), infos_r.threshold)
    net_vals, net_min, net_max = threshold_values(net_base.get("values") if net_base else None, infos_r.threshold)

    region_payload = dict(
        axis="regions",
        index=selected_row_id,
        cmap=infos_r.cmap,
        vrange=[
            reg_min if reg_min is not None else region_base.get("vmin", infos_r.vrange[0]),
            reg_max if reg_max is not None else region_base.get("vmax", infos_r.vrange[1])
        ],
        values=region_vals or region_base.get("values", []),
        raw_values=region_base.get("values", []),
        x_labels=region_base.get("x_labels", []),
        y_labels=region_base.get("y_labels", []),
        x_short_labels=region_base.get("x_short_labels", []),
        y_short_labels=region_base.get("y_short_labels", []),
        x_ids=region_base.get("x_ids", []),
        y_ids=region_base.get("y_ids", []),
        x_centers=region_base.get("x_centers", []),
        y_centers=region_base.get("y_centers", []),
        net_labels=region_base.get("net_labels", []),
        net_labels_full=region_base.get("net_labels_full", []),
        net_labels_y=region_base.get("net_labels_y", []),
        net_labels_full_y=region_base.get("net_labels_full_y", []),
        net_boundaries=region_base.get("net_boundaries", []),
        net_boundaries_y=region_base.get("net_boundaries_y", []),
        x_nets=region_base.get("x_nets", []),
        y_nets=region_base.get("y_nets", []),
        x_nets_full=region_base.get("x_nets_full", []),
        y_nets_full=region_base.get("y_nets_full", []),
        selected_row_id=selected_row_id,
        selected_col_id=selected_col_id if selected_col_id is not None else -1
    )

    network_payload = None
    if net_base:
        network_payload = dict(
            axis="networks",
            index=-1,
            cmap=infos_r.cmap,
            vrange=[
                net_min if net_min is not None else net_base.get("vmin", infos_r.vrange[0]),
                net_max if net_max is not None else net_base.get("vmax", infos_r.vrange[1])
            ],
            values=net_vals if net_vals is not None else net_base.get("values", []),
            x_labels=net_base.get("x_labels", []),
        y_labels=net_base.get("y_labels", []),
        x_short_labels=net_base.get("x_short_labels", []),
        y_short_labels=net_base.get("y_short_labels", []),
            x_ids=net_base.get("x_ids", []),
            y_ids=net_base.get("y_ids", []),
            x_centers=net_base.get("x_centers", []),
            y_centers=net_base.get("y_centers", []),
            net_members=net_base.get("net_members", []),
            net_member_indices=net_base.get("net_member_indices", []),
            net_labels=net_base.get("net_labels", []) or region_base.get("net_labels", []),
            net_labels_full=net_base.get("net_labels_full", []),
            net_labels_y=net_base.get("net_labels_y", []) or region_base.get("net_labels_y", []),
            net_labels_full_y=net_base.get("net_labels_full_y", []) or region_base.get("net_labels_full_y", []),
            net_boundaries=region_base.get("net_boundaries", []),
            selected_row_id=-1,
            selected_col_id=-1
        )

    return dict(region=region_payload, network=network_payload)


def matrix_to_list(slice2d):
    """Convert a numpy slice to a JSON-friendly list of lists, keeping gaps as None."""
    return [[_nan_to_none(val) for val in row] for row in slice2d.tolist()]


def _nan_to_none(val):
    try:
        if math.isnan(val):
            return None
    except TypeError:
        pass
    try:
        return float(val)
    except Exception:
        return None


def decode_side_info(d):
    return SideInfo(tuple(d["coords"]), tuple(d["vrange"]), tuple(d["threshold"]), d["smoothed"], d["cmap"])


def get_dummy_img():
    surf = pg.Surface((500, 500))
    surf.fill(pg.Color(0, 255, 0))
    img_buffer = io.BytesIO()
    pg.image.save(surf, img_buffer, "png")
    img_buffer.seek(0)
    return base64.standard_b64encode(img_buffer.getbuffer()).decode("utf-8")


async def main_loop(rt_state):
    async with websockets.serve(lambda socket: handler(socket, rt_state), "", 8001):
        await asyncio.Future()  # run forever


def main(mapping_file: str):    
    pp.init((100,100), pg.RESIZABLE, display_pos=(0,0), title="Conview Backend")
    el = pp.EventListener((
        pp.Handler.resize_event_handler(),
        pp.Handler.quit_event_handler()))

    mapping_file = Path(mapping_file)
    base_dir = mapping_file.parent
    mapping = tomllib.loads(mapping_file.read_text())
    rt_state = RuntimeState(base_dir, mapping)
    asyncio.run(main_loop(rt_state))


def cli():
    argh.dispatch_command(main)
