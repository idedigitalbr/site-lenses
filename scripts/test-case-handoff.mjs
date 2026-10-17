/**
 * Smoke test do contrato local de handoff (sem baixar do Drive).
 * Node 20+, sem dependências. Nunca deixa artefatos no Git.
 */
import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
const root=process.cwd(),slug="lenses-smoke-handoff";
const base=path.join(root,".lenses-work",slug);
if(fs.existsSync(base))throw Error("Pasta de teste já existe; não sobrescrever: "+base);
const runner=path.join(root,"scripts/case-handoff.mjs");
const url="https://drive.google.com/drive/folders/1FAKE_TEST_CATALOG";
const call=(...args)=>spawnSync(process.execPath,[runner,...args],{cwd:root,encoding:"utf8"});
const assert=(condition,label)=>{if(!condition)throw Error("FAIL: "+label);};
try{
  let r=call("init",slug,url);
  assert(r.status===0,"init "+r.stderr);
  const handoff=path.join(base,"handoff.json");
  assert(fs.existsSync(handoff),"handoff.json ausente");
  let data=JSON.parse(fs.readFileSync(handoff,"utf8"));
  assert(data.status==="organizing"&&data.clientName==="","estado inicial privado");

  r=call("validate",slug);
  assert(r.status!==0,"briefing incompleto deve falhar");

  const frameDir=path.join(base,"previews");
  fs.mkdirSync(frameDir,{recursive:true});
  const img=path.join(frameDir,"amostra.webp");
  fs.writeFileSync(img,Buffer.from("RIFF\x04\x00\x00\x00WEBP","binary"));
  data.clientName="Cliente de Teste";
  data.status="organized";
  data.text.about="Projeto documentado em teste automatizado.";
  data.text.challenge="Desafio documentado.";
  data.text.solutions=[{title:"Audiovisual",description:"Registros locais"}];
  data.media.selected=[{
    type:"video",label:"Quadro institucional",
    localPath:".lenses-work/"+slug+"/previews/amostra.webp",
    sourceDrivePath:"cenas/amostra.mov",usage:"mosaico"
  }];
  data.pending=[];
  fs.writeFileSync(handoff,JSON.stringify(data,null,2));
  r=call("validate",slug);
  assert(r.status===0,"handoff completo "+r.stdout+" "+r.stderr);
  assert(JSON.parse(r.stdout).mediaCount===1,"contagem de material");

  data.media.selected[0].localPath="../../outside.webp";
  fs.writeFileSync(handoff,JSON.stringify(data,null,2));
  r=call("validate",slug);
  assert(r.status!==0,"path traversal deveria ser bloqueado");
  r=call("init",slug,url);
  assert(r.status!==0,"init não pode sobrescrever handoff");
  console.log("Handoff LENSES OK: init, incompleto bloqueado, completo aceito, path traversal bloqueado, overwrite bloqueado.");
}finally{
  fs.rmSync(base,{recursive:true,force:true});
}
