// node frames.js cfg.json seconds outdir  → transparent PNG per frame at 30fps
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [cfg,secs,out]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+process.cwd()+'/overlay.html');await p.evaluate(c=>setup(c),JSON.parse(fs.readFileSync(cfg)));await p.evaluate(()=>document.fonts.ready);
const n=Math.round(+secs*30);for(let i=0;i<n;i++){await p.evaluate(t=>render(t),i/30);await p.screenshot({path:`${out}/f${String(i).padStart(4,'0')}.png`,omitBackground:true});}
await b.close();console.log('frames',n);})();
