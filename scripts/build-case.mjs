/**
 * LENSES | Gerador de cases estáticos, sem dependências.
 * node scripts/build-case.mjs data/cases/cliente.json
 * node scripts/build-case.mjs --all
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const TEMPLATE=fs.readFileSync(path.join(ROOT,"templates/case-layout.html"),"utf8");
const KEYS=["estrategia","branding","embalagem","conteudo"];
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeURL=x=>{
  const u=String(x||"").trim();
  if(!u)return "";
  if(!/^(https:\/\/|\.{1,2}\/|assets\/)/.test(u)||/[<>"'\s]/.test(u))throw Error("URL inválida: "+u);
  return u;
};
const labelOf=(t,key)=>{
  const match=t.match(/\bclass=["']([^"']*)["']/);
  return !!match&&match[1].split(/\s+/).includes(key);
};
function range(markup,tag,matcher,nth=0){
  let open,matches=0;const begin=new RegExp("<"+tag+"\\b[^>]*>","g");
  while((open=begin.exec(markup))){
    if(!matcher(open[0])||matches++!==nth)continue;
    const tokens=new RegExp("</?"+tag+"\\b[^>]*>","g");tokens.lastIndex=open.index;
    let depth=0,hit;
    while((hit=tokens.exec(markup))){
      depth+=hit[0][1]==="/"?-1:1;
      if(depth===0)return {from:open.index,openEnd:open.index+open[0].length,closeStart:hit.index,to:hit.index+hit[0].length};
    }
  }
  throw Error("Elemento ausente no modelo: "+tag+" / "+nth);
}
const cls=(s,tag,key,n=0)=>range(s,tag,t=>labelOf(t,key),n);
const ident=(s,tag,id)=>range(s,tag,t=>t.includes('id="'+id+'"'));
const replaceNode=(s,r,content)=>s.slice(0,r.from)+content+s.slice(r.to);
const inside=(s,r,content)=>s.slice(0,r.openEnd)+content+s.slice(r.closeStart);
const txt=(s,tag,key,value)=>inside(s,cls(s,tag,key),esc(value));
const idx=(s,tag,id,value)=>inside(s,ident(s,tag,id),esc(value));
const body=(s,tag,key,value)=>inside(s,cls(s,tag,key),value);
function each(s,tag,key,render){
  const all=[];let i=0;
  for(;;){try{all.push(cls(s,tag,key,i++));}catch{break;}}
  for(let j=all.length-1;j>=0;j--)s=replaceNode(s,all[j],render(s.slice(all[j].from,all[j].to),j));
  return s;
}
function meta(html,key,value){
  const re=new RegExp('(<meta\\s+name="'+key+'"\\s+content=")[^"]*(")','i');
  if(!re.test(html))throw Error("Meta obrigatória ausente: "+key);
  return html.replace(re,(_m,a,b)=>a+esc(value)+b);
}
const paragraph=t=>'<p>'+esc(t)+'</p>';
const mediaIcon={
  foto:'<path d="M4 7h4l2-3h4l2 3h4v13H4z"/><circle cx="12" cy="13" r="4"/>',
  video:'<rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  drone:'<path d="M8 8 5 5m11 3 3-3M8 16l-3 3m11-3 3 3"/><rect x="8" y="8" width="8" height="8" rx="2"/>',
  story:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 19h2"/>',
  conceito:'<path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>'
};
function tile(item){
  const kind=item.type||"foto",title=item.label||"Registro do projeto";
  const thumb=item.src?'<img src="'+esc(safeURL(item.src))+'" alt="'+esc(item.alt||title)+'" loading="lazy" decoding="async">':
    '<div class="bella-concept-title">'+esc(item.title||title)+'</div>';
  const media=kind==="story"&&item.src?'<div class="bella-story-device">'+thumb+'</div>':thumb;
  const play=kind==="video"?'<span class="bella-video-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m8 5 12 7-12 7z"/></svg></span>':"";
  const link=item.link?'<a class="case-media-link" href="'+esc(safeURL(item.link))+'" target="_blank" rel="noopener noreferrer" aria-label="Abrir '+esc(title)+'">Ver mídia ↗</a>':"";
  return '<figure class="bella-mosaic-tile'+(kind==="video"?' bella-mosaic-tile--video':'')+
    (kind==="story"?' bella-mosaic-tile--story':'')+
    (!item.src?' bella-mosaic-tile--concept':'')+
    '" data-media-type="'+esc(kind)+'" aria-label="'+esc(title)+'">'+media+
    '<span class="bella-media-label" aria-hidden="true"><svg viewBox="0 0 24 24" aria-hidden="true">'+
    (mediaIcon[kind]||mediaIcon.foto)+'</svg>'+esc(title)+'</span>'+play+link+'</figure>';
}
function info(part,s,i){
  part=txt(part,"span","bella-mosaic-info__eyebrow",String(i+1).padStart(2,"0")+" / SOLUÇÃO LENSES");
  part=txt(part,"h3","bella-mosaic-info__title",s.title);
  part=txt(part,"p","bella-mosaic-info__lead",s.lead);
  part=txt(part,"p","bella-mosaic-info__detail",s.description);
  return txt(part,"span","bella-mosaic-info__foot",s.footer||"PRODUÇÃO · CRIAÇÃO · ENTREGAS");
}
function validate(d){
  const errors=[];
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug||"")||d.slug==="bellamazon")errors.push("slug inválido ou reservado");
  for(const key of ["name","hero.subtitle","project.summary","project.details","challenge.title","challenge.description"]){
    if(!key.split(".").reduce((x,k)=>x?.[k],d))errors.push("campo obrigatório: "+key);
  }
  for(const [name,array,length] of [["hero.services",d.hero?.services,4],["solutions",d.solutions,4],["kpis",d.kpis,4]]){
    if(!Array.isArray(array)||array.length!==length)errors.push(name+": exatamente "+length+" itens");
  }
  if(!Array.isArray(d.deliverables)||!d.deliverables.length)errors.push("deliverables: pelo menos um item");
  for(const x of d.deliverables||[])if(!x.label||!Number.isFinite(+x.quantity)||+x.quantity<0)errors.push("quantidade inválida: "+(x.label||"sem rótulo"));
  if(d.status==="published"){
    if(!d.metricsVerified||!d.mediaApproved)errors.push("publicação exige métricas verificadas e mídias aprovadas");
    for(const s of d.solutions||[])if(!Array.isArray(s.media)||!s.media.some(x=>x.src))errors.push("mídia real obrigatória para "+s.title);
  }
  if(errors.length)throw Error("Briefing inválido:\n- "+errors.join("\n- "));
}
function dashboard(data){
  const ds=data.deliverables,total=ds.reduce((s,x)=>s+Number(x.quantity),0);
  const metrics=data.kpis.map(k=>'<article class="bell-stat"><div class="bell-stat-head">'+
    '<span class="bell-stat-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v10M7 12h10"/></svg></span>'+
    '<span class="bell-stat-label">'+esc(k.label)+'</span></div><b>'+esc(k.value)+'</b><p>'+esc(k.description||"")+'</p></article>').join("");
  const max=Math.max(1,...ds.map(x=>Number(x.quantity)));
  const bars=ds.slice(0,6).map(x=>'<div class="bell-bar-unit"><div class="bell-bar" style="--bar-height:'+
    Math.max(6,Math.round(Number(x.quantity)/max*90))+'%"></div><span>'+esc(x.short||x.label)+'</span></div>').join("");
  const colors=["#4961ab","#7386c4","#9badd9","#cbd5ec","#8295c8","#dbe3f4"];
  let running=0;
  const rings=ds.slice(0,6).map((x,i)=>{const begin=running;running+=total?Number(x.quantity)/total*100:0;
    return colors[i]+" "+begin.toFixed(2)+"% "+running.toFixed(2)+"%";}).join(",");
  const legend=ds.slice(0,6).map((x,i)=>'<div><i style="--swatch:'+colors[i]+'"></i><span>'+
    esc(x.label)+'</span><b>'+Math.round(total?Number(x.quantity)/total*100:0)+'%</b></div>').join("");
  const header=(heading,description)=>'<div class="bell-chart-heading"><div><div class="bell-overline">'+esc(heading)+
    '</div><p>'+esc(description||"")+'</p></div></div>';
  const bar='<article class="bell-chart bell-chart-reach">'+
    '<div class="bell-chart-heading"><div><div class="bell-overline">Entregas por formato</div>'+
    '<b class="bell-chart-number">'+total.toLocaleString("pt-BR")+'</b><p>itens informados no briefing</p>'+
    '</div></div><div class="bell-bars" role="img" aria-label="Quantidades por formato">'+bars+
    '</div><div class="bell-bottom-trend">Distribuição dos materiais</div></article>';
  const donut='<article class="bell-chart bell-chart-mix">'+header("Distribuição das entregas","Proporção entre formatos")+
    '<div class="bell-mix-layout"><div class="bell-donut" style="background:conic-gradient('+(rings||"#dbe3f4 0% 100%")+
    ')" role="img" aria-label="Proporção por categoria"><div><b>100%</b><span>do conjunto</span></div></div>'+
    '<div class="bell-mix-legend">'+legend+'</div></div></article>';
  const description='<article class="bell-chart case-chart-editorial">'+header("O projeto",data.project.summary)+
    '<p class="case-dashboard-copy">'+esc(data.project.details)+'</p></article>';
  const locations='<article class="bell-chart case-chart-editorial">'+header("Presença e entregas","Contexto de realização")+
    '<div class="case-dashboard-copy">'+((data.locations||[]).length?(data.locations.map(x=>
      '<span class="case-location-chip">'+esc(x)+'</span>').join("")):
      '<p>Detalhes do projeto e materiais organizados para a apresentação.</p>')+'</div></article>';
  return '<section class="dash-wrap bell-results" id="resultados" aria-labelledby="bell-results-title">'+
    '<div class="shell"><div class="bell-results-heading"><div><span class="bell-accent-line"></span>'+
    '<h2 id="bell-results-title">Dados do Projeto</h2></div><p>'+
    esc(data.dashboardIntro||"Visão das frentes de criação, produção e comunicação.")+'</p></div>'+
    '<div class="bell-dashboard" role="region" aria-label="Painel do projeto '+esc(data.name)+'">'+
    '<div class="bell-topline"><div class="bell-topline-text"><span class="bell-live-dot"></span> Painel do projeto <span class="bell-slash">/</span> '+
    esc(data.name)+'</div></div><div class="bell-stat-grid">'+metrics+'</div>'+
    '<div class="bell-analytics-grid">'+bar+description+locations+donut+'</div></div>'+
    '<p class="bell-data-note" id="bell-data-note">'+
    (data.metricsVerified?"Indicadores revisados pelo responsável do projeto.":"ⓘ Valores fornecidos no briefing, aguardando validação.")+
    '</p></div></section>';
}
function build(d){
  validate(d);
  let s=TEMPLATE;
  s=s.replace(/<title>[\s\S]*?<\/title>/,'<title>'+esc(d.name)+' | Case LENSES</title>');
  s=meta(s,"description",d.meta?.description||d.hero.subtitle);
  s=s.replace('<body class="bella-case">','<body class="bella-case" data-case-template="v1">');
  if(d.status!=="published")s=s.replace("</head>",'<meta name="robots" content="noindex,nofollow"></head>');
  s=idx(s,"h1","bell-s1-title",d.name);
  s=txt(s,"p","bell-s1-subtitle",d.hero.subtitle);
  s=txt(s,"div","bell-s1-signature",d.hero.signature||"Projetos LENSES");
  s=each(s,"div","bell-s1-service",(part,i)=>{
    const x=d.hero.services[i];
    return part.replace(/<h2>[\s\S]*?<\/h2>/,'<h2>'+esc(x.title)+'</h2>')
      .replace(/<p>[\s\S]*?<\/p>/,'<p>'+esc(x.description)+'</p>');
  });
  s=body(s,"div","bella-reuse-video__intro",
    '<p class="bella-reuse-eyebrow">'+esc(d.name.toUpperCase())+' <span></span></p>'+
    '<h2 id="bell-s2-title">O Projeto</h2>'+paragraph(d.project.summary));
  s=body(s,"div","bella-reuse-video__followup",
    paragraph(d.project.details)+'<p class="bella-reuse-video__source">'+esc(d.project.credit||"LENSES · PRODUÇÃO E CONTEÚDO")+'</p>');
  const video=d.project.video||{};
  if(video.youtubeId&&/^[a-zA-Z0-9_-]{11}$/.test(video.youtubeId))s=s.replaceAll("WL7-6C7ZyZE",video.youtubeId);
  else{
    s=body(s,"div","bella-reuse-video__player",'<div class="case-video-pending" role="note">Prévia audiovisual em preparação</div>');
    s=s.replaceAll("WL7-6C7ZyZE","");
  }
  if(video.poster){
    const r=cls(s,"div","bella-reuse-video__player");
    const portion=s.slice(r.from,r.to).replace(/<img\b[^>]*>/,
      '<img src="'+esc(safeURL(video.poster))+'" alt="Prévia de '+esc(d.name)+'" loading="lazy" decoding="async">');
    s=replaceNode(s,r,portion);
  }
  s=body(s,"article","bella-reuse-challenge__panel",
    '<span class="bella-reuse-challenge__eyebrow">02 / O DESAFIO</span>'+
    '<h2 id="bell-s4-title">'+esc(d.challenge.title)+'</h2>'+paragraph(d.challenge.description)+
    (d.challenge.details?paragraph(d.challenge.details):""));
  s=body(s,"aside","bella-reuse-challenge__points",(d.challenge.pillars||[]).slice(0,3)
    .map((p,i)=>'<div><strong>'+String(i+1).padStart(2,"0")+'</strong><span>'+esc(p.title)+
    '</span><p>'+esc(p.description||"")+'</p></div>').join(""));
  s=inside(s,cls(s,"figure","bella-reuse-challenge__scene"),
    d.challenge.image?'<img src="'+esc(safeURL(d.challenge.image))+'" alt="'+esc(d.challenge.imageAlt||"Imagem do projeto")+
      '" loading="lazy" decoding="async"><figcaption>'+esc(d.challenge.caption||"REGISTRO DO PROJETO")+'</figcaption>':
      '<div class="case-video-pending">Imagem em preparação</div>');
  s=body(s,"div","bella-reuse-results__header",'<span class="bella-reuse-results__eyebrow">03 / O QUE DESENVOLVEMOS</span>'+
    '<h2 id="bell-s5-title"><span>Soluções</span> que entregamos</h2>'+
    paragraph(d.solutionsIntro||"Quatro frentes criativas conectadas em um projeto."));
  s=each(s,"button","bell-s5-card",(part,i)=>part
    .replace(/<h3>[\s\S]*?<\/h3>/,'<h3>'+esc(d.solutions[i].title)+'</h3>')
    .replace(/<p>[\s\S]*?<\/p>/,'<p>'+esc(d.solutions[i].short||d.solutions[i].lead)+'</p>'));
  s=each(s,"div","bella-mosaic-panel",(part,i)=>{
    const solution=d.solutions[i],box=cls(part,"article","bella-mosaic-info");
    part=replaceNode(part,box,info(part.slice(box.from,box.to),solution,i));
    const from=part.indexOf('<figure class="bella-mosaic-tile');
    const to=part.lastIndexOf("</div>");
    if(from<0||to<from)throw Error("Mosaico inválido na solução "+i);
    return part.slice(0,from)+(solution.media||[]).slice(0,15).map(tile).join("\n")+"\n"+part.slice(to);
  });
  s=s.replace('class="bella-reuse-presence bella-infinite-gallery"',
    'class="bella-reuse-presence bella-infinite-gallery" data-case-media="provided"');
  s=each(s,"button","bella-mosaic-step",(part,i)=>part.replace(/aria-label="[^"]*"/,
    'aria-label="Ir para '+esc(d.solutions[i].title)+'"'));
  s=replaceNode(s,ident(s,"section","resultados"),dashboard(d));
  const css=[
    ".bella-case .bell-s1-photo{background-image:"+(d.hero.image?'url("'+safeURL(d.hero.image)+'")':'none')+"!important}",
    ".bella-case .bell-s1-logo{"+(d.hero.logo?'background-image:url("'+safeURL(d.hero.logo)+'")!important':'display:none!important')+"}",
    ".bella-case .bella-reuse-video__photo{background-image:"+(d.project.background?'url("'+safeURL(d.project.background)+'")':'none')+"!important}",
    ".bella-case .case-video-pending{display:grid;place-items:center;min-height:260px;width:100%;height:100%;padding:30px;background:linear-gradient(130deg,#202a44,#5c6ca4);color:white;text-align:center;font:600 16px Inter,sans-serif}",
    ".bella-case .case-media-link{position:absolute;right:10px;bottom:10px;z-index:7;padding:8px 12px;background:#202a44ed;color:white;border-radius:20px;font:650 11px Inter,sans-serif}",
    ".bella-case .case-chart-editorial{min-height:260px}",
    ".bella-case .case-dashboard-copy{margin-top:25px;font:400 clamp(13px,1vw,16px)/1.68 Inter,sans-serif;color:#526587}",
    ".bella-case .case-chart-editorial .bell-chart-heading p{font-size:14px;line-height:1.6;color:#526587;max-width:440px}",
    ".bella-case .case-location-chip{display:inline-block;margin:6px;padding:8px 11px;border-radius:30px;background:#edf2fb;color:#465e96;font:600 12px Inter,sans-serif}",
    ".bella-case .bell-stat b{overflow-wrap:anywhere}",
    ".bella-case .bell-bars .bell-bar-unit>span{font-size:clamp(8px,.7vw,11px);white-space:nowrap}"
  ];
  if(d.status!=="published")css.push(".case-draft-banner{position:relative;z-index:5;padding:13px 20px;text-align:center;background:#fff1be;color:#374367;font:700 13px Inter,sans-serif}");
  s=s.replace("</head>",'<style>'+css.join("\n")+'</style></head>');
  if(d.status!=="published")s=s.replace('<main id="topo">','<main id="topo"><div class="case-draft-banner">PRÉVIA · Conteúdo e mídias sujeitos à aprovação</div>');
  s=s.replaceAll('aria-label="Bellamazon Native Islands Açaí"','aria-label="'+esc(d.name)+'"');
  s=s.replaceAll('class="bell-s1-signature"','class="bell-s1-signature"');
  return s;
}
function main(file){
  const d=JSON.parse(fs.readFileSync(file,"utf8"));
  const content=build(d),target=path.join(ROOT,"casev2",d.slug,"index.html");
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,content,"utf8");
  console.log("LENSES case: "+d.slug+" → "+path.relative(ROOT,target)+" ("+(content.length/1024).toFixed(1)+" KiB)");
}
const args=process.argv.slice(2);
if(!args.length)throw Error("Uso: node scripts/build-case.mjs data/cases/cliente.json | --all");
const inputs=args[0]==="--all"?fs.readdirSync(path.join(ROOT,"data/cases"))
  .filter(name=>name.endsWith(".json")&&!name.startsWith("_")).map(name=>path.join(ROOT,"data/cases",name)):
  args.map(name=>path.resolve(process.cwd(),name));
inputs.forEach(main);
