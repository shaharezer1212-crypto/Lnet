const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+process.cwd()+'/overlay.html');await p.evaluate(c=>setup(c),require(process.cwd()+'/'+process.argv[2]));await p.evaluate(()=>document.fonts.ready);
for(const t of process.argv.slice(3)){await p.evaluate(t=>render(+t),t);await p.screenshot({path:'still-'+t+'.png',omitBackground:true});}await b.close();})();
