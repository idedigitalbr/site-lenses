/**
 * LENSES: contrato local entre organizar-novo-case e postar-novo-case.
 * Não baixa mídia, não altera páginas e NUNCA publica.
 *
 * node scripts/case-handoff.mjs init <slug> <drive-folder-url>
 * node scripts/case-handoff.mjs status <slug>
 * node scripts/case-handoff.mjs validate <slug>
 * node scripts/case-handoff.mjs --help
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const usage="Uso: node scripts/case-handoff.mjs init <slug> <drive-url> | status <slug> | validate <slug>";
const [action,slug,url]=process.argv.slice(2);
if(!action||["--help","-h","help"].includes(action)){console.log(usage);process.exit(0);}
if(!["init","status","validate"].includes(action)){console.error(usage);process.exit(2);}
if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug||"")||slug==="bellamazon"){
  console.error("Slug inválido ou reservado.");process.exit(2);
}
const work=path.join(root,".lenses-work",slug);
const handoffPath=path.join(work,"handoff.json");
const driveRE=/^https:\/\/drive\.google\.com\/drive\/folders\/[A-Za-z0-9_-]+(?:[?/#]|$)/;
const empty=x=>typeof x!=="string"||!x.trim();
function isWithinRoot(filepath){
  if(typeof filepath!=="string"||!filepath.trim())return false;
  const abs=path.resolve(root,filepath);
  return abs.startsWith(work+path.sep);
}
function relativeFilename(filepath){
  return path.relative(root,filepath).replace(/\\/g,"/");
}
function read(){
  if(!fs.existsSync(handoffPath))throw Error("Nenhum handoff local. Execute /organizar-novo-case ou init primeiro.");
  const h=JSON.parse(fs.readFileSync(handoffPath,"utf8"));
  if(h.schemaVersion!==1||h.slug!==slug)throw Error("Handoff incompatível com slug.");
  return h;
}
function verify(h){
  const errors=[],warnings=[];
  if(!driveRE.test(h.driveUrl||""))errors.push("Link da pasta do Drive ausente/inválido.");
  if(empty(h.clientName))errors.push("Nome do cliente ainda não definido.");
  if(empty(h.text?.about))errors.push("Sobre o projeto não foi preenchido.");
  if(empty(h.text?.challenge))errors.push("Texto do desafio não foi preenchido.");
  if(!Array.isArray(h.text?.solutions)||!h.text.solutions.length)errors.push("Soluções não foram descritas.");
  if(!Array.isArray(h.media?.selected)||!h.media.selected.length)
    errors.push("Nenhum material foi selecionado para a página.");
  const accepted=[".webp",".avif",".jpg",".jpeg",".png",".mp4",".webm"];
  for(const item of h.media?.selected||[]){
    if(!item||!["foto","video","drone","story","conceito"].includes(item.type))
      {errors.push("Tipo de mídia selecionada inválido.");continue;}
    if(!isWithinRoot(item.localPath)){errors.push("Mídia selecionada fora da pasta local isolada.");continue;}
    if(!accepted.includes(path.extname(item.localPath).toLowerCase()))
      {errors.push("Formato de mídia inesperado: "+item.localPath);continue;}
    if(!fs.existsSync(path.resolve(root,item.localPath)))
      errors.push("Mídia selecionada não encontrada: "+item.localPath);
    if(empty(item.label))warnings.push("Mídia sem descrição: "+item.localPath);
  }
  if(!Array.isArray(h.documents)||h.documents.length===0)
    warnings.push("Nenhum documento de briefing registrado. Confirmar origem editorial manualmente.");
  if(!Array.isArray(h.deliverables)||!h.deliverables.length)
    warnings.push("Sem quantidades verificadas de entregas; não inventar métricas.");
  if((h.pending||[]).length)
    warnings.push("Pendências informadas: "+h.pending.join(" | "));
  if(!h.review?.mediaRightsChecked)
    warnings.push("Direitos/autorizações de uso ainda não verificados.");
  return {ok:errors.length===0,errors,warnings,
    mediaCount:h.media?.selected?.length||0,documentCount:h.documents?.length||0};
}
try{
  if(action==="init"){
    if(!driveRE.test(url||""))throw Error("Informe um link válido de pasta do Google Drive.");
    if(fs.existsSync(handoffPath))throw Error("Handoff já existe; não sobrescrever. Use status ou continue editando.");
    fs.mkdirSync(work,{recursive:true});
    const handoff={
      schemaVersion:1,slug,driveUrl:url,clientName:"",
      createdAt:new Date().toISOString(),status:"organizing",
      documents:[],
      text:{about:"",challenge:"",challengeDetails:"",solutions:[],summary:"",sources:[]},
      deliverables:[],media:{selected:[],institutionalVideo:null},
      review:{mediaRightsChecked:false,editorialReviewed:false},
      pending:["Ler briefing e confirmar cliente","Catalogar e preparar mídias","Selecionar quadros e registrar proveniência"],
      notes:"Handoff privado. Apenas /postar-novo-case pode gerar página; publicação requer aprovação humana."
    };
    fs.writeFileSync(handoffPath,JSON.stringify(handoff,null,2)+"\n","utf8");
    console.log("Workspace criado: "+relativeFilename(handoffPath));
    console.log("Próximo: scan/docs/previews e preenchimento do handoff pelo Antigravity.");
  }else{
    const h=read(),report=verify(h);
    console.log(JSON.stringify({slug:h.slug,client:h.clientName,status:h.status,handoff:relativeFilename(handoffPath),...report},null,2));
    if(action==="validate"&&!report.ok)process.exitCode=1;
  }
}catch(e){console.error("[LENSES handoff] "+e.message);process.exitCode=1;}
