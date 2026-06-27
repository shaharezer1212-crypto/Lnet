import { chromium } from 'playwright-core';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const scale = Number(process.env.SCALE || 1);

const files = (process.argv[2] ? [process.argv[2]] :
  readdirSync(here).filter(f => /^frame\d+\.html$/.test(f)).sort());

const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox','--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
for (const f of files) {
  await page.goto('file://' + join(here, f));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  const out = join(here, f.replace('.html', '.png'));
  await page.screenshot({ path: out });
  console.log('rendered', out);
}
await browser.close();
