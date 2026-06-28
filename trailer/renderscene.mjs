// Deterministic scene renderer: drive every animation's clock via WAAPI,
// screenshot each frame, then encode to mp4. Exact timing, crisp PNG frames.
// usage: node renderscene.mjs <scene.html> <durationSec> <outName> [fps]
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { mkdirSync, rmSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FF = join(here, 'node_modules/@ffmpeg-installer/linux-x64/ffmpeg');

const scene = process.argv[2];
const durSec = Number(process.argv[3] || 4.5);
const outName = process.argv[4] || 'scene';
const fps = Number(process.argv[5] || 30);
const nFrames = Math.round(durSec * fps);

const framesDir = join(here, 'render', 'frames', outName);
if (existsSync(framesDir)) rmSync(framesDir, { recursive: true });
mkdirSync(framesDir, { recursive: true });
mkdirSync(join(here, 'render', 'mp4'), { recursive: true });

const browser = await chromium.launch({ executablePath: exe,
  args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--force-color-profile=srgb','--hide-scrollbars'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto('file://' + resolve(here, scene));
await page.evaluate(() => document.fonts.ready);

for (let i = 0; i < nFrames; i++) {
  const tMs = (i / fps) * 1000;
  await page.evaluate((t) => {
    for (const a of document.getAnimations()) { try { a.pause(); a.currentTime = t; } catch {} }
  }, tMs);
  const n = String(i).padStart(4, '0');
  await page.screenshot({ path: join(framesDir, `f${n}.jpg`), type: 'jpeg', quality: 94 });
}
await browser.close();

const out = join(here, 'render', 'mp4', outName + '.mp4');
const r = spawnSync(FF, ['-hide_banner','-loglevel','error','-y','-framerate', String(fps),
  '-i', join(framesDir, 'f%04d.jpg'),
  '-c:v','libx264','-pix_fmt','yuv420p','-crf','17','-r', String(fps), out], { stdio: 'inherit' });
console.log(r.status === 0 ? 'encoded ' + out : 'ffmpeg failed');
