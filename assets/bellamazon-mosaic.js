/* Bellamazon / LENSES — transição editorial scroll-driven v6
   Reutiliza os quatro cards, painéis .bella-mosaic-info, galeria de fotos e
   timeline existentes. Sticky CSS nativo; GSAP ScrollTrigger só observa.
   Nunca utiliza pin, pin-spacer, captura do wheel ou novos assets. */
(() => {
 "use strict";
 const init=()=>{
  const section=document.querySelector(".bella-infinite-gallery");
  if(!section || section.dataset.mosaicInit)return;
  const space=section.closest(".bella-mosaic-scroll-space");
  const stage=space?.querySelector(".bella-mosaic-story-stage");
  const overview=stage?.querySelector(".bell-s5.bella-reuse-results");
  const morph=stage?.querySelector(".bella-mosaic-story-morph");
  const viewport=section.querySelector(".bella-mosaic-viewport");
  const track=section.querySelector(".bella-mosaic-track");
  const cards=[...(overview?.querySelectorAll("[data-bella-filter]")||[])];
  const panels=[...(track?.querySelectorAll(".bella-mosaic-panel")||[])];
  const steps=[...section.querySelectorAll(".bella-mosaic-step")];
  const prev=section.querySelector('[data-mosaic-direction="prev"]');
  const next=section.querySelector('[data-mosaic-direction="next"]');
  const toggle=section.querySelector("[data-mosaic-toggle]");
  const leftArrow=section.querySelector(".bella-mosaic-edge--prev");
  const rightArrow=section.querySelector(".bella-mosaic-edge--next");
  const keys=["estrategia","branding","embalagem","conteudo"];
  const colors=["#7886bc","#6576ad","#5c6ca4","#4a588a"];
  if(!space||!stage||!overview||!morph||!viewport||!track||!prev||!next||
    cards.length!==4||panels.length!==4||steps.length!==4 ||
    keys.some((key,i)=>cards[i].dataset.bellaFilter!==key||panels[i].dataset.solution!==key))return;
  section.dataset.mosaicInit="1";
  const gsap=window.gsap,ST=window.ScrollTrigger;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop=!!gsap&&!!ST&&!reduced&&matchMedia("(min-width:1024px)").matches;
  const cap=x=>Math.max(0,Math.min(1,x));
  const portion=(x,a,b)=>cap((x-a)/(b-a));
  const ease=x=>{const p=cap(x);return p*p*(3-2*p);};
  const wrap=(x,length)=>((x%length)+length)%length;
  const weights=[1.18,1,1,1.2];
  const total=weights.reduce((a,b)=>a+b,0);
  let trigger=null,chapter=-1,panelWidth=1,auto=null,manualTween=null,resume=null;
  let visible=false,focusInside=false,hovering=false,paused=false,interacting=false;
  let px=0,drag=false,touching=false,lastX=0,startX=0,startY=0,resizeRAF=0;
  let currentProgress=0;
  const mobile={auto:0,manual:0};
  const setX=gsap&&!reduced?gsap.quickSetter(track,"x","px"):
    value=>{track.style.transform="translate3d("+value+"px,0,0)";};
  const relativeRect=(el)=>{
    const a=el.getBoundingClientRect(),b=stage.getBoundingClientRect();
    return {x:a.left-b.left,y:a.top-b.top,w:a.width,h:a.height};
  };
  const interpolateRect=(a,b,t)=>{
    const p=ease(t),lerp=(v,w)=>v+(w-v)*p;
    return {x:lerp(a.x,b.x),y:lerp(a.y,b.y),w:lerp(a.w,b.w),h:lerp(a.h,b.h)};
  };
  const panelInfo=panels.map(panel=>panel.querySelector(".bella-mosaic-info"));
  const texts=new Map();
  const textMarkup=el=>{
    const text=el.textContent.trim();
    const ghost=document.createElement("span");
    ghost.className="bella-mosaic-type-ghost";
    ghost.textContent=text;ghost.setAttribute("aria-hidden","true");
    const typed=document.createElement("span");
    typed.className="bella-mosaic-typed";
    typed.setAttribute("aria-hidden","true");
    el.replaceChildren(ghost,typed);
    return {el,text,typed,count:-1};
  };
  const write=(obj,progress)=>{
    if(!obj)return;
    const count=Math.round(obj.text.length*cap(progress));
    if(obj.count===count)return;
    obj.count=count;
    obj.typed.textContent=obj.text.slice(0,count);
    obj.typed.classList.toggle("is-typing",count>0&&count<obj.text.length);
  };
  const createMorph=index=>{
    morph.replaceChildren();
    const copy=panelInfo[index].cloneNode(true);
    copy.setAttribute("aria-hidden","true");
    const headline=copy.querySelector(".bella-mosaic-info__title");
    const leadSource=copy.querySelector(".bella-mosaic-info__lead");
    if(headline && leadSource){
      const teaser=document.createElement("p");
      teaser.className="bella-mosaic-story-teaser";
      teaser.textContent=leadSource.textContent.trim();
      teaser.setAttribute("aria-hidden","true");
      headline.insertAdjacentElement("afterend",teaser);
    }
    morph.appendChild(copy);
    const map={};
    [["lead",".bella-mosaic-info__lead"],
     ["detail",".bella-mosaic-info__detail"],
     ["foot",".bella-mosaic-info__foot"]].forEach(([name,selector])=>{
       const el=copy.querySelector(selector);
       if(el)map[name]=textMarkup(el);
     });
    texts.set(index,map);
    chapter=index;
    morph.style.display="block";
  };
  const progressBar=(i,local)=>{
    steps.forEach((btn,j)=>{
      const fill=j<i?1:j===i?cap(local):0;
      btn.style.setProperty("--step-fill",(fill*100).toFixed(2)+"%");
      btn.classList.toggle("is-current",j===i);
      if(j===i)btn.setAttribute("aria-current","step");
      else btn.removeAttribute("aria-current");
    });
  };
  const decode=raw=>{
    let remaining=cap(raw)*total,idx=0;
    for(;idx<3;idx++){
      if(remaining<weights[idx])break;
      remaining-=weights[idx];
    }
    return {idx,local:cap(remaining/weights[idx])};
  };
  const photoSet=panels.map(p=>[...p.querySelectorAll(".bella-mosaic-tile")]);
  const renderDesktop=raw=>{
    if(!desktop)return;
    currentProgress=cap(raw);
    const {idx,local:t}=decode(currentProgress);
    if(chapter!==idx)createMorph(idx);
    const blue=colors[idx];
    // A ordem de animação é igual em todos os capítulos e reversível:
    // seleção -> expansão colorida -> branco central -> esquerda branca ->
    // galeria + escrita + preenchimento -> retorna à visão geral.
    const selected=ease(portion(t,.015,.17));
    const grown=ease(portion(t,.13,.34));
    const whiten=ease(portion(t,.38,.50));
    const split=ease(portion(t,.50,.67));
    const galleryIn=ease(portion(t,.56,.72));
    const reveal=ease(portion(t,.67,.89));
    const close=ease(portion(t,.88,.985));
    const fadeOverview=cap(1-ease(portion(t,.18,.36))+ease(portion(t,.89,.985)));
    const fadeGallery=galleryIn*(1-close);
    const morphAlpha=ease(portion(t,.14,.20))*(1-ease(portion(t,.94,.99)));
    const painted=blue;
    const fillAtLeft=ease(portion(reveal,.02,1));
    const largeColor=gsap.utils.interpolate(
      gsap.utils.interpolate(painted,"#ffffff",whiten),
      painted,fillAtLeft
    );
    const fg=gsap.utils.interpolate("#ffffff","#202a44",whiten*(1-fillAtLeft));
    const target=relativeRect(cards[idx]);
    const centerW=Math.min(stage.clientWidth*.47,515);
    const centerH=Math.min(stage.clientHeight*.83,700);
    const center={x:(stage.clientWidth-centerW)/2,y:(stage.clientHeight-centerH)/2,
      w:centerW,h:centerH};
    const leftW=Math.max(300,stage.clientWidth*.34-16);
    const left={x:8,y:8,w:leftW,h:stage.clientHeight-63};
    const rect=interpolateRect(
      interpolateRect(target,center,grown),
      left,split
    );
    // Fechamento retorna ao card pequeno anterior, enquanto os demais
    // reaparecem. O próximo capítulo entra pela própria visão geral.
    const finalRect=interpolateRect(rect,target,close);
    Object.assign(morph.style,{
      left:finalRect.x+"px",top:finalRect.y+"px",
      width:Math.max(1,finalRect.w)+"px",height:Math.max(1,finalRect.h)+"px",
      opacity:String(morphAlpha)
    });
    // O card expandido permanece editorial e centralizado até começar a
    // deslocar para a esquerda; depois o texto assume a composição.
    morph.classList.toggle("is-centered",split<.18);
    const info=morph.firstElementChild;
    if(info){
      const teaser=info.querySelector(".bella-mosaic-story-teaser");
      if(teaser){
        const visibility=ease(portion(t,.22,.33))*(1-ease(portion(t,.52,.69)))*(1-close);
        teaser.style.opacity=String(visibility);
        teaser.style.maxHeight=((1-split)*85)+"px";
        teaser.style.marginTop=((1-split)*22)+"px";
      }
      info.style.backgroundColor=gsap.utils.interpolate(largeColor,"#ffffff",close);
      info.style.color=gsap.utils.interpolate(fg,"#202a44",close);
      const txt=texts.get(idx);
      // Centralizado: só ícone e título. Esquerda: o texto vai sendo escrito.
      const copy=ease(portion(t,.65,.92));
      if(txt){
        write(txt.lead,portion(copy,0,.35));
        write(txt.detail,portion(copy,.22,1));
        write(txt.foot,portion(copy,.58,1));
      }
      const eyebrow=info.querySelector(".bella-mosaic-info__eyebrow");
      if(eyebrow)eyebrow.style.opacity=String(.35+.45*grown);
      const rule=info.querySelector(".bella-mosaic-info__rule");
      if(rule){rule.style.opacity=String(copy*.45);rule.style.transform="scaleX("+copy+")";}
    }
    cards.forEach((card,i)=>{
      const old=i<idx || (i===idx&&close>.56);
      card.classList.toggle("is-story-past",old);
      card.classList.toggle("is-active",false);
      const active=i===idx && !old;
      card.style.opacity=String(old ? .34 : 1);
      card.style.backgroundColor=active?
        gsap.utils.interpolate("#ffffff",blue,selected*(1-grown*.1)*(1-close)):
        "#ffffff";
      const amount=active?selected*(1-grown*.1)*(1-close):0;
      card.style.color=gsap.utils.interpolate("#5c6ca4","#ffffff",amount);
      const h=card.querySelector("h3"),p=card.querySelector("p");
      if(h)h.style.color=gsap.utils.interpolate("#596da4","#ffffff",amount);
      if(p)p.style.color=gsap.utils.interpolate("#61749c","#ffffff",amount);
      card.style.transform=active?"translateY("+(-5*selected*(1-grown))+"px) scale("+
        (1+selected*.015*(1-grown))+")":"";
      card.setAttribute("aria-pressed",String(active&&t<.2));
    });
    overview.style.opacity=String(fadeOverview);
    overview.style.pointerEvents=fadeOverview>.83?"auto":"none";
    overview.inert=fadeOverview<.25;
    section.style.opacity=String(fadeGallery);
    section.style.pointerEvents=fadeGallery>.45?"auto":"none";
    section.inert=fadeGallery<.25;
    // Com o clone do card à frente, só as imagens são reveladas no mosaico.
    viewport.style.clipPath="inset(0 0 0 "+(100-100*galleryIn)+"%)";
    panelWidth=Math.max(1,panels[0].getBoundingClientRect().width||viewport.clientWidth);
    // Deslocamento suave de até 7% da largura: mais fotografias entram
    // sem abandonar o capítulo durante a leitura.
    const pan=ease(portion(reveal,.32,1))*panelWidth*.125;
    setX(-idx*panelWidth-pan);
    photoSet.forEach((set,i)=>{
      if(i!==idx)return;
      set.forEach((tile,j)=>{
        const show=ease(portion(t,.57+j*.029,.78+j*.021));
        tile.style.opacity=String(show*(1-close));
        tile.style.transform="translateY("+((1-show)*22)+"px) scale("+(1+(1-show)*.015)+")";
        const img=tile.querySelector("img");
        if(img)img.style.transform="scale("+(1.08-.08*show)+")";
      });
    });
    const edges=section.querySelectorAll(".bella-mosaic-edge");
    edges.forEach(el=>{el.style.visibility=fadeGallery>.65?"visible":"hidden"});
    const bar=section.querySelector(".bella-mosaic-progress");
    if(bar)bar.style.opacity=String(ease(portion(t,.56,.72))*(1-close));
    progressBar(idx, t);
  };

  const choose=index=>{
    const i=Math.max(0,Math.min(3,index));
    if(desktop&&trigger){
      const before=weights.slice(0,i).reduce((a,b)=>a+b,0);
      const target=trigger.start+((before+weights[i]*.065)/total)*(trigger.end-trigger.start);
      window.scrollTo({top:target,behavior:"smooth"});
    }else if(gsap&&!reduced){
      const dest=i*panelWidth,current=wrap(mobile.auto+mobile.manual,panelWidth*4);
      let diff=wrap(dest-current,panelWidth*4);
      if(diff>panelWidth*2)diff-=panelWidth*4;
      interacting=true;if(auto)auto.pause();
      if(manualTween)manualTween.kill();
      manualTween=gsap.to(mobile,{manual:mobile.manual+diff,
        duration:.9,ease:"power3.inOut",onUpdate:renderMobile,
        onComplete:()=>{interacting=false;syncMobile();}});
      section.scrollIntoView({block:"start",behavior:"smooth"});
    }else{
      viewport.scrollTo({left:i*panelWidth,behavior:reduced?"auto":"smooth"});
      section.scrollIntoView({block:"start",behavior:reduced?"auto":"smooth"});
    }
  };
  cards.forEach((card,i)=>card.addEventListener("click",()=>choose(i)));
  steps.forEach((step,i)=>step.addEventListener("click",()=>choose(i)));
  prev.addEventListener("click",()=>choose(desktop?Math.max(0,decode(currentProgress).idx-1):
    Math.max(0,Math.floor(wrap(mobile.auto+mobile.manual,panelWidth*4)/panelWidth)-1)));
  next.addEventListener("click",()=>choose(desktop?Math.min(3,decode(currentProgress).idx+1):
    Math.min(3,Math.floor(wrap(mobile.auto+mobile.manual,panelWidth*4)/panelWidth)+1)));

  if(leftArrow&&rightArrow){
    section.addEventListener("pointermove",event=>{
      if(event.pointerType==="touch")return;
      const box=section.getBoundingClientRect(),x=event.clientX-box.left;
      leftArrow.classList.toggle("is-near",x<Math.min(180,box.width*.17));
      rightArrow.classList.toggle("is-near",x>box.width-Math.min(180,box.width*.17));
    },{passive:true});
    section.addEventListener("pointerleave",()=>{
      leftArrow.classList.remove("is-near");rightArrow.classList.remove("is-near");
    });
  }
  const renderMobile=()=>{
    if(desktop)return;
    const size=panelWidth*4,pos=wrap(mobile.auto+mobile.manual,size);
    setX(-pos);
    const idx=Math.min(3,Math.floor(pos/panelWidth));
    progressBar(idx,portion(pos,idx*panelWidth,(idx+1)*panelWidth));
    cards.forEach((card,i)=>{
      card.classList.toggle("is-active",i===idx);
      card.setAttribute("aria-pressed",String(i===idx));
    });
  };
  const autoAllowed=()=>visible&&!paused&&!focusInside&&!hovering&&!interacting&&!document.hidden;
  const syncMobile=()=>{if(auto)autoAllowed()?auto.resume():auto.pause();};
  const setupMobile=()=>{
    if(desktop)return;
    // O layout original responsivo continua em fluxo normal e usa o mesmo track.
    panelWidth=Math.max(1,panels[0].getBoundingClientRect().width||viewport.clientWidth);
    if(!gsap||reduced){
      viewport.classList.add("is-native");
      if(toggle)toggle.hidden=true;
      viewport.addEventListener("scroll",()=>{
        const pos=viewport.scrollLeft,idx=Math.min(3,Math.floor(pos/panelWidth));
        progressBar(idx,portion(pos,idx*panelWidth,(idx+1)*panelWidth));
      },{passive:true});
      return;
    }
    for(const p of panels){
      const clone=p.cloneNode(true);
      clone.setAttribute("aria-hidden","true");clone.inert=true;
      clone.querySelectorAll("img").forEach(img=>{img.alt="";img.loading="lazy";});
      track.appendChild(clone);
    }
    auto=gsap.fromTo(mobile,{auto:0},{
      auto:panelWidth*4,repeat:-1,duration:panelWidth*4/20,
      ease:"none",paused:true,onUpdate:renderMobile
    });
    if("IntersectionObserver" in window){
      new IntersectionObserver(entries=>{
        visible=entries.some(e=>e.isIntersecting);syncMobile();
      },{threshold:0,rootMargin:"80px"}).observe(section);
    }else visible=true;
    section.addEventListener("mouseenter",()=>{hovering=true;syncMobile();});
    section.addEventListener("mouseleave",()=>{hovering=false;syncMobile();});
    section.addEventListener("focusin",()=>{focusInside=true;syncMobile();});
    section.addEventListener("focusout",()=>{
      focusInside=section.contains(document.activeElement);syncMobile();
    });
    document.addEventListener("visibilitychange",syncMobile);
    viewport.addEventListener("touchstart",e=>{
      if(e.touches.length!==1)return;
      startX=lastX=e.touches[0].clientX;startY=e.touches[0].clientY;
      touching=true;drag=false;
    },{passive:true});
    viewport.addEventListener("touchmove",e=>{
      if(!touching||e.touches.length!==1)return;
      const x=e.touches[0].clientX,dx=x-startX,dy=e.touches[0].clientY-startY;
      if(!drag&&Math.abs(dx)>9&&Math.abs(dx)>Math.abs(dy)*1.2)drag=true;
      if(drag){interacting=true;syncMobile();mobile.manual+=lastX-x;renderMobile();}
      lastX=x;
    },{passive:true});
    const done=()=>{
      touching=false;
      if(drag&&gsap)gsap.delayedCall(1.4,()=>{interacting=false;syncMobile();});
      drag=false;
    };
    viewport.addEventListener("touchend",done,{passive:true});
    viewport.addEventListener("touchcancel",done,{passive:true});
  };
  if(toggle)toggle.addEventListener("click",()=>{
    paused=!paused;
    toggle.setAttribute("aria-pressed",String(paused));
    toggle.setAttribute("aria-label",paused?"Retomar movimento automático":"Pausar movimento automático");
    toggle.title=paused?"Retomar movimento":"Pausar movimento";
    toggle.innerHTML=paused?
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z" fill="currentColor"/></svg>':
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    syncMobile();
  });

  if(desktop){
    gsap.registerPlugin(ST);
    space.classList.add("is-story-ready");
    // Nem pin, nem pinSpacing: a área sticky ocupa espaço real no documento.
    trigger=ST.create({
      id:"bellamazon-solucoes-story",
      trigger:space,start:"top top",end:"bottom bottom",
      invalidateOnRefresh:true,
      onUpdate:self=>renderDesktop(self.progress),
      onRefresh:self=>renderDesktop(self.progress),
      onEnter:self=>renderDesktop(self.progress),
      onEnterBack:self=>renderDesktop(self.progress),
      onLeave:()=>renderDesktop(1),
      onLeaveBack:()=>renderDesktop(0)
    });
    renderDesktop(trigger.progress);
    requestAnimationFrame(()=>ST.refresh());
    if(document.fonts?.ready)document.fonts.ready.then(()=>ST.refresh());
  }else setupMobile();
  if("ResizeObserver" in window){
    new ResizeObserver(()=>{
      cancelAnimationFrame(resizeRAF);
      resizeRAF=requestAnimationFrame(()=>{
        if(desktop&&trigger){trigger.refresh();renderDesktop(trigger.progress);}
        else{panelWidth=Math.max(1,panels[0].getBoundingClientRect().width||viewport.clientWidth);}
      });
    }).observe(stage);
  }
 };
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
 else init();
})();