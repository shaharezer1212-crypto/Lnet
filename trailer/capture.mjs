// Capture an animated HTML scene to a webm video via Playwright recordVideo.
// usage: node capture.mjs <scene.html> <durationMs> <outName>
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { renameSync, readdirSync, mkdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const scene = process.argv[2];
const durMs = Number(process.argv[3] || 4500);
const outName = process.argv[4] || 'scene';
const outDir = join(here, 'render', 'webm');
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: exe,
  args: ['--no-sandbox','--force-color-profile=srgb','--disable-gpu','--hide-scrollbars'] });
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1,
  recordVideo: { dir: outDir, size: { width: 1920, height: 1080 } },
});
const page = await ctx.newPage();
await page.goto('file://' + resolve(here, scene));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(durMs);
await page.close();
await ctx.close();
await browser.close();

// rename the produced webm to a stable name
const files = readdirSync(outDir).filter(f => f.endsWith('.webm'));
files.sort();
const latest = files[files.length - 1];
const target = join(outDir, outName + '.webm');
renameSync(join(outDir, latest), target);
console.log('captured', target);
