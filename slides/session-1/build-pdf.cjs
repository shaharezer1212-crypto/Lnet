// Export the deck to PDF, one slide per page:
//   python3 -m http.server 8765   (from the repository root), then
//   node slides/session-1/build-pdf.cjs
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const url = process.env.DECK_URL || 'http://localhost:8765/slides/session-1/index.html?print';
  const out = path.join(__dirname, 'session-1.pdf');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(url);
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1');
  await page.waitForTimeout(800);
  await page.pdf({ path: out, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log('wrote', out);
})();
