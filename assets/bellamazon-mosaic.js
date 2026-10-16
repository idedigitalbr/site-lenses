/* Bellamazon: mosaico editorial infinito; GSAP/ScrollTrigger existentes no projeto.
   Um único transform combina autoplay, scroll, toque e botões sem disputas. */
(() => {
  "use strict";
  function boot() {
    const section=document.querySelector(".bella-infinite-gallery");
    if(!section || section.dataset.mosaicInit)return;
    section.dataset.mosaicInit="1";
    const viewport=section.querySelector(".bella-mosaic-viewport");
    const track=section.querySelector(".bella-mosaic-track");
    const panel=track?.querySelector(".bella-mosaic-panel");
    const previous=section.querySelector('[data-mosaic-direction="prev"]');
    const next=section.querySelector('[data-mosaic-direction="next"]');
    const toggle=section.querySelector("[data-mosaic-toggle]");
    if(!viewport||!track||!panel||!previous||!next)return;
    // Duas repetições idênticas mantêm a continuidade nos extremos do ciclo.
    for(let n=0;n<2;n++){
      const clone=panel.cloneNode(true);
      clone.setAttribute("aria-hidden","true");
      clone.querySelectorAll("img").forEach(img=>{img.alt="";img.loading="lazy";img.decoding="async";});
      track.appendChild(clone);
    }
    const motionOff=matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gsap=window.gsap, ST=window.ScrollTrigger;
    if(!gsap||motionOff){
      if(toggle)toggle.hidden=true; // Não há autoplay para pausar neste modo.
      viewport.classList.add("is-native");
      const move=direction=>viewport.scrollBy({
        left:direction*Math.max(220,viewport.clientWidth*.72),
        behavior:motionOff?"auto":"smooth"
      });
      previous.addEventListener("click",()=>move(-1));
      next.addEventListener("click",()=>move(1));
      return;
    }
    if(ST)gsap.registerPlugin(ST);
    let width=Math.max(1,panel.getBoundingClientRect().width);
    const state={auto:0,scroll:0,manual:0};
    const setX=gsap.quickSetter(track,"x","px");
    const render=()=>setX(-gsap.utils.wrap(0,width,state.auto+state.scroll+state.manual));
    let autoplay=null,resumeDelay=null;
    let visible=false,pinned=false,hovering=false,focusing=false,interacting=false,userPaused=false;
    const canPlay=()=>visible&&!pinned&&!hovering&&!focusing&&!interacting&&!userPaused&&!document.hidden;
    const sync=()=>{if(autoplay)canPlay()?autoplay.resume():autoplay.pause();};
    const createAutoplay=()=>{
      const progress=autoplay?autoplay.progress():0;
      if(autoplay)autoplay.kill();
      autoplay=gsap.fromTo(state,{auto:0},{
        auto:width,duration:width/20,repeat:-1,ease:"none",
        onUpdate:render,paused:true
      });
      autoplay.progress(progress);sync();render();
    };
    createAutoplay();
    if("IntersectionObserver" in window){
      new IntersectionObserver(entries=>{
        entries.forEach(entry=>{visible=entry.isIntersecting;sync();});
      },{rootMargin:"100px 0px 100px 0px",threshold:0}).observe(section);
    }else{visible=true;sync();}
    const hold=ms=>{
      interacting=true;sync();
      if(resumeDelay)resumeDelay.kill();
      resumeDelay=gsap.delayedCall(ms/1000,()=>{interacting=false;sync();});
    };
    function shift(direction){
      hold(1450);
      gsap.to(state,{
        manual:state.manual+direction*Math.min(width*.36,innerWidth*.58),
        duration:.95,ease:"power3.inOut",overwrite:"auto",onUpdate:render
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
          ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z" fill="currentColor" stroke="none"/></svg>'
          : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
        sync();
      });
    }
    section.addEventListener("mouseenter",()=>{hovering=true;sync();});
    section.addEventListener("mouseleave",()=>{hovering=false;sync();});
    section.addEventListener("focusin",()=>{focusing=true;sync();});
    section.addEventListener("focusout",()=>{
      focusing=section.contains(document.activeElement);sync();
    });
    document.addEventListener("visibilitychange",sync);
    // Toque horizontal: sem cancelar o scroll vertical do navegador.
    let startX=0,startY=0,lastX=0,touching=false,dragging=false;
    viewport.addEventListener("touchstart",e=>{
      if(e.touches.length!==1)return;
      startX=lastX=e.touches[0].clientX;
      startY=e.touches[0].clientY;touching=true;dragging=false;
    },{passive:true});
    viewport.addEventListener("touchmove",e=>{
      if(!touching||e.touches.length!==1)return;
      const x=e.touches[0].clientX;
      const dx=x-startX,dy=e.touches[0].clientY-startY;
      if(!dragging&&Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)*1.15)dragging=true;
      if(dragging){hold(1600);state.manual+=lastX-x;render();}
      lastX=x;
    },{passive:true});
    const finishTouch=()=>{
      if(dragging)hold(1500);
      touching=false;dragging=false;
    };
    viewport.addEventListener("touchend",finishTouch,{passive:true});
    viewport.addEventListener("touchcancel",finishTouch,{passive:true});

    // Pin desktop com percurso finito; o scroll sobe/desce nos dois sentidos.
    if(ST){
      const media=gsap.matchMedia();
      media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)",()=>{
        const update=gsap.quickTo(state,"scroll",{
          duration:.4,ease:"power2.out",onUpdate:render
        });
        const instance=ST.create({
          id:"bella-mosaico-horizontal",trigger:section,pin:section,pinSpacing:true,
          start:"top top",
          end:()=>"+="+Math.round(Math.min(1250,Math.max(630,width*.78))),
          anticipatePin:1,invalidateOnRefresh:true,
          onEnter:()=>{pinned=true;sync();},
          onEnterBack:()=>{pinned=true;sync();},
          onLeave:()=>{pinned=false;sync();},
          onLeaveBack:()=>{pinned=false;sync();},
          onUpdate:self=>update(self.progress*width*1.23),
          onRefresh:self=>{state.scroll=self.progress*width*1.23;render();}
        });
        return ()=>{
          instance.kill();pinned=false;state.scroll=0;render();sync();
        };
      });
      requestAnimationFrame(()=>ST.refresh());
    }
    if("ResizeObserver" in window){
      let frame=0;
      new ResizeObserver(()=>{
        cancelAnimationFrame(frame);
        frame=requestAnimationFrame(()=>{
          const latest=panel.getBoundingClientRect().width;
          if(Math.abs(latest-width)<1)return;
          const ratio=latest/width;
          state.manual*=ratio;state.scroll*=ratio;
          width=Math.max(1,latest);
          createAutoplay();
          if(ST)ST.refresh();
        });
      }).observe(panel);
    }
  }
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",boot,{once:true});
  }else boot();
})();
