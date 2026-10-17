import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root=process.cwd();
const slug="lenses-smoke-test-case";
const output=path.join(root,"casev2",slug);
if(fs.existsSync(output)){
  console.error("Abortando: pasta de smoke test já existe e não será sobrescrita: "+output);
  process.exit(1);
}
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"lenses-case-test-"));
try{
  const sample=JSON.parse(fs.readFileSync(path.join(root,"data/cases/_modelo.json"),"utf8"));
  sample.slug=slug;sample.status="draft";
  const source=path.join(tmp,"test.json");
  fs.writeFileSync(source,JSON.stringify(sample,null,2));
  const generated=spawnSync(process.execPath,[path.join(root,"scripts/build-case.mjs"),source],
    {cwd:root,encoding:"utf8"});
  if(generated.status!==0)throw Error("Gerador falhou:\n"+generated.stderr);
  const html=fs.readFileSync(path.join(output,"index.html"),"utf8");
  const must=["data-case-template=\"v1\"","case-template-layout.css",
    "data-case-media=\"provided\"","PRÉVIA","name=\"robots\"",
    "id=\"lenses-case-hero\"","id=\"resultados\"",
    "id=\"solucoes\"","id=\"desafio\"","Cliente Exemplo"];
  for(const marker of must)if(!html.includes(marker))throw Error("Template sem: "+marker);
  if((html.match(/class="bella-mosaic-panel"/g)||[]).length!==4)throw Error("Quatro soluções obrigatórias");
  if((html.match(/<article class="bell-stat"/g)||[]).length!==4)throw Error("Quatro KPIs obrigatórios");
  if(html.includes("+280 mil")||html.includes("Galeria horizontal das soluções Bellamazon"))
    throw Error("Vazamento de conteúdo de outro cliente");
  const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);
  if(ids.length!==new Set(ids).size)throw Error("IDs duplicados");
  console.log("Smoke de geração de case aprovado. HTML: "+Math.round(html.length/1024)+" KiB.");
}finally{
  fs.rmSync(output,{recursive:true,force:true});
  fs.rmSync(tmp,{recursive:true,force:true});
}
