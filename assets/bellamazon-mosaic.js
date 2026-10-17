/* Bellamazon · narrativa horizontal guiada pelo scroll (v4)
   GSAP + ScrollTrigger existentes. Desktop: sequência reversível de escrita,
   preenchimento de cor, pausa de leitura e transição. Mobile: swipe e autoplay,
   sem prender o scroll vertical. Não usa wheel preventDefault ou dependências. */
(() => {
"use strict";
const boot = () => {
  const section = document.querySelector(".bella-infinite-gallery");
  if (!section || section.dataset.mosaicInit) return;
  const viewport = section.querySelector(".bella-mosaic-viewport");
  const track = section.querySelector(".bella-mosaic-track");
  const previous = section.querySelector('[data-mosaic-direction="prev"]');
  const next = section.querySelector('[data-mosaic-direction="next"]');
  const edgePrev = section.querySelector(".bella-mosaic-edge--prev");
  const edgeNext = section.querySelector(".bella-mosaic-edge--next");
  const progress = [...section.querySelectorAll(".bella-mosaic-step")];
  const filters = [...document.querySelectorAll("[data-bella-filter]")];
  const toggle = section.querySelector("[data-mosaic-toggle]");
  const originals = [...(track?.querySelectorAll(".bella-mosaic-panel") || [])];
  const categories = ["estrategia","branding","embalagem","conteudo"];
  if (!viewport || !track || !previous || !next ||
      originals.length !== 4 || progress.length !== 4 || filters.length !== 5 ||
      categories.some((key,i)=>originals[i].dataset.solution !== key)) return;
  section.dataset.mosaicInit="1";

  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop = !!gsap && !!ScrollTrigger && !reduced &&
    matchMedia("(min-width: 1024px)").matches;
  const targets = ["#e9effb","#7886bc","#5c6ca4","#4a588a"];
  const weights = [1.24,1,1,1.34];
  const totalWeight = weights.reduce((sum,n)=>sum+n,0);
  const clamp = (v)=>Math.max(0,Math.min(1,v));
  const ease = (v)=>{ const n=clamp(v);return n*n*(3-2*n); };
  const mod = (n,d)=>((n%d)+d)%d;
  const state = { auto:0,manual:0 };
  let mode="all",currentPanels=[],panelWidth=1,cycleWidth=1;
  let autoplay=null,manualTween=null,resumeDelay=null,resizeFrame=0,trigger=null;
  let visible=false,pinned=false,interacting=false,paused=false,focusInside=false;
  let startingX=0,startingY=0,lastX=0,touching=false,dragging=false;
  let scrollRatio=0;
  const setX = gsap && !reduced ? gsap.quickSetter(track,"x","px") :
    (x)=>{track.style.transform="translate3d("+x+"px,0,0)";};

  // Texto original permanece na árvore acessível. Reserva sua altura com
  // um "ghost" invisível e desenha apenas a parcela digitada. Assim não há
  // layout shifts durante o scroll, mesmo quando o texto ocupa várias linhas.
  const fragments = new WeakMap();
  const prepare = (panel) => {
    if (!desktop || fragments.has(panel)) return;
    const map={};
    for (const [name,selector] of [
      ["lead",".bella-mosaic-info__lead"],
      ["detail",".bella-mosaic-info__detail"],
      ["foot",".bella-mosaic-info__foot"]]) {
      const el=panel.querySelector(selector);
      if(!el)continue;
      const text=el.textContent.trim();
      const ghost=document.createElement("span");
      ghost.className="bella-mosaic-type-ghost";
      ghost.textContent=text;ghost.setAttribute("aria-hidden","true");
      const typed=document.createElement("span");
      typed.className="bella-mosaic-typed";
      typed.setAttribute("aria-hidden","true");
      el.setAttribute("aria-label",text);
      el.replaceChildren(ghost,typed);
      map[name]={el,text,typed,count:-1};
    }
    fragments.set(panel,map);
  };
  originals.forEach(prepare);
  const write = (frag,amount) => {
    if(!frag)return;
    const count=Math.round(frag.text.length*clamp(amount));
    if(count===frag.count)return;
    frag.count=count;
    frag.typed.textContent=frag.text.slice(0,count);
    frag.typed.classList.toggle("is-typing",count>0&&count<frag.text.length);
  };
  const resetClone = clone => {
    clone.setAttribute("aria-hidden","true");
    clone.inert=true;
    clone.querySelectorAll("img").forEach(img=>{
      img.alt="";img.loading="lazy";img.decoding="async";
    });
    // Cópias do loop não têm animações de escrita nem elementos acessíveis.
    clone.querySelectorAll(".bella-mosaic-typed").forEach(typed=>{
      typed.textContent=typed.parentElement?.getAttribute("aria-label") || "";
      typed.classList.remove("is-typing");
    });
    return clone;
  };
  const applyFilters = key => {
    filters.forEach(button=>{
      const on=button.dataset.bellaFilter===key;
      button.classList.toggle("is-active",on);
      button.setAttribute("aria-pressed",String(on));
    });
  };
  const build = key => {
    mode=key;
    currentPanels = key==="all" ? originals :
      originals.filter(panel=>panel.dataset.solution===key);
    track.replaceChildren();
    currentPanels.forEach(p=>track.appendChild(p));
    currentPanels.forEach(p=>track.appendChild(resetClone(p.cloneNode(true))));
    panelWidth=Math.max(1,currentPanels[0]?.getBoundingClientRect().width || viewport.clientWidth);
    cycleWidth=panelWidth*currentPanels.length;
    state.auto=0;state.manual=0;
    applyFilters(key);
  };
  build("all");

  const updateProgress = (index,local) => {
    progress.forEach((button,i)=>{
      const fill=mode==="all" ? (i<index?1:i===index?local:0) :
        (categories[i]===mode?local:0);
      button.style.setProperty("--step-fill",(clamp(fill)*100).toFixed(2)+"%");
      const current = mode==="all" ? i===index : categories[i]===mode;
      button.classList.toggle("is-current",current);
      if(current)button.setAttribute("aria-current","step");
      else button.removeAttribute("aria-current");
    });
  };

  // Divisão temporal: capítulos 1 e 4 duram mais. Em cada capítulo:
  // 00–62% a escrita acontece, 62–78% é pausa para leitura e
  // 78–100% acontece a transição até o próximo card.
  const decode = raw => {
    let rest=clamp(raw)*totalWeight;
    let index=0;
    for (;index<3;index++){
      if(rest < weights[index])break;
      rest-=weights[index];
    }
    return {index,local:clamp(rest/weights[index])};
  };
  const colors = (panel,amount,index) => {
    const info=panel.querySelector(".bella-mosaic-info");
    if(!info || !desktop)return;
    const t=ease(amount);
    info.style.backgroundColor=gsap.utils.interpolate("#ffffff",targets[index],t);
    info.style.color=index===0?"#202a44":
      gsap.utils.interpolate("#202a44","#ffffff",ease((amount-.25)/.75));
    const parts=fragments.get(panel);
    if(parts){
      write(parts.lead,clamp((amount-.055)/.20));
      write(parts.detail,clamp((amount-.19)/.36));
      write(parts.foot,clamp((amount-.51)/.11));
    }
    const rule=info.querySelector(".bella-mosaic-info__rule");
    if(rule){
      rule.style.opacity=String(clamp((amount-.31)/.19));
      rule.style.transform="scaleX("+ease((amount-.31)/.2)+")";
    }
  };
  const pastWash=section.querySelector(".bella-mosaic-past-wash");
  const renderScroll=raw=>{
    if(!desktop)return;
    scrollRatio=clamp(raw);
    // Os filtros isolados mostram só um painel; jamais deslocar o track
    // para outros capítulos que não foram montados no DOM.
    if(mode!=="all"){
      const index=categories.indexOf(mode);
      const local=scrollRatio;
      setX(0);
      originals.forEach((panel,i)=>colors(panel,i===index?clamp(local/.62):0,i));
      if(pastWash)pastWash.style.opacity="0";
      updateProgress(Math.max(0,index),local);
      return;
    }
    const {index,local}=decode(scrollRatio);
    const movement=index===3?0:ease((local-.78)/.22);
    const pixel=(index+movement)*panelWidth;
    setX(-pixel);
    originals.forEach((panel,i)=>colors(panel,i<index?1:i>index?0:clamp(local/.62),i));
    if(pastWash)pastWash.style.opacity=String(
      index===3?0:Math.sin(Math.PI*movement)*.95);
    updateProgress(index,local);
  };
  const renderMobile=()=>{
    if(desktop)return;
    const pixel=mod(state.auto+state.manual,cycleWidth);
    setX(-pixel);
    const index=mode==="all"?Math.min(3,Math.floor(pixel/panelWidth)):
      categories.indexOf(mode);
    const local=mode==="all"?pixel/panelWidth-index:1;
    updateProgress(Math.max(0,index),local);
  };

  const isAutoplayAllowed=()=>!desktop&&visible&&!pinned&&!interacting&&
    !paused&&!focusInside&&!document.hidden;
  const syncAuto=()=>{
    if(autoplay)isAutoplayAllowed()?autoplay.resume():autoplay.pause();
  };
  const startAutoplay=()=>{
    if(!gsap || reduced || desktop)return;
    if(autoplay)autoplay.kill();
    autoplay=gsap.fromTo(state,{auto:0},{
      auto:cycleWidth,duration:cycleWidth/21,repeat:-1,ease:"none",
      paused:true,onUpdate:renderMobile
    });
    syncAuto();renderMobile();
  };
  startAutoplay();
  if("IntersectionObserver" in window){
    new IntersectionObserver(entries=>{
      visible=entries.some(entry=>entry.isIntersecting);syncAuto();
    },{rootMargin:"80px 0px",threshold:0}).observe(section);
  }else{visible=true;syncAuto();}
  const hold=ms=>{
    interacting=true;syncAuto();
    if(resumeDelay)resumeDelay.kill();
    if(gsap)resumeDelay=gsap.delayedCall(ms/1000,()=>{
      interacting=false;syncAuto();
    });
    else interacting=false;
  };

  // Visitas diretas por filtros, setas e barra alteram o próprio scroll quando
  // há pin; NÃO criam uma segunda timeline competindo com ScrollTrigger.
  const findSeek = index => {
    let before=0;
    for(let i=0;i<index;i++)before+=weights[i];
    return (before+weights[index]*.60)/totalWeight;
  };
  const seek=idx=>{
    const i=Math.max(0,Math.min(3,idx));
    if(desktop && trigger){
      const target=trigger.start+findSeek(i)*(trigger.end-trigger.start);
      window.scrollTo({top:target,behavior:"smooth"});
    }else if(gsap && !reduced){
      const current=mod(state.auto+state.manual,cycleWidth);
      const desired=mode==="all"?i*panelWidth:0;
      let diff=mod(desired-current,cycleWidth);
      if(diff>cycleWidth/2)diff-=cycleWidth;
      hold(1700);
      if(manualTween)manualTween.kill();
      manualTween=gsap.to(state,{manual:state.manual+diff,duration:1.1,
        ease:"power3.inOut",onUpdate:renderMobile});
    }else viewport.scrollTo({left:(mode==="all"?i:0)*panelWidth,
      behavior:reduced?"auto":"smooth"});
  };
  const selectFilter=(key)=>{
    if(!["all",...categories].includes(key))return;
    if(key!==mode){
      if(autoplay)autoplay.kill();
      if(manualTween)manualTween.kill();
      build(key);
      if(desktop){
        const chosen=categories.indexOf(key);
        // No filtro isolado o texto aparece completo; a transição é feita
        // pelo próprio trecho de scroll, preservando o sentido reversível.
        originals.forEach((panel,i)=>colors(panel,i===chosen||key==="all"?0:0,i));
      }else startAutoplay();
      if(ScrollTrigger)requestAnimationFrame(()=>ScrollTrigger.refresh());
    }
    if(desktop){
      section.scrollIntoView({behavior:"smooth",block:"start"});
    }else{
      viewport.scrollLeft=0;renderMobile();
      section.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
    }
  };
  filters.forEach(btn=>btn.addEventListener("click",()=>selectFilter(btn.dataset.bellaFilter)));
  progress.forEach((btn,i)=>btn.addEventListener("click",()=>{
    if(mode!=="all"){
      if(autoplay)autoplay.kill();
      if(manualTween)manualTween.kill();
      build("all");
      startAutoplay();
      if(ScrollTrigger)ScrollTrigger.refresh();
    }
    seek(i);
  }));
  const arrow=dir=>{
    if(desktop){
      const info=decode(scrollRatio);
      let nextIndex=info.index+dir;
      if(nextIndex<0)nextIndex=3;
      if(nextIndex>3)nextIndex=0;
      seek(nextIndex);
    }else if(mode!=="all"){
      const cur=categories.indexOf(mode);
      selectFilter(categories[mod(cur+dir,4)]);
    }else{
      const pixel=mod(state.auto+state.manual,cycleWidth);
      seek(mod(Math.floor(pixel/panelWidth)+dir,4));
    }
  };
  previous.addEventListener("click",()=>arrow(-1));
  next.addEventListener("click",()=>arrow(1));
  if(toggle)toggle.addEventListener("click",()=>{
    paused=!paused;
    toggle.setAttribute("aria-pressed",String(paused));
    toggle.setAttribute("aria-label",paused?"Retomar movimento automático":"Pausar movimento automático");
    toggle.title=paused?"Retomar movimento":"Pausar movimento";
    toggle.innerHTML=paused
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z" fill="currentColor"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    syncAuto();
  });

  section.addEventListener("focusin",()=>{focusInside=true;syncAuto();});
  section.addEventListener("focusout",()=>{
    focusInside=section.contains(document.activeElement);syncAuto();
  });
  document.addEventListener("visibilitychange",syncAuto);
  if(edgePrev&&edgeNext){
    section.addEventListener("pointermove",event=>{
      if(event.pointerType==="touch")return;
      const rect=section.getBoundingClientRect();
      const x=event.clientX-rect.left;
      const threshold=Math.min(190,rect.width*.17);
      edgePrev.classList.toggle("is-near",x<threshold);
      edgeNext.classList.toggle("is-near",x>rect.width-threshold);
    },{passive:true});
    section.addEventListener("pointerleave",()=>{
      edgePrev.classList.remove("is-near");
      edgeNext.classList.remove("is-near");
    });
  }
  viewport.addEventListener("touchstart",e=>{
    if(desktop||e.touches.length!==1)return;
    startingX=lastX=e.touches[0].clientX;
    startingY=e.touches[0].clientY;
    touching=true;dragging=false;
  },{passive:true});
  viewport.addEventListener("touchmove",e=>{
    if(desktop||!touching||e.touches.length!==1||reduced||!gsap)return;
    const x=e.touches[0].clientX,dx=x-startingX,dy=e.touches[0].clientY-startingY;
    if(!dragging&&Math.abs(dx)>9&&Math.abs(dx)>Math.abs(dy)*1.2)dragging=true;
    if(dragging){hold(1700);state.manual+=lastX-x;renderMobile();}
    lastX=x;
  },{passive:true});
  const touchEnd=()=>{if(dragging)hold(1600);dragging=false;touching=false;};
  viewport.addEventListener("touchend",touchEnd,{passive:true});
  viewport.addEventListener("touchcancel",touchEnd,{passive:true});

  // Navegação nativa acessível quando não há GSAP ou movimento é reduzido.
  if(!gsap || reduced){
    viewport.classList.add("is-native");
    if(toggle)toggle.hidden=true;
    originals.forEach(panel=>{
      const info=panel.querySelector(".bella-mosaic-info");
      if(info){info.style.background="#fff";info.style.color="#202a44";}
    });
    viewport.addEventListener("scroll",()=>{
      const pixel=mod(viewport.scrollLeft,cycleWidth);
      const idx=mode==="all"?Math.min(3,Math.floor(pixel/panelWidth)):categories.indexOf(mode);
      updateProgress(Math.max(0,idx),mode==="all"?pixel/panelWidth-idx:1);
    },{passive:true});
    return;
  }
  if(ScrollTrigger)gsap.registerPlugin(ScrollTrigger);
  if(desktop){
    // Progresso real (sem interpolação atrasada): frame inicial e final são
    // exatamente Estratégia x=0 e Conteúdo x=3*largura.
    trigger=ScrollTrigger.create({
      id:"bellamazon-mosaico-horizontal",trigger:section,pin:section,
      pinSpacing:true,start:"top top",anticipatePin:1,invalidateOnRefresh:true,
      end:()=>"+="+Math.round(mode==="all" ? Math.min(9000,Math.max(4400,innerHeight*7.8)) : Math.min(3100,Math.max(1250,innerHeight*2.2))),
      onEnter:self=>{pinned=true;renderScroll(self.progress);},
      onEnterBack:self=>{pinned=true;renderScroll(self.progress);},
      onLeave:self=>{pinned=false;renderScroll(1);},
      onLeaveBack:self=>{pinned=false;renderScroll(0);},
      onUpdate:self=>renderScroll(self.progress),
      onRefresh:self=>{
        panelWidth=Math.max(1,currentPanels[0]?.getBoundingClientRect().width||viewport.clientWidth);
        cycleWidth=panelWidth*currentPanels.length;
        renderScroll(self.progress);
      }
    });
    renderScroll(trigger.progress);
    requestAnimationFrame(()=>ScrollTrigger.refresh());
  }
  if("ResizeObserver" in window){
    const obs=new ResizeObserver(()=>{
      cancelAnimationFrame(resizeFrame);
      resizeFrame=requestAnimationFrame(()=>{
        const latest=Math.max(1,currentPanels[0]?.getBoundingClientRect().width||viewport.clientWidth);
        if(Math.abs(latest-panelWidth)<1)return;
        panelWidth=latest;cycleWidth=panelWidth*currentPanels.length;
        if(desktop && trigger){trigger.refresh();renderScroll(trigger.progress);}
        else{startAutoplay();renderMobile();}
      });
    });
    obs.observe(viewport);
  }
};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
else boot();
})();