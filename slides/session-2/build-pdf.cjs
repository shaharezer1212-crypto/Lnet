// Export the deck to a light PDF, one slide per page, each slide as it looks
// once its animations have finished:
//   python3 -m http.server 8765   (from the repository root), then
//   node slides/session-2/build-pdf.cjs
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const base = process.env.DECK_URL || 'http://localhost:8765/slides/session-2/index.html';
  const out = path.join(__dirname, 'session-2.pdf');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(base + '#1');
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1');
  const n = await page.evaluate(() => document.querySelectorAll('.slide').length);
  const shots = [];
  for (let i = 1; i <= n; i++) {
    await page.evaluate(k => { location.hash = '#' + k; }, i);
    await page.waitForTimeout(5200); // let the entrance, the typing and the counters finish
    shots.push((await page.screenshot({ type: 'jpeg', quality: 84 })).toString('base64'));
  }
  const doc = await browser.newPage();
  await doc.setContent('<style>@page{size:1920px 1080px;margin:0}body{margin:0}img{display:block;width:1920px;height:1080px;break-after:page}</style>' +
    shots.map(s => '<img src="data:image/jpeg;base64,' + s + '">').join(''));
  await doc.pdf({ path: out, width: '1920px', height: '1080px', printBackground: true });
  await browser.close();
  console.log('wrote', out, n, 'slides');
})();
