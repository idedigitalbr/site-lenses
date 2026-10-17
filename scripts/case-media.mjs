/* LENSES Case Media CLI | Node 20 + rclone + FFmpeg no computador
   node scripts/case-media.mjs scan SLUG URL_DRIVE
   node scripts/case-media.mjs docs SLUG URL_DRIVE
   node scripts/case-media.mjs previews SLUG URL_DRIVE
   node scripts/case-media.mjs encode SLUG URL_DRIVE "CAMINHO_EXATO" --confirm-large
   node scripts/case-media.mjs stage SLUG --approved
*/
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const [mode,slug,url,video]=process.argv.slice(2),approved=process.argv.includes("--approved");
const allowLarge=process.argv.includes("--confirm-large");
const remote=process.env.LENSES_RCLONE_REMOTE||"lensesdrive";
const folder=url?.match(/^https:\/\/drive\.google\.com\/drive\/folders\/([A-Za-z0-9_-]+)(?:[/?#]|$)/)?.[1];
if(!["scan","docs","previews","encode","stage"].includes(mode))throw Error("Use scan, docs, previews, encode, stage");
if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug||"")||slug==="bellamazon")throw Error("Slug inválido");
if(!/^[A-Za-z0-9_-]+$/.test(remote))throw Error("Remote inválido");
if(mode!=="stage"&&!folder)throw Error("Passe a URL da pasta do Google Drive");
const work=path.join(root,".lenses-work",slug);
const temp=path.join(work,"temp"),preview=path.join(work,"previews");
const docsDir=path.join(work,"documents"),optimized=path.join(work,"optimized");
for(const dir of [work,temp,preview,docsDir,optimized])fs.mkdirSync(dir,{recursive:true});
const inventoryFile=path.join(work,"inventory.json");
function run(command,args){
  const res=spawnSync(command,args,{encoding:"utf8",windowsHide:true,maxBuffer:64*1024*1024});
  if(res.error)throw Error(command+": "+res.error.message);
  if(res.status!==0)throw Error(command+" falhou: "+(res.stderr||res.stdout||"").slice(-1200));
  return res.stdout||"";
}
const json=(file,data)=>fs.writeFileSync(file,JSON.stringify(data,null,2)+"\n","utf8");
const read=file=>JSON.parse(fs.readFileSync(file,"utf8"));
const fileKey=p=>{
  const name=path.basename(p).replace(/\.[^.]+$/,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").slice(0,40);
  return (name||"media")+"-"+crypto.createHash("sha256").update(p).digest("hex").slice(0,8);
};
function list(){
  if(!fs.existsSync(inventoryFile))throw Error("Execute scan primeiro");
  const data=read(inventoryFile);
  if(data.url!==url)throw Error("URL diferente do inventário anterior");
  return data.items;
}
function copy(item,dest){
  if(item.path.startsWith("/")||item.path.replace(/\\/g,"/").split("/").includes(".."))throw Error("Caminho inseguro");
  if(fs.existsSync(dest)&&fs.statSync(dest).size>0)return;
  run("rclone",["copyto",remote+":"+item.path,dest,"--drive-root-folder-id",folder,"--retries","3"]);
}
function probe(file){
  const result=JSON.parse(run("ffprobe",["-v","error","-show_format","-show_streams","-of","json",file]));
  const v=result.streams?.find(s=>s.codec_type==="video")||{};
  return {duration:Number(result.format?.duration||v.duration||0),width:v.width,height:v.height};
}
function frame(file,out,at){
  run("ffmpeg",["-hide_banner","-loglevel","error","-y","-ss",String(Math.max(0,at)),
    "-i",file,"-frames:v","1","-vf","scale=-2:720:force_original_aspect_ratio=decrease,setsar=1",
    "-c:v","libwebp","-quality","83",out]);
}
function scan(){
  const raw=JSON.parse(run("rclone",["lsjson",remote+":","--recursive","--files-only","--drive-root-folder-id",folder]));
  const items=raw.filter(f=>f.Path).map(f=>{
    const p=f.Path.replace(/\\/g,"/");
    return {path:p,bytes:Number(f.Size||0),type:/\.(mov|mp4|mkv|avi|m4v|webm)$/i.test(p)?"video":
      /\.(docx?|pdf|txt|md|rtf|odt)$/i.test(p)?"document":
      /\.(jpe?g|png|webp|heic|avif)$/i.test(p)?"image":"other"};
  });
  json(inventoryFile,{url,scannedAt:new Date().toISOString(),items});
  console.log(JSON.stringify({total:items.length,video:items.filter(x=>x.type==="video").length,
    images:items.filter(x=>x.type==="image").length,
    documents:items.filter(x=>x.type==="document").length,
    biggest:items.filter(x=>x.type==="video").sort((a,b)=>b.bytes-a.bytes)
      .slice(0,4).map(x=>({name:x.path,MB:Math.round(x.bytes/1048576)}))},null,2));
}
function downloadDocs(){
  for(const item of list().filter(x=>x.type==="document"&&x.bytes<35*1048576).slice(0,40)){
    try{
      const dest=path.join(docsDir,fileKey(item.path)+path.extname(item.path));
      copy(item,dest);console.log("Documento: "+dest);
    }catch(e){console.log("Documento precisa de exportação especial: "+item.path+" — "+e.message.slice(0,110));}
  }
}
function makePreviews(){
  const result=[];
  // Mais leves primeiro; arquivos enormes ficam para encode explícito.
  for(const item of list().filter(x=>x.type==="video").sort((a,b)=>a.bytes-b.bytes).slice(0,12)){
    if(item.bytes>250*1048576){result.push({path:item.path,status:"large-skip"});continue;}
    const name=fileKey(item.path),tmp=path.join(temp,name+path.extname(item.path));
    try{
      copy(item,tmp);
      const meta=probe(tmp),frames=[];
      for(const [i,p] of [.2,.48,.73].entries()){
        const target=path.join(preview,name+"-"+(i+1)+".webp");
        if(!fs.existsSync(target))frame(tmp,target,meta.duration*p);
        frames.push({file:path.basename(target),second:Math.round(meta.duration*p)});
      }
      result.push({path:item.path,duration:meta.duration,frames,status:"ready"});
    }catch(e){result.push({path:item.path,status:"error",message:e.message.slice(0,150)});}
    finally{if(fs.existsSync(tmp))fs.unlinkSync(tmp);}
  }
  json(path.join(work,"candidates.json"),{url,items:result});
  console.log("Frames em "+preview+"; revisar e preencher selections.json antes de stage.");
}
function encode(){
  if(!video)throw Error("Informe caminho exato do vídeo como no inventory.json");
  const item=list().find(x=>x.path===video&&x.type==="video");
  if(!item)throw Error("Vídeo não encontrado no inventário");
  if(item.bytes>250*1048576&&!allowLarge)throw Error("Arquivo maior que 250 MB; confirme download com --confirm-large");
  const name=fileKey(item.path),tmp=path.join(temp,name+path.extname(item.path));
  try{
    copy(item,tmp);
    const metadata=probe(tmp);
    console.log("Conversão selecionada:",metadata);
    run("ffmpeg",["-hide_banner","-loglevel","error","-y","-i",tmp,
      "-map","0:v:0","-map","0:a:0?","-vf","scale=-2:1080:force_original_aspect_ratio=decrease,setsar=1",
      "-c:v","libx264","-preset","medium","-crf","24","-pix_fmt","yuv420p",
      "-c:a","aac","-b:a","128k","-movflags","+faststart",path.join(optimized,name+".mp4")]);
    frame(tmp,path.join(optimized,name+"-poster.webp"),metadata.duration*.42);
    console.log("Arquivos convertidos em "+optimized+"; NÃO publicados.");
  }finally{if(fs.existsSync(tmp))fs.unlinkSync(tmp);}
}
function stage(){
  if(!approved)throw Error("stage exige --approved; selecionar somente material autorizado.");
  const sel=path.join(work,"selections.json");
  if(!fs.existsSync(sel))throw Error("Criar selections.json com {\"files\":[\"arquivo-1.webp\", ...]}");
  const files=read(sel).files;
  if(!Array.isArray(files)||files.length===0)throw Error("Lista de arquivos vazia");
  const dest=path.join(root,"assets","cases",slug);
  fs.mkdirSync(dest,{recursive:true});
  for(const name of files){
    if(!/^[a-z0-9-]+\.webp$/.test(name))throw Error("Nome inválido: "+name);
    const src=path.join(preview,name),output=path.join(dest,name);
    if(!fs.existsSync(src)||fs.statSync(src).size>2097152)throw Error("Thumb ausente ou grande: "+name);
    if(fs.existsSync(output))throw Error("Destino já existe: "+name);
    fs.copyFileSync(src,output);
    console.log("Thumb staged: "+output);
  }
  console.log("Arquivos copiados localmente. Nenhum push realizado.");
}
try{
  if(mode==="scan")scan();
  if(mode==="docs")downloadDocs();
  if(mode==="previews")makePreviews();
  if(mode==="encode")encode();
  if(mode==="stage")stage();
}catch(e){console.error("[LENSES] "+e.message);process.exitCode=1;}
