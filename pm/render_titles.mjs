// Render transparent 1080x1920 title overlays (logo lower-third + 6 keyword badges).
import { chromium } from 'playwright-core';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'render', 'titles');
mkdirSync(out, { recursive: true });

const FONT = 'file://' + join(here, 'fonts', 'almoni-regular.otf');
const CSS = `
  @font-face{font-family:'Almoni';src:url('${FONT}') format('opentype');font-weight:400 900}
  :root{--navy:#282331;--teal:#1BA88A;--coral:#F65E5E;--peach:#F5C07A;--olive:#C8CD6B;--paper:#fff}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1080px;height:1920px;background:transparent;font-family:'Almoni','DejaVu Sans',sans-serif}
  .stage{position:relative;width:1080px;height:1920px}
  /* logo lower-third */
  .lt{position:absolute;left:50%;bottom:150px;transform:translateX(-50%);
    background:var(--paper);border-radius:26px;padding:26px 54px;text-align:center;
    box-shadow:0 14px 40px rgba(0,0,0,.28);border:5px solid var(--navy)}
  .lt .en{font-family:'DejaVu Sans';font-weight:900;font-size:76px;color:var(--navy);line-height:.9;letter-spacing:-1px}
  .lt .en small{font-weight:500;font-size:52px}
  .lt .he{margin-top:8px;font-weight:800;font-size:52px;color:var(--coral)}
  /* keyword badge */
  .kw{position:absolute;left:50%;top:500px;transform:translateX(-50%) rotate(-3deg);
    font-weight:900;font-size:110px;color:var(--paper);white-space:nowrap;
    padding:.18em .6em;border-radius:28px;box-shadow:14px 14px 0 var(--navy)}
`;

const titles = [
  { name: 'logo', html: `<div class="lt"><div class="en">Product <small>management</small></div><div class="he">ניהול מוצר</div></div>` },
  { name: 'kw1', html: `<div class="kw" style="background:var(--coral)">להוביל</div>` },
  { name: 'kw2', html: `<div class="kw" style="background:var(--teal)">לנתח שוק</div>` },
  { name: 'kw3', html: `<div class="kw" style="background:var(--navy)">להגדיר אסטרטגיה</div>` },
  { name: 'kw4', html: `<div class="kw" style="background:var(--coral)">לתכנן</div>` },
  { name: 'kw5', html: `<div class="kw" style="background:var(--olive);color:var(--navy);box-shadow:14px 14px 0 var(--navy)">לנהל</div>` },
  { name: 'kw6', html: `<div class="kw" style="background:var(--teal)">בינה מלאכותית</div>` },
];

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--force-color-profile=srgb'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
for (const t of titles) {
  await p.setContent(`<!doctype html><html lang="he"><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="stage" dir="rtl">${t.html}</div></body></html>`);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: join(out, t.name + '.png'), omitBackground: true });
  console.log('title', t.name);
}
await b.close();
