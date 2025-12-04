import numpy as np
import sys
import nibabel as nib
from functools import lru_cache
import importlib.resources
import itertools as itt
import matplotlib as mpl
import io
import pygame as pg
import base64

import pyparadigm as pp

from .core import (ImgSize, ImgCoords, MatShape, MatCoords)

@lru_cache(4)
def load_bg_template(name):
    with importlib.resources.path("conview_backend.data", f"{name}.nii.gz") as p:
        return nib.load(str(p))


def mni_2_index(affine: np.ndarray, mni: tuple)-> tuple:
    return tuple(int(x) for x in nib.affines.apply_affine(
        np.linalg.inv(affine), mni))


def index_2_mni(affine: np.ndarray, indices: tuple)-> tuple:
    return tuple(int(x) for x in nib.affines.apply_affine(affine, indices))


loaded_font = None

@lru_cache()
def text(x, align="left"): 
    global loaded_font
    if loaded_font is None:
        with importlib.resources.path("conview_backend.data", "opensans.ttf") as p:
            loaded_font = pp.Font(str(p), "file", size=80)
    
    # for some reason, text in pygame tends to be very ugly. The best option I
    # found to make it look nice is too make it way to big, and then scale it
    # down
    return pp.Surface(scale=1, margin=pp.Margin(left=0.03))(
        pp.Text(x, loaded_font, align=align))


def partition_all(n, iter):
    offset = 0
    while True:
        vals = list(itt.islice(iter, offset, offset + n))
        len_vals = len(vals)
        if len_vals > 0:
            yield vals
        else:
            return
        if len_vals < n:
            return
        offset += n


def error(msg: str):
    print(msg, file=sys.stderr)
    exit(1)


def load_nii_or_error(file: str):
    try:
        return nib.load(file)
    except Exception as e:
        error(str(e))


def threshold_slice(slice, thresh):
    """Mask values that do not meet the absolute threshold window."""
    low, high = thresh
    if low is None and high is None:
        return slice

    data = np.asarray(slice)
    abs_vals = np.abs(data)
    keep = np.isfinite(abs_vals)

    if low is not None:
        keep &= abs_vals >= low
    if high is not None:
        keep &= abs_vals <= high

    result = data.copy()
    result[~keep] = np.nan
    return result


def get_slices(mat, split_coord):
    return (
        mat[split_coord[0], :, :],
        mat[:, split_coord[1], :],
        mat[:, :, split_coord[2]])


def cut(iter, index):
    return (x for i, x in enumerate(iter) if i != index)


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


def mat_coords_2_img_coords(matCoord: MatCoords, matSize: MatShape,
                            imgSize: ImgSize):
    relRow = matCoord.row / matSize.rows
    relCol = matCoord.col / matSize.cols
    # When creating an image from a mat, it is rotated by 90 degree, the coords
    # need to be adjusted for that
    relX = relRow
    relY = 1 - relCol
    x = relX * imgSize.w
    y = relY * imgSize.h
    return ImgCoords(round(x), round(y))


def encode_surface(surf):
    img_buffer = io.BytesIO()
    pg.image.save(surf, img_buffer, "png")
    img_buffer.seek(0)
    b64_img = base64.standard_b64encode(img_buffer.getbuffer()).decode("utf-8")
    return b64_img
