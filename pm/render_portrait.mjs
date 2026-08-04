// Deterministic portrait (1080x1920) scene renderer for the PM reel.
// usage: node render_portrait.mjs <scene.html> <durationSec> <outName> [fps]
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { mkdirSync, rmSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FF = '/home/user/Lnet/trailer/bin/ffmpeg-master-latest-linux64-gpl/bin/ffmpeg';
const scene = process.argv[2];
const durSec = Number(process.argv[3] || 1.3);
const outName = process.argv[4] || 'scene';
const fps = Number(process.argv[5] || 30);
const transparent = process.env.TRANSPARENT === '1';
const nFrames = Math.round(durSec * fps);

const framesDir = join(here, 'render', 'frames', outName);
if (existsSync(framesDir)) rmSync(framesDir, { recursive: true });
mkdirSync(framesDir, { recursive: true });
mkdirSync(join(here, 'render'), { recursive: true });

const browser = await chromium.launch({ executablePath: exe,
  args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--force-color-profile=srgb','--hide-scrollbars'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto('file://' + resolve(here, scene));
await page.evaluate(() => document.fonts.ready);
const ext = transparent ? 'png' : 'jpg';
for (let i = 0; i < nFrames; i++) {
  const tMs = (i / fps) * 1000;
  await page.evaluate((t) => { for (const a of document.getAnimations()) { try { a.pause(); a.currentTime = t; } catch {} } }, tMs);
  const opts = transparent ? { path: join(framesDir, `f${String(i).padStart(4,'0')}.png`), omitBackground: true }
                           : { path: join(framesDir, `f${String(i).padStart(4,'0')}.jpg`), type: 'jpeg', quality: 95 };
  await page.screenshot(opts);
}
await browser.close();

if (!transparent) {
  const out = join(here, 'render', outName + '.mp4');
  const r = spawnSync(FF, ['-hide_banner','-loglevel','error','-y','-framerate', String(fps),
    '-i', join(framesDir, `f%04d.${ext}`),
    '-c:v','libx264','-pix_fmt','yuv420p','-crf','17','-r', String(fps), out], { stdio: 'inherit' });
  console.log(r.status === 0 ? 'encoded ' + out : 'ffmpeg failed');
} else {
  console.log('transparent seq ->', framesDir, nFrames, 'frames');
}
