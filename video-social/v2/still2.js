const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+process.cwd()+'/overlay.html');await p.evaluate(c=>setup(c),require(process.cwd()+'/cfg.json'));await p.evaluate(()=>document.fonts.ready);

for(const t of process.argv.slice(2)){await p.evaluate(t=>render(+t),t);await p.screenshot({omitBackground:true,path:'/tmp/claude-0/-home-user-Lnet/bde28191-6427-5f3c-9348-1f34a6616c66/scratchpad/in-'+t+'.png'});}await b.close();})();
