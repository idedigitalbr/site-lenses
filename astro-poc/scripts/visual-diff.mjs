/**
 * Regression visual: browser compares main source served statically and Astro build.
 * Both use the same local asset bytes; tests must run after npm run build.
 * No deployment, no writing to repository source.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import pixelmatch from 'pixelmatch';
import {PNG} from 'pngjs';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const baseline=path.resolve(project,'..');
const candidate=path.join(project,'dist');
const out=path.join(project,'visual-output');
fs.mkdirSync(out,{recursive:true});
const mime={
 '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'text/javascript; charset=utf-8','.json':'application/json',
 '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg',
 '.webp':'image/webp','.gif':'image/gif','.avif':'image/avif',
 '.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff',
 '.mp4':'video/mp4','.webm':'video/webm','.ico':'image/x-icon'
};
function server(root,port){
  return new Promise(resolve=>{
    const instance=http.createServer((request,response)=>{
      try{
        let local=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
        if(!local.startsWith('/site-lenses/')){response.writeHead(404);response.end();return;}
        local=local.slice('/site-lenses/'.length);
        let file=path.resolve(root,local||'index.html');
        if(!file.startsWith(root+path.sep)&&file!==root){response.writeHead(403);response.end();return;}
        if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
        if(!fs.existsSync(file)){response.writeHead(404);response.end('Not found: '+local);return;}
        const stat=fs.statSync(file);
        response.writeHead(200,{
          'Content-Type':mime[path.extname(file).toLowerCase()]||'application/octet-stream',
          'Content-Length':stat.size,
          'Cache-Control':'no-store'
        });
        fs.createReadStream(file).pipe(response);
      }catch(error){response.writeHead(500);response.end(String(error));}
    }).listen(port,'127.0.0.1',()=>resolve(instance));
  });
}
const pages=[
  {name:'home',url:'',y:0},
  {name:'sobre',url:'sobre.html',y:0},
  {name:'bellamazon',url:'casev2/bellamazon/',y:0},
  {name:'bellamazon-mid',url:'casev2/bellamazon/',y:900},
];
const viewports=[{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}];
const maxDiff=Number(process.env.LENSES_MAX_PIXEL_DIFF||'0.005');
let browser,servers=[],failures=[];
try{
  servers=[await server(baseline,4182),await server(candidate,4183)];
  browser=await chromium.launch({headless:true});
  for(const viewport of viewports)for(const test of pages){
    const captures=[];
    for(const port of [4182,4183]){
      const ctx=await browser.newContext({
        viewport:{width:viewport.width,height:viewport.height},
        reducedMotion:'reduce',colorScheme:'light',deviceScaleFactor:1
      });
      const page=await ctx.newPage();
      await page.goto('http://127.0.0.1:'+port+'/site-lenses/'+test.url,
        {waitUntil:'domcontentloaded',timeout:60000});
      await page.evaluate(()=>document.fonts?.ready).catch(()=>{});
      await page.waitForTimeout(450);
      if(test.y)await page.evaluate(y=>window.scrollTo(0,y),test.y);
      await page.waitForTimeout(250);
      captures.push(PNG.sync.read(await page.screenshot({animations:'disabled'})));
      await ctx.close();
    }
    const [a,b]=captures;
    if(a.width!==b.width||a.height!==b.height)throw Error('Dimensão divergente '+test.name);
    const diff=new PNG({width:a.width,height:a.height});
    const changed=pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.12});
    const ratio=changed/(a.width*a.height),key=test.name+'-'+viewport.name;
    fs.writeFileSync(path.join(out,key+'-diff.png'),PNG.sync.write(diff));
    console.log('[VISUAL]',key,(ratio*100).toFixed(3)+'% de pixels diferentes');
    if(ratio>maxDiff)failures.push(key+': '+(ratio*100).toFixed(3)+'% acima de '+(maxDiff*100).toFixed(2)+'%');
  }
}finally{
  if(browser)await browser.close();
  for(const s of servers)await new Promise(done=>s.close(done));
}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log('Regressão visual aprovada nas rotas e viewports testadas. Ainda revisar animações em scroll normal.');
