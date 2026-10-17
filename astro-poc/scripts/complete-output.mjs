/**
 * Keep the old root .html URLs. Astro produces the HTML pages, but
 * /sobre.html and /design-system-preview.html stay 100% preserved for links.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repo=path.resolve(project,'..');
const dest=path.join(project,'dist');
for(const alias of ['sobre.html','design-system-preview.html']){
  const input=path.join(repo,alias);
  if(fs.existsSync(input))fs.copyFileSync(input,path.join(dest,alias));
}
fs.writeFileSync(path.join(dest,'.nojekyll'),'');
console.log('[LENSES Astro] URLs de compatibilidade preservadas.');
