"""Find the white name badge in each frame (bright, low-saturation blob that survives an opening),
nearest to the previous position; return centre, size and angle. Then print text into it."""
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageFont
FONT = '/home/user/Lnet/assets/fonts/FbGazoz-Bold.otf'
def blobs(mask):
    """simple connected components on a small binary mask (4-neighbour flood fill)"""
    H, W = mask.shape; lab = np.zeros((H, W), np.int32); n = 0; out = []
    for y0, x0 in zip(*np.nonzero(mask)):
        if lab[y0, x0]: continue
        n += 1; st = [(y0, x0)]; lab[y0, x0] = n; pts = []
        while st:
            y, x = st.pop(); pts.append((y, x))
            for yy, xx in ((y+1, x), (y-1, x), (y, x+1), (y, x-1)):
                if 0 <= yy < H and 0 <= xx < W and mask[yy, xx] and not lab[yy, xx]:
                    lab[yy, xx] = n; st.append((yy, xx))
        out.append(np.array(pts))
    return out
def detect(frame, prev, R=170, k=9):
    s = 4; cx, cy = prev
    x0, y0 = int(max(0, cx - R)), int(max(0, cy - R)); x1, y1 = int(min(frame.shape[1], cx + R)), int(min(frame.shape[0], cy + R))
    reg = frame[y0:y1:s, x0:x1:s]
    l = reg.mean(-1); sat = reg.max(-1) - reg.min(-1)
    m = ((l > 165) & (sat < 38)).astype(np.uint8) * 255
    mi = Image.fromarray(m).filter(ImageFilter.MinFilter(k // s * 2 + 1 if k // s >= 1 else 3)).filter(ImageFilter.MaxFilter(k // s * 2 + 1 if k // s >= 1 else 3))
    mm = np.array(mi) > 0
    best = None
    for p in blobs(mm):
        if len(p) < 12: continue
        ys, xs = p[:, 0] * s + y0, p[:, 1] * s + x0
        c = np.array([xs.mean(), ys.mean()]); d = np.hypot(*(c - np.array(prev)))
        cov = np.cov(np.vstack([xs - xs.mean(), ys - ys.mean()])); ev, evec = np.linalg.eigh(cov)
        elong = ev[1] / max(ev[0], 1e-3)
        if elong > 4: continue          # rays and straps are long and thin
        # the badge sits on Claude's orange body: the band around its box must be mostly orange
        bx0, bx1, by0, by1 = int(xs.min()), int(xs.max()), int(ys.min()), int(ys.max()); pad = max(8, int((bx1 - bx0) * .25))
        ring = frame[max(0, by0 - pad):by1 + pad:3, max(0, bx0 - pad):bx1 + pad:3]
        rr, gg, bb_ = ring[..., 0], ring[..., 1], ring[..., 2]
        orange = ((rr > 170) & (gg > 60) & (gg < 170) & (bb_ < 120) & (rr - bb_ > 80)).mean()
        if orange < 0.18: continue
        fill = len(p) * 16 / max(1, (bx1 - bx0 + 4) * (by1 - by0 + 4))
        if fill < 0.6: continue
        score = d * 0.5 - len(p) * 0.3 - fill * 80
        if best is None or score < best[0]:
            vx, vy = evec[:, 1]; ang = np.degrees(np.arctan2(vy, vx)); ang = (ang + 90) % 180 - 90
            if abs(ang) > 45: ang = ang - 90 if ang > 0 else ang + 90
            w = 4 * np.sqrt(ev[1]); h = 4 * np.sqrt(ev[0])
            if abs((np.degrees(np.arctan2(vy, vx)) + 90) % 180 - 90) > 45: w, h = h, w
            best = (score, c[0], c[1], w, h, -ang, len(p))
    return best
def track(frames, start_center):
    out = []; prev = start_center
    for f in frames:
        b = detect(f, prev)
        if b: prev = (b[1], b[2]); out.append(b)
        else: out.append(None)
    return out
def text_img(w, h, lines=('מפתח/ת', 'למידה'), ink=(28, 28, 28)):
    w, h = max(12, int(w)), max(10, int(h))
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for size in range(120, 6, -1):
        f = ImageFont.truetype(FONT, size)
        bbs = [d.textbbox((0, 0), t, font=f, direction='rtl') for t in lines]
        lw = max(b[2] - b[0] for b in bbs); lh = sum(b[3] - b[1] for b in bbs) + size * .22
        if lw <= w * .78 and lh <= h * .7: break
    y = (h - lh) / 2
    for t, b in zip(lines, bbs):
        d.text(((w - (b[2] - b[0])) / 2 - b[0], y - b[1]), t, font=f, fill=ink + (235,), direction='rtl'); y += (b[3] - b[1]) + size * .22
    return im.filter(ImageFilter.GaussianBlur(0.35))
def smooth(v, k=5):
    v = np.array(v, np.float32); p = np.pad(v, (k // 2, k // 2), mode='edge')
    return np.convolve(p, np.ones(k) / k, mode='valid')
def apply(frames, start_center, size_hint=None, manual=None):
    tr = track(frames, start_center)
    if manual:   # (until_frame, cx, cy, w, h, ang): pin the badge where detection can't see it, then blend
        n, mx, my, mw, mh, ma = manual
        firstgood = next((i for i in range(n, len(tr)) if tr[i]), None)
        for i in range(min(n, len(tr))): tr[i] = (0, mx, my, mw, mh, ma, 0)
        if firstgood:
            g = tr[firstgood]
            for i in range(n, firstgood):
                u = (i - n + 1) / (firstgood - n + 1)
                tr[i] = (0,) + tuple(a * (1 - u) + b * u for a, b in zip((mx, my, mw, mh, ma), g[1:6])) + (0,)
    ok = [t is not None for t in tr]
    # fill gaps with nearest good detection
    last = next((t for t in tr if t), None); fixed = []
    for t in tr:
        if t: last = t
        fixed.append(last)
    cx, cy = smooth([t[1] for t in fixed]), smooth([t[2] for t in fixed])
    w, h = smooth([t[3] for t in fixed], 7), smooth([t[4] for t in fixed], 7)
    ang = smooth([t[5] for t in fixed], 5)
    for i, f in enumerate(frames):
        p = text_img(w[i], h[i]).rotate(float(ang[i]), resample=Image.BICUBIC, expand=True)
        pa = np.array(p, np.float32); pw, ph = p.size; ox, oy = int(cx[i] - pw / 2), int(cy[i] - ph / 2)
        if ox < 0 or oy < 0 or ox + pw > f.shape[1] or oy + ph > f.shape[0]: continue
        a = pa[..., 3:] / 255
        f[oy:oy + ph, ox:ox + pw] = f[oy:oy + ph, ox:ox + pw] * (1 - a) + pa[..., :3] * a
    return tr
