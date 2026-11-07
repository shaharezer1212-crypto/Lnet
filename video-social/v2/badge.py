"""Track the white name badge (position + angle, template matching) and write 'מפתח/ת למידה' on it."""
import numpy as np
from numpy.lib.stride_tricks import sliding_window_view as swv
from PIL import Image, ImageDraw, ImageFont, ImageFilter
FONT = '/home/user/Lnet/assets/fonts/FbGazoz-Bold.otf'
S = 2
THRESH = 340
def _gray(a): return a[::S, ::S].mean(-1)
def _rot(tpl, ang):
    if abs(ang) < 1e-3: return tpl
    im = Image.fromarray(tpl.astype(np.float32), 'F')
    return np.array(im.rotate(ang, resample=Image.BILINEAR, fillcolor=float(tpl.mean())), np.float32)
def track(frames, t0, box, R=40, scales=(0.95, 1.0, 1.05)):
    """position + angle + scale tracking; returns (cx, cy, w, h, ang, ok)"""
    x0, y0, x1, y1 = [v // S for v in box]; W0, H0 = x1 - x0, y1 - y0
    n = len(frames); out = [None] * n
    def run(order):
        base = _gray(frames[t0])[y0:y1, x0:x1].copy(); cx, cy, ang, sc = x0 + W0 / 2, y0 + H0 / 2, 0.0, 1.0
        for i in order:
            g = _gray(frames[i]); H, W = g.shape; best = None
            for s_ in [sc * k for k in scales]:
                w, h = max(8, int(W0 * s_)), max(6, int(H0 * s_))
                tb = np.array(Image.fromarray(base.astype(np.float32), 'F').resize((w, h), Image.BILINEAR), np.float32)
                px, py = int(cx - w / 2), int(cy - h / 2)
                sx0, sy0 = max(0, px - R), max(0, py - R); sx1, sy1 = min(W, px + w + R), min(H, py + h + R)
                if sx1 - sx0 < w or sy1 - sy0 < h: continue
                win = swv(g[sy0:sy1, sx0:sx1], (h, w))
                for a in (ang - 6, ang - 3, ang, ang + 3, ang + 6):
                    t = _rot(tb, a); d = ((win - t) ** 2).mean((-1, -2)); j = np.unravel_index(np.argmin(d), d.shape)
                    if best is None or d[j] < best[0]: best = (d[j], sx0 + j[1] + w / 2, sy0 + j[0] + h / 2, a, s_)
            ok = best is not None and best[0] < THRESH
            if ok: _, cx, cy, ang, sc = best; ang = float(np.clip(ang, -35, 35)); sc = float(np.clip(sc, 0.4, 2.5))
            out[i] = (cx * S, cy * S, W0 * sc * S, H0 * sc * S, ang, ok)
    run(range(t0, n)); run(range(t0, -1, -1))
    return out
_cache = {}
def card_img(w, h, lines, fill=(250, 250, 248), border=(150, 150, 150), ink=(28, 28, 28)):
    key = (w, h, lines, fill, border, ink)
    if key in _cache: return _cache[key]
    im = Image.new('RGBA', (w + 8, h + 8), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((5, 6, w + 5, h + 6), radius=max(4, w // 12), fill=(0, 0, 0, 40))          # soft contact shadow
    d.rounded_rectangle((2, 2, w + 1, h + 1), radius=max(4, w // 12), fill=fill + (255,), outline=border + (255,), width=max(2, w // 45))
    for size in range(110, 8, -1):
        f = ImageFont.truetype(FONT, size)
        bbs = [d.textbbox((0, 0), t, font=f, direction='rtl') for t in lines]
        lw = max(b[2] - b[0] for b in bbs); lh = sum(b[3] - b[1] for b in bbs) + size * .22 * (len(lines) - 1)
        if lw <= w * .8 and lh <= h * .72: break
    y = 2 + (h - lh) / 2
    for t, b in zip(lines, bbs):
        d.text((2 + (w - (b[2] - b[0])) / 2 - b[0], y - b[1]), t, font=f, fill=ink + (255,), direction='rtl'); y += (b[3] - b[1]) + size * .22
    im = im.filter(ImageFilter.GaussianBlur(0.5)); _cache[key] = im; return im
def plain_img(w, h, lines, col, ink=(28, 28, 28)):
    key = ('plain', w, h, lines, col, ink)
    if key in _cache: return _cache[key]
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).rounded_rectangle((3, 3, w - 4, h - 4), radius=max(3, w // 10), fill=255)
    m = m.filter(ImageFilter.GaussianBlur(max(1.2, w / 60)))
    im = Image.new('RGBA', (w, h), col + (0,)); im.putalpha(m)
    d = ImageDraw.Draw(im)
    for size in range(110, 8, -1):
        f = ImageFont.truetype(FONT, size)
        bbs = [d.textbbox((0, 0), t, font=f, direction='rtl') for t in lines]
        lw = max(b[2] - b[0] for b in bbs); lh = sum(b[3] - b[1] for b in bbs) + size * .22 * (len(lines) - 1)
        if lw <= w * .8 and lh <= h * .76: break
    t_ = Image.new('RGBA', (w, h), (0, 0, 0, 0)); dt = ImageDraw.Draw(t_)
    y = (h - lh) / 2
    for t, b in zip(lines, bbs):
        dt.text(((w - (b[2] - b[0])) / 2 - b[0], y - b[1]), t, font=f, fill=ink + (235,), direction='rtl'); y += (b[3] - b[1]) + size * .22
    im.alpha_composite(t_.filter(ImageFilter.GaussianBlur(0.4)))
    _cache[key] = im; return im
def measure_angle(frame, cx, cy, w, h):
    """long-axis angle of the bright badge blob (degrees, PIL convention)"""
    x0, y0 = int(cx - w * .65), int(cy - h * .65); x1, y1 = int(cx + w * .65), int(cy + h * .65)
    reg = frame[max(0, y0):y1, max(0, x0):x1]
    if reg.size == 0: return None
    l = reg.mean(-1); sat = reg.max(-1) - reg.min(-1)
    ys, xs = np.nonzero((l > 205) & (sat < 28))
    if len(xs) < 40: return None
    c = np.cov(np.vstack([xs - xs.mean(), ys - ys.mean()])); ev, evec = np.linalg.eigh(c)
    vx, vy = evec[:, 1]; th = np.degrees(np.arctan2(vy, vx))
    th = (th + 90) % 180 - 90
    if abs(th) > 45: return None
    return -th
def apply(frames, t0, box, start_ok=0, lines=('מפתח/ת', 'למידה'), inset=0.02, fill=(250, 250, 248), border=(150, 150, 150), ink=(28, 28, 28), lock=False, steady=True, plain=False):
    tr = track(frames, t0, box, scales=(1.0,) if lock else (0.95, 1.0, 1.05))
    if steady:
        # never fade: hold the last good position through tracking drops; keep the card level
        good = [i for i, b in enumerate(tr) if b[5]]
        if good:
            last = None; fixed = []
            first = tr[good[0]]
            for i, b in enumerate(tr):
                if b[5]: last = b
                fixed.append(last if last is not None else first)
            tr = [(b[0], b[1], b[2], b[3], 0.0, True) for b in fixed]
    vis = np.array([1.0 if (b[5] and i >= start_ok) else 0.0 for i, b in enumerate(tr)])
    sm = vis if steady else np.convolve(np.pad(vis, 2, mode='edge'), np.ones(5) / 5, mode='valid')
    angs = []
    for i, b in enumerate(tr):
        a = None if steady else measure_angle(frames[i], b[0], b[1], b[2], b[3]); angs.append(b[4] if a is None else a)
    angs = np.array(angs, np.float32); pad = np.pad(angs, 3, mode='edge')
    angs = np.array([np.median(pad[i:i + 7]) for i in range(len(angs))])
    K = 7 if steady else 3; cxs = np.convolve(np.pad([b[0] for b in tr], K // 2, mode='edge'), np.ones(K) / K, mode='valid')
    cys = np.convolve(np.pad([b[1] for b in tr], K // 2, mode='edge'), np.ones(K) / K, mode='valid')
    H, W = frames[0].shape[:2]
    for i, f in enumerate(frames):
        if sm[i] <= 0.02: continue
        w, h = tr[i][2], tr[i][3]; cw, ch = max(10, int(w * (1 - 2 * inset))), max(8, int(h * (1 - 2 * inset)))
        if plain:
            # text printed on the badge itself: fill only the inner area in the badge's own colour, soft edges
            cx0, cy0 = int(cxs[i] - w / 2), int(cys[i] - h / 2)
            reg = f[max(0, cy0):cy0 + int(h), max(0, cx0):cx0 + int(w)].reshape(-1, 3)
            l = reg.mean(-1); col = np.median(reg[l > np.percentile(l, 70)], 0)
            iw, ih = max(10, int(w * 0.9)), max(8, int(h * 0.86))
            p = plain_img(iw, ih, tuple(lines), tuple(int(c) for c in (col // 3 * 3)), tuple(ink))
        else:
            p = card_img(cw, ch, tuple(lines), tuple(fill), tuple(border), tuple(ink))
        p = p.rotate(float(angs[i]), resample=Image.BICUBIC, expand=True)
        pa = np.array(p, np.float32); pw, ph = p.size; ox, oy = int(cxs[i] - pw / 2), int(cys[i] - ph / 2)
        if ox < 0 or oy < 0 or ox + pw > W or oy + ph > H: continue
        a = pa[..., 3:] / 255 * float(min(1, sm[i]))
        f[oy:oy + ph, ox:ox + pw] = f[oy:oy + ph, ox:ox + pw] * (1 - a) + pa[..., :3] * a
    return frames
