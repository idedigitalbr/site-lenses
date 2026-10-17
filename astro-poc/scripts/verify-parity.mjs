import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repo=path.resolve(project,'..');
const dist=path.join(project,'dist');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const read=p=>fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');
const tested=[
  ['Home','index.html','index.html',false],
  ['Bellamazon','casev2/bellamazon/index.html','casev2/bellamazon/index.html',false],
  ['Sobre antigo (alias)','sobre.html','sobre.html',true],
  ['Design system antigo (alias)','design-system-preview.html','design-system-preview.html',true],
];
let errors=[];
for(const [label,source,target,exact] of tested){
 const a=path.join(repo,source),b=path.join(dist,target);
 if(!fs.existsSync(b)){errors.push(label+': página ausente no build: '+target);continue;}
 const original=read(a),produced=read(b);
 const body=html=>html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1]?.trim();
 const tags=(html,attr)=>[...html.matchAll(new RegExp('\\b'+attr+'=["\\x27]([^"\\x27]+)', 'g'))].map(m=>m[1]);
 const title=html=>html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
 if(title(original)!==title(produced))errors.push(label+': TITLE diferente');
 if(exact&&original!==produced)errors.push(label+': alias não é idêntico');
 if(!exact){
   if(body(original)!==body(produced))errors.push(label+': BODY/DOM mudou (animações em risco)');
   for(const attr of ['href','src']){
     if(JSON.stringify(tags(original,attr))!==JSON.stringify(tags(produced,attr)))
       errors.push(label+': ordem ou URLs '+attr+' alteradas');
   }
 }
 console.log('[Parity]',label, 'origem',hash(original),'saída',hash(produced));
}
for(const filename of ['tokens.css','base.css','components.css','pages.css','styles.css','typography.css',
  'bellamazon-mosaic.js','bellamazon-dashboard.js']){
 const src=path.join(repo,'assets',filename),out=path.join(dist,'assets',filename);
 if(!fs.existsSync(src)||!fs.existsSync(out))errors.push('Asset ausente '+filename);
 else if(fs.readFileSync(src).equals(fs.readFileSync(out))===false)
   errors.push('Asset modificado no build '+filename);
}
if(!fs.existsSync(path.join(dist,'design-system','index.html')))
  errors.push('Novo design system compartilhado ausente');
if(errors.length){console.error(errors.map(e=>'FAIL '+e).join('\n'));process.exitCode=1;}
else console.log('[LENSES Astro] Verificações estruturais e arquivos byte-a-byte aprovados. Falta regressão VISUAL no navegador.');
