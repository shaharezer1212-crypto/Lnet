"""Compose the base picture: each scene draws itself in pencil on paper, then its clip plays.
usage: python3 compose.py plan.json outdir"""
import json, sys, os, subprocess, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import grade as G, badge as B, detect as D
from PIL import Image, ImageFilter
W, H, FPS = 1080, 1920, 30
PAPER = G.PAPER
plan = json.load(open(sys.argv[1])); out = sys.argv[2]; os.makedirs(out, exist_ok=True)
rng = np.random.default_rng(7)
noise = np.array(Image.fromarray((rng.random((H // 8, W // 8)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(6)), np.float32) / 255
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
sweep = 0.6 * (xx / W)[:, :] + 0.25 * (yy / H) + 0.35 * noise   # lines appear right-to-left, top-to-bottom, with a hand-drawn jitter
sweep = (sweep - sweep.min()) / (sweep.max() - sweep.min())
def smooth(x): x = np.clip(x, 0, 1); return x * x * (3 - 2 * x)
def lineart(img):
    g = Image.fromarray(img.astype(np.uint8)).convert('L')
    a = np.array(g.filter(ImageFilter.GaussianBlur(1.2)), np.float32); b = np.array(g.filter(ImageFilter.GaussianBlur(5)), np.float32)
    d = np.clip((b - a - 4) / 16, 0, 1) ** 0.8
    return d[..., None]
def frames(clip, start, n):
    tmp = f'/tmp/claude-0/-home-user-Lnet/bde28191-6427-5f3c-9348-1f34a6616c66/scratchpad/fx_{os.path.basename(clip)}'
    os.makedirs(tmp, exist_ok=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(start), '-i', clip, '-vf', f'fps={FPS},scale={W}:{H}:flags=lanczos', '-frames:v', str(n), f'{tmp}/%04d.png'], check=True)
    fs = sorted(os.listdir(tmp))[:n]
    out_ = [np.array(Image.open(f'{tmp}/{f}').convert('RGB'), np.float32) for f in fs]
    for f in os.listdir(tmp): os.remove(f'{tmp}/{f}')
    while len(out_) < n: out_.append(out_[-1])
    return out_
k = 0
import hashlib, shutil
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cache')
def save(a):
    global k; Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(f'{out}/f{k:04d}.jpg', quality=93); k += 1
prev = None
def scene_key(sc, prev_key):
    h = hashlib.md5((json.dumps(sc, sort_keys=True) + str(prev_key)).encode())
    if sc.get('clip'): h.update(str(os.path.getmtime(sc['clip'])).encode())
    for f in ('grade.py', 'badge.py', 'compose.py', 'detect.py'): h.update(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), f), 'rb').read())
    return h.hexdigest()[:12]
prev_key = None
for sc in plan['scenes']:
    key = scene_key(sc, prev_key); cdir = os.path.join(CACHE, key)
    if os.path.isdir(cdir) and os.path.exists(os.path.join(cdir, 'done')):
        fs = sorted(f for f in os.listdir(cdir) if f.endswith('.jpg'))
        for f in fs: shutil.copy(os.path.join(cdir, f), f'{out}/f{k:04d}.jpg'); k += 1
        prev = np.array(Image.open(os.path.join(cdir, fs[-1])), np.float32) if not sc.get('paper') else None
        prev_key = key; continue
    k0 = k
    if sc.get('paper'):
        pap = G.grade(np.full((H, W, 3), 250, np.float32))
        for i in range(round(sc['len'] * FPS)): save(pap)
        prev = None
        os.makedirs(cdir, exist_ok=True)
        for i in range(k0, k): shutil.copy(f'{out}/f{i:04d}.jpg', os.path.join(cdir, f'f{i - k0:04d}.jpg'))
        open(os.path.join(cdir, 'done'), 'w').close(); prev_key = key
        continue
    n_in = round(sc['draw'] * FPS); n_clip = round(sc['len'] * FPS) - n_in
    clip = frames(sc['clip'], sc.get('start', 0), min(n_clip, round(sc.get('maxclip', 99) * FPS))) if sc.get('clip') else None
    if clip:
        while len(clip) < n_clip: clip.append(clip[-1].copy())
    if clip:
        clip = [G.grade(f) for f in clip]
        if sc.get('detect'):
            dd = sc['detect']; D.apply(clip, tuple(dd['start']), manual=tuple(dd['manual']) if dd.get('manual') else None)
        for bd in ([sc['badge']] if isinstance(sc.get('badge'), dict) else sc.get('badge', [])):
            B.apply(clip, bd['t0'], tuple(bd['box']), bd.get('ok', 0), **{k: bd[k] for k in ('lines', 'fill', 'border', 'ink', 'inset', 'lock', 'plain', 'textonly', 'steady') if k in bd})
    first = clip[0] if clip else np.array(Image.open(sc['still']).convert('RGB').resize((W, H)), np.float32)
    if prev is not None:   # erase the previous scene with a quick sweep back to paper
        for i in range(sc.get('erase', 8)):
            p = smooth((i + 1) / sc.get('erase', 8)); m = (sweep[..., None] > 1 - p * 1.15).astype(np.float32)
            m = np.array(Image.fromarray((m[..., 0] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(10)), np.float32)[..., None] / 255
            save(prev * (1 - m) + PAPER * m)
    la = lineart(first); gray = first.mean(-1, keepdims=True); shade = PAPER * 0.15 + gray * 0.85
    a1, a2 = int(n_in * .55), int(n_in * .8)
    for i in range(n_in):
        if i < a1:
            p = smooth((i + 1) / a1); m = np.clip((p * 1.12 - sweep) * 9, 0, 1)[..., None]
            save(PAPER * (1 - la * m * 0.85) + 0)
        elif i < a2:
            p = smooth((i - a1 + 1) / (a2 - a1)); base = PAPER * (1 - la * 0.85)
            save(base * (1 - p) + shade * p)
        else:
            p = smooth((i - a2 + 1) / (n_in - a2)); save(shade * (1 - p) + first * p)
    seq = clip if clip else [first] * n_clip
    for f in seq: save(f)
    prev = seq[-1]
    os.makedirs(cdir, exist_ok=True)
    for i in range(k0, k): shutil.copy(f'{out}/f{i:04d}.jpg', os.path.join(cdir, f'f{i - k0:04d}.jpg'))
    open(os.path.join(cdir, 'done'), 'w').close(); prev_key = key
print('frames', k, 'seconds', k / FPS)
