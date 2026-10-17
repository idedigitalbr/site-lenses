/* Bellamazon · mosaico editorial filtrável. GSAP 3.13 + ScrollTrigger.
   Uma única composição horizontal em cada filtro; loop visual contínuo.
   Pin finito somente desktop. No mobile o scroll vertical permanece nativo. */
(() => {
  "use strict";
  function boot() {
    const section=document.querySelector(".bella-infinite-gallery");
    if(!section || section.dataset.mosaicInit)return;
    const viewport=section.querySelector(".bella-mosaic-viewport");
    const track=section.querySelector(".bella-mosaic-track");
    const panel=track?.querySelector(".bella-mosaic-panel");
    const previous=section.querySelector('[data-mosaic-direction="prev"]');
    const next=section.querySelector('[data-mosaic-direction="next"]');
    const toggle=section.querySelector("[data-mosaic-toggle]");
    const label=section.querySelector("[data-mosaic-current]");
    const filters=[...document.querySelectorAll("[data-bella-filter]")];
    if(!viewport||!track||!panel||!previous||!next||!label||filters.length!==5)return;
    section.dataset.mosaicInit="1";
    const sourceTiles=[...panel.querySelectorAll(".bella-mosaic-tile")];
    if(sourceTiles.length!==11)return;
    const names={all:"Todas as entregas",estrategia:"Estratégia",branding:"Branding",embalagem:"Embalagem",conteudo:"Conteúdo"};
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gsap=window.gsap,ST=window.ScrollTrigger;
    let selected="all",width=Math.max(1,panel.getBoundingClientRect().width);
    let autoplay=null,delay=null,resizeFrame=0,visible=false,pinned=false;
    let hovering=false,focusInside=false,interacting=false,userPaused=false;
    let fromTouch=false,dragging=false,startX=0,startY=0,lastX=0;

    function populate(key){
      selected=key;
      filters.forEach(button=>{
        const active=button.dataset.bellaFilter===key;
        button.setAttribute("aria-pressed",String(active));
        button.classList.toggle("is-active",active);
      });
      label.textContent=names[key];
      label.setAttribute("aria-live","polite");
      const items=key==="all" ? sourceTiles :
        sourceTiles.filter(tile=>(tile.dataset.categories||"").split(/\s+/).includes(key));
      const display=items.map(tile=>tile.cloneNode(true));
      if(!display.length)return;
      track.replaceChildren();
      const first=document.createElement("div");
      first.className="bella-mosaic-panel"+(key==="all"?"":" is-filtered");
      first.dataset.count=String(display.length);
      display.forEach(tile=>first.appendChild(tile));
      track.appendChild(first);
      // Duas cópias, sem elementos interativos nem conteúdo anunciado repetidamente.
      for(let i=0;i<2;i++){
        const clone=first.cloneNode(true);
        clone.setAttribute("aria-hidden","true");
        clone.querySelectorAll("img").forEach(img=>{
          img.alt="";img.loading="lazy";img.decoding="async";
        });
        track.appendChild(clone);
      }
      width=Math.max(1,first.getBoundingClientRect().width);
    }

    function fallback(){
      viewport.classList.add("is-native");
      if(toggle)toggle.hidden=true;
      const step=()=>Math.max(220,viewport.clientWidth*.75);
      previous.addEventListener("click",()=>viewport.scrollBy({left:-step(),behavior:reduced?"auto":"smooth"}));
      next.addEventListener("click",()=>viewport.scrollBy({left:step(),behavior:reduced?"auto":"smooth"}));
      filters.forEach(button=>button.addEventListener("click",()=>{
        const key=button.dataset.bellaFilter;
        if(!Object.hasOwn(names,key))return;
        populate(key);
        viewport.scrollLeft=0;
        section.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
      }));
    }
    populate("all");
    if(!gsap||reduced){fallback();return;}
    if(ST)gsap.registerPlugin(ST);
    const state={auto:0,scroll:0,manual:0};
    const setX=gsap.quickSetter(track,"x","px");
    const render=()=>setX(-gsap.utils.wrap(0,width,state.auto+state.scroll+state.manual));
    const allowed=()=>visible&&!pinned&&!hovering&&!focusInside&&!interacting&&!userPaused&&!document.hidden;
    const sync=()=>{if(autoplay)allowed()?autoplay.resume():autoplay.pause();};
    function resetAutoplay(){
      if(autoplay)autoplay.kill();
      autoplay=gsap.fromTo(state,{auto:0},{
        auto:width,duration:width/18,repeat:-1,ease:"none",
        onUpdate:render,paused:true
      });
      sync();render();
    }
    resetAutoplay();
    if("IntersectionObserver" in window){
      new IntersectionObserver(entries=>{
        entries.forEach(entry=>{visible=entry.isIntersecting;sync();});
      },{rootMargin:"80px 0px 80px 0px",threshold:0}).observe(section);
    }else{visible=true;sync();}
    function hold(ms=1400){
      interacting=true;sync();
      if(delay)delay.kill();
      delay=gsap.delayedCall(ms/1000,()=>{interacting=false;sync();});
    }
    function shift(direction){
      hold(1500);
      gsap.to(state,{
        manual:state.manual+direction*Math.min(width*.3,innerWidth*.58),
        duration:1,ease:"power3.inOut",overwrite:"auto",onUpdate:render
      });
    }
    previous.addEventListener("click",()=>shift(-1));
    next.addEventListener("click",()=>shift(1));
    if(toggle){
      toggle.addEventListener("click",()=>{
        userPaused=!userPaused;
        toggle.setAttribute("aria-pressed",String(userPaused));
        toggle.setAttribute("aria-label",userPaused?"Retomar movimento automático":"Pausar movimento automático");
        toggle.title=userPaused?"Retomar movimento":"Pausar movimento";
        toggle.innerHTML=userPaused
          ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z" fill="currentColor"/></svg>'
          : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
        sync();
      });
    }
    section.addEventListener("mouseenter",()=>{hovering=true;sync();});
    section.addEventListener("mouseleave",()=>{hovering=false;sync();});
    section.addEventListener("focusin",()=>{focusInside=true;sync();});
    section.addEventListener("focusout",()=>{focusInside=section.contains(document.activeElement);sync();});
    document.addEventListener("visibilitychange",sync);

    // Deslizamento horizontal por toque, sem preventDefault e sem bloquear o scroll Y.
    viewport.addEventListener("touchstart",e=>{
      if(e.touches.length!==1)return;
      startX=lastX=e.touches[0].clientX;startY=e.touches[0].clientY;
      fromTouch=true;dragging=false;
    },{passive:true});
    viewport.addEventListener("touchmove",e=>{
      if(!fromTouch||e.touches.length!==1)return;
      const x=e.touches[0].clientX,dx=x-startX,dy=e.touches[0].clientY-startY;
      if(!dragging&&Math.abs(dx)>9&&Math.abs(dx)>Math.abs(dy)*1.2)dragging=true;
      if(dragging){hold(1700);state.manual+=lastX-x;render();}
      lastX=x;
    },{passive:true});
    const touchEnd=()=>{if(dragging)hold(1500);dragging=false;fromTouch=false;};
    viewport.addEventListener("touchend",touchEnd,{passive:true});
    viewport.addEventListener("touchcancel",touchEnd,{passive:true});

    // A seleção é feita nos cards acima da galeria; revela o resultado selecionado.
    function switchFilter(key){
      if(!Object.hasOwn(names,key)||key===selected)return;
      hold(750);
      gsap.killTweensOf(state);
      state.auto=0;state.manual=0;state.scroll=0;
      populate(key);
      resetAutoplay();
      gsap.fromTo(track,{autoAlpha:.45},{autoAlpha:1,duration:.5,ease:"power2.out"});
      if(ST)ST.refresh();
      section.scrollIntoView({behavior:"smooth",block:"start"});
    }
    filters.forEach(button=>button.addEventListener("click",()=>switchFilter(button.dataset.bellaFilter)));

    // Scroll vertical vira um percurso horizontal FINITO quando a galeria ocupa 100svh.
    if(ST){
      const context=gsap.matchMedia();
      context.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)",()=>{
        const smooth=gsap.quickTo(state,"scroll",{duration:.38,ease:"power2.out",onUpdate:render});
        const instance=ST.create({
          id:"bellamazon-mosaico-horizontal",
          trigger:section,pin:section,pinSpacing:true,start:"top top",
          end:()=>"+="+Math.round(Math.min(1350,Math.max(680,width*.83))),
          anticipatePin:1,invalidateOnRefresh:true,
          onEnter:()=>{pinned=true;sync();},
          onEnterBack:()=>{pinned=true;sync();},
          onLeave:()=>{pinned=false;sync();},
          onLeaveBack:()=>{pinned=false;sync();},
          onUpdate:self=>smooth(self.progress*width*1.15),
          onRefresh:self=>{state.scroll=self.progress*width*1.15;render();}
        });
        return ()=>{instance.kill();pinned=false;state.scroll=0;render();sync();};
      });
      requestAnimationFrame(()=>ST.refresh());
    }
    if("ResizeObserver" in window){
      const resizeObserver=new ResizeObserver(()=>{
        cancelAnimationFrame(resizeFrame);
        resizeFrame=requestAnimationFrame(()=>{
          const size=track.querySelector(".bella-mosaic-panel")?.getBoundingClientRect().width||width;
          if(Math.abs(size-width)<1)return;
          const ratio=size/width;state.manual*=ratio;state.scroll*=ratio;width=size;
          resetAutoplay();if(ST)ST.refresh();
        });
      });
      resizeObserver.observe(section);
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();
