import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const dataDir=path.join(root,"data/cases");
const files=fs.readdirSync(dataDir).filter(name=>name.endsWith(".json")&&!name.startsWith("_"));
const errors=[];
const check=(ok,msg)=>{if(!ok)errors.push(msg);};
for(const name of files){
  const filename=path.join(dataDir,name);
  const d=JSON.parse(fs.readFileSync(filename,"utf8"));
  const dest=path.join(root,"casev2",d.slug||"_invalid","index.html");
  check(name===(d.slug+".json"),name+": nome do arquivo deve corresponder ao slug");
  if(!fs.existsSync(dest)){errors.push(name+": página não gerada");continue;}
  const html=fs.readFileSync(dest,"utf8");
  const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);
  check(ids.length===new Set(ids).size,name+": IDs duplicados");
  for(const id of ["lenses-case-hero","video-projeto","desafio","solucoes","resultados"]){
    check(ids.includes(id),name+": seção obrigatória ausente: "+id);
  }
  check(html.includes('data-case-template="v1"'),name+": sem template de case");
  check(html.includes("case-template-layout.css"),name+": stylesheet compartilhado ausente");
  check(html.includes('data-case-media="provided"'),name+": galeria não isolada");
  check((html.match(/<article class="bell-stat"/g)||[]).length===4,name+": quatro KPIs necessários");
  check((html.match(/class="bella-mosaic-panel"/g)||[]).length===4,name+": quatro soluções necessárias");
  check(!html.includes("+280 mil")&&!html.includes('de interação média'),
    name+": dados ilustrativos de Bellamazon herdados indevidamente");
  check(!html.includes("Galeria horizontal das soluções Bellamazon"),
    name+": etiqueta da galeria foi herdada de outro cliente");
  check(!html.includes("bellamazonacai.com.br"),
    name+": link externo específico de outro cliente");
  const draft=d.status!=="published";
  check(draft===html.includes('name="robots" content="noindex,nofollow"'),
    name+": regra de publicação/noindex inconsistente");
  if(!draft){
    check(d.mediaApproved===true&&d.metricsVerified===true,
      name+": publicado sem revisão de mídias e dados");
  }
  for(const match of html.matchAll(/(?:src|href)=["'](\.\.\/\.\.\/assets\/[^"']+)["']/g)){
    const file=path.resolve(path.dirname(dest),match[1].split("?")[0]);
    check(fs.existsSync(file),name+": arquivo local inexistente: "+match[1]);
  }
  console.log("Case validado: "+d.slug+" ["+(draft?"prévia":"publicado")+"]");
}
if(errors.length){
  console.error("Cases reprovados:\n- "+errors.join("\n- "));
  process.exitCode=1;
}else console.log("QA dos cases concluído: "+files.length+" páginas.");
