// Render a scene to a TRANSPARENT png sequence (omitBackground) — used for the
// features overlay where the window "hole" must be transparent for video behind.
// usage: node render_overlay_seq.mjs <scene.html> <durationSec> <outDirName> [fps]
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { mkdirSync, rmSync, existsSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const scene = process.argv[2];
const durSec = Number(process.argv[3] || 9.4);
const outDirName = process.argv[4] || 'overlay_seq';
const fps = Number(process.argv[5] || 30);
const nFrames = Math.round(durSec * fps);

const dir = join(here, 'render', 'frames', outDirName);
if (existsSync(dir)) rmSync(dir, { recursive: true });
mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ executablePath: exe,
  args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--force-color-profile=srgb','--hide-scrollbars'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto('file://' + resolve(here, scene));
await page.evaluate(() => document.fonts.ready);
for (let i = 0; i < nFrames; i++) {
  const tMs = (i / fps) * 1000;
  await page.evaluate((t) => { for (const a of document.getAnimations()) { try { a.pause(); a.currentTime = t; } catch {} } }, tMs);
  await page.screenshot({ path: join(dir, `f${String(i).padStart(4,'0')}.png`), omitBackground: true });
}
await browser.close();
console.log('overlay seq ->', dir, nFrames, 'frames');
