// Render transparent 1080x1920 title overlays for the PM reel.
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
  /* opening hook — white on green, top */
  .hook{position:absolute;left:50%;top:150px;transform:translateX(-50%) rotate(-1.5deg);
    background:var(--teal);color:var(--paper);font-weight:900;font-size:96px;line-height:1.05;
    padding:.3em .55em;border-radius:26px;text-align:center;max-width:940px;
    box-shadow:14px 14px 0 var(--navy)}
  /* keyword — simple white, bottom */
  .kwb{position:absolute;left:0;right:0;bottom:210px;text-align:center;
    font-weight:900;font-size:104px;color:var(--paper);white-space:nowrap;
    text-shadow:0 6px 30px rgba(0,0,0,.55),0 3px 6px rgba(0,0,0,.9)}
  /* logo end-card lower third */
  .lt{position:absolute;left:50%;bottom:210px;transform:translateX(-50%);
    background:var(--paper);border-radius:28px;padding:30px 60px;text-align:center;
    box-shadow:0 16px 44px rgba(0,0,0,.3);border:6px solid var(--navy)}
  .lt .en{font-family:'DejaVu Sans';font-weight:900;font-size:84px;color:var(--navy);line-height:.9;letter-spacing:-1px}
  .lt .en small{font-weight:500;font-size:58px}
  .lt .he{margin-top:10px;font-weight:800;font-size:58px;color:var(--coral)}
`;
const titles = [
  { name: 'hook', html: `<div class="hook">אתם חייבים<br>להיות מנהלי מוצר</div>` },
  { name: 'kw1', html: `<div class="kwb">להוביל</div>` },
  { name: 'kw2', html: `<div class="kwb">לנתח שוק</div>` },
  { name: 'kw3', html: `<div class="kwb">להגדיר אסטרטגיה</div>` },
  { name: 'kw4', html: `<div class="kwb">לתכנן</div>` },
  { name: 'kw5', html: `<div class="kwb">לנהל</div>` },
  { name: 'kw6', html: `<div class="kwb">בינה מלאכותית</div>` },
  { name: 'logo', html: `<div class="lt"><div class="en">Product <small>management</small></div><div class="he">ניהול מוצר</div></div>` },
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
