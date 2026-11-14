/**
 * P0 migration: source of truth is repository root /assets, not a fork of assets.
 * Copy at build/dev time so all referenced CSS/GSAP/media remain byte-identical.
 * Never commit generated public/assets or publish anything.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repo=path.resolve(project,'..');
const publicDir=path.join(project,'public');
const source=path.join(repo,'assets');
const dest=path.join(publicDir,'assets');
if(!fs.existsSync(path.join(repo,'assets','tokens.css')))throw Error('Não está na pasta correta: tokens originais ausentes.');
fs.mkdirSync(publicDir,{recursive:true});
fs.cpSync(source,dest,{recursive:true,force:true,preserveTimestamps:true,filter:p=>!p.includes(path.sep+'.git'+path.sep)});
for(const filename of ['sobre.html','design-system-preview.html']){
  const origin=path.join(repo,filename);
  if(fs.existsSync(origin))fs.copyFileSync(origin,path.join(publicDir,filename));
}
fs.writeFileSync(path.join(publicDir,'.nojekyll'),'');
console.log('[LENSES Astro] Assets originais sincronizados para public/ (não versionados).');
