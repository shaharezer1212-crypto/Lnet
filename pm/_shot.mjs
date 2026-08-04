import { chromium } from 'playwright-core';
import { resolve } from 'node:path';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--force-color-profile=srgb'] });
const p = await b.newPage({ viewport:{width:1080,height:1920} });
await p.goto('file://'+resolve(process.argv[2]));
await p.evaluate(()=>document.fonts.ready);
await p.screenshot({ path: process.argv[3] });
await b.close(); console.log('shot', process.argv[3]);
