"""Clean paper grade: neutral (pencil/paper) pixels become a warm, airy paper with softer graphite;
saturated pixels (the 3D characters) keep their colour."""
import numpy as np
from PIL import Image, ImageFilter
PAPER = np.array([250, 248, 243], np.float32)
INK = np.array([88, 84, 80], np.float32)
_tex = None
def texture(h, w):
    global _tex
    if _tex is None or _tex.shape[:2] != (h, w):
        rng = np.random.default_rng(3)
        n = rng.normal(0, 1, (h // 2, w // 2)).astype(np.float32)
        n = np.array(Image.fromarray(((n * 18) + 128).clip(0, 255).astype(np.uint8)).resize((w, h), Image.BILINEAR).filter(ImageFilter.GaussianBlur(0.8)), np.float32)
        _tex = ((n - 128) / 128)[..., None]
    return _tex
def grade(a):
    a = a.astype(np.float32); h, w = a.shape[:2]
    mx, mn = a.max(-1), a.min(-1); sat = (mx - mn)
    keep = np.clip((sat - 22) / 28, 0, 1)
    keep = np.array(Image.fromarray((keep * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5)), np.float32)[..., None] / 255
    lum = a.mean(-1, keepdims=True)
    # large dark areas (hair, beard, black shirt, jeans) belong to characters, thin dark strokes are pencil
    dark = (lum[..., 0] < 120).astype(np.uint8) * 255
    dens = np.array(Image.fromarray(dark).filter(ImageFilter.BoxBlur(7)), np.float32) / 255
    big = np.clip((dens - 0.55) * 4, 0, 1)
    big = np.array(Image.fromarray((big * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(2)), np.float32)[..., None] / 255
    keep = np.maximum(keep, big)
    # paper level: anything brighter than ~200 is paper; darker is graphite, softened
    t = np.clip((lum - 60) / (232 - 60), 0, 1) ** 0.75          # 0 = darkest line, 1 = paper
    pencil = INK + (PAPER - INK) * t
    pencil = pencil + texture(h, w) * 2.2
    return np.clip(pencil * (1 - keep) + a * keep, 0, 255)
if __name__ == '__main__':
    import sys
    a = np.array(Image.open(sys.argv[1]).convert('RGB'))
    Image.fromarray(grade(a).astype(np.uint8)).save(sys.argv[2])
