"""Track the white name badge (position + angle, template matching) and write 'מפתח/ת למידה' on it."""
import numpy as np
from numpy.lib.stride_tricks import sliding_window_view as swv
from PIL import Image, ImageDraw, ImageFont, ImageFilter
FONT = '/home/user/Lnet/assets/fonts/FbGazoz-Bold.otf'
S = 2
def _gray(a): return a[::S, ::S].mean(-1)
def _rot(tpl, ang):
    if abs(ang) < 1e-3: return tpl
    im = Image.fromarray(tpl.astype(np.float32), 'F')
    return np.array(im.rotate(ang, resample=Image.BILINEAR, fillcolor=float(tpl.mean())), np.float32)
def track(frames, t0, box, R=40):
    x0, y0, x1, y1 = [v // S for v in box]; w, h = x1 - x0, y1 - y0
    n = len(frames); out = [None] * n
    def run(order):
        base = _gray(frames[t0])[y0:y1, x0:x1].copy(); px, py, ang = x0, y0, 0.0
        for i in order:
            g = _gray(frames[i]); H, W = g.shape
            sx0, sy0 = max(0, px - R), max(0, py - R); sx1, sy1 = min(W, px + w + R), min(H, py + h + R)
            win = swv(g[sy0:sy1, sx0:sx1], (h, w))
            best = None
            for a in np.arange(ang - 9, ang + 9.1, 3):
                t = _rot(base, a); d = ((win - t) ** 2).mean((-1, -2)); j = np.unravel_index(np.argmin(d), d.shape)
                if best is None or d[j] < best[0]: best = (d[j], sx0 + j[1], sy0 + j[0], a)
            err, nx, ny, na = best; ok = err < 320
            if ok: px, py, ang = nx, ny, float(np.clip(na, -35, 35))
            out[i] = ((px + w / 2) * S, (py + h / 2) * S, w * S, h * S, ang, ok)
    run(range(t0, n)); run(range(t0, -1, -1))
    return out
_cache = {}
def patch(w, h, col):
    key = (w, h, tuple((col // 6).astype(int)))
    if key in _cache: return _cache[key]
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((1, 1, w - 2, h - 2), radius=max(3, w // 14), fill=tuple(int(c) for c in col) + (255,))
    for size in range(80, 8, -1):
        f = ImageFont.truetype(FONT, size)
        b1 = d.textbbox((0, 0), 'מפתח/ת', font=f, direction='rtl'); b2 = d.textbbox((0, 0), 'למידה', font=f, direction='rtl')
        lw = max(b1[2] - b1[0], b2[2] - b2[0]); lh = (b1[3] - b1[1]) + (b2[3] - b2[1]) + size * .2
        if lw <= w * .84 and lh <= h * .8: break
    y = (h - lh) / 2
    for t, b in (('מפתח/ת', b1), ('למידה', b2)):
        d.text(((w - (b[2] - b[0])) / 2 - b[0], y - b[1]), t, font=f, fill=(28, 28, 28, 255), direction='rtl'); y += (b[3] - b[1]) + size * .2
    im = im.filter(ImageFilter.GaussianBlur(0.6))
    _cache[key] = im; return im
def paint(frame, tr, alpha, inset=0.14):
    cx, cy, w, h, ang, _ = tr
    iw, ih = int(w * (1 - 2 * inset)), int(h * (1 - 2 * inset))
    x0, y0 = int(cx - w / 2), int(cy - h / 2)
    reg = frame[max(0, y0):y0 + h, max(0, x0):x0 + w].reshape(-1, 3)
    if reg.size == 0: return
    l = reg.mean(-1); col = np.median(reg[l > np.percentile(l, 65)], 0)
    p = patch(iw, ih, col).rotate(ang, resample=Image.BICUBIC, expand=True)
    pa = np.array(p, np.float32); pw, ph = p.size
    ox, oy = int(cx - pw / 2), int(cy - ph / 2)
    H, W = frame.shape[:2]
    if ox < 0 or oy < 0 or ox + pw > W or oy + ph > H: return
    a = pa[..., 3:] / 255 * alpha
    frame[oy:oy + ph, ox:ox + pw] = frame[oy:oy + ph, ox:ox + pw] * (1 - a) + pa[..., :3] * a
def apply(frames, t0, box, start_ok=0):
    tr = track(frames, t0, box)
    vis = np.array([1.0 if (b[5] and i >= start_ok) else 0.0 for i, b in enumerate(tr)])
    sm = np.convolve(np.pad(vis, 2, mode='edge'), np.ones(5) / 5, mode='valid')
    for i, f in enumerate(frames):
        if sm[i] > 0.02: paint(f, tr[i], float(min(1, sm[i])))
    return frames
