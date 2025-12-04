from . import conview
import nibabel as nib

from .core import SideInfo

import pyparadigm as pp
import pygame as pg

def main():
    bg_img = conview.load_background_img()
    img4d = nib.load("/home/felix/Documents/conview/4d_matrices/4d-map.nii")
    atlas = conview.load_atlas_img("/home/felix/Documents/conview/atlanti/atlas.nii", bg_img)

    idx4d = 20

    infos_l = SideInfo("coolwarm", (100, 100, 100), (None, None), 0, True)
    infos_r = SideInfo("coolwarm", (100, 100, 100), (None, None), 0, True)

    pp.init((1400, 700), pg.RESIZABLE, display_pos=(100, 100), title="Conview")
    target = pg.display.get_surface()
    conview.render_img(atlas, bg_img, img4d, idx4d, infos_l, infos_r, target)
    pg.display.flip()
    el = pp.EventListener()
    el.wait_for_keys((pg.K_RETURN,))
