from dataclasses import dataclass
from typing import NamedTuple

import nibabel as nib
import numpy as np
import nilearn.image as nili
import matplotlib as mpl
import pygame as pg


class SideInfo(NamedTuple):
    coords: tuple[int, int, int]
    vrange: tuple[int | None, int | None]
    threshold: tuple[int | None, int | None]
    smoothed: bool
    cmap: str
    

class ImgCoords(NamedTuple):
    x: int
    y: int


class MatCoords(NamedTuple):
    row: int
    col: int


class ImgSize(NamedTuple):
    w: int
    h: int

    @staticmethod
    def from_(x):
        if type(x) == pg.Surface:
            return ImgSize(x.get_width(), x.get_height())
        else:
            raise ValueError(f"invalid argument: {x}")


class MatShape(NamedTuple):
    rows: int
    cols: int
