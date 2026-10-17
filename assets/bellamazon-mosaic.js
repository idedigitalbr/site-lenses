/* Bellamazon · experiência editorial em 4 capítulos
 * GSAP 3.13 + ScrollTrigger, sem Lenis/Swiper. O eixo X é calculado em uma
 * única função, compartilhada entre autoplay, setas, filtros e scroll.
 * O pin é finito; no mobile o scroll vertical permanece nativo.
 */
(() => {
  "use strict";
  const boot = () => {
    const section = document.querySelector(".bella-infinite-gallery");
    if (!section || section.dataset.mosaicInit) return;
    const viewport = section.querySelector(".bella-mosaic-viewport");
    const track = section.querySelector(".bella-mosaic-track");
    const prev = section.querySelector('[data-mosaic-direction="prev"]');
    const next = section.querySelector('[data-mosaic-direction="next"]');
    const edgePrev = section.querySelector(".bella-mosaic-edge--prev");
    const edgeNext = section.querySelector(".bella-mosaic-edge--next");
    const toggle = section.querySelector("[data-mosaic-toggle]");
    const filters = [...document.querySelectorAll("[data-bella-filter]")];
    const progress = [...section.querySelectorAll(".bella-mosaic-step")];
    const originals = [...(track?.querySelectorAll(".bella-mosaic-panel") || [])];
    const categories = ["estrategia", "branding", "embalagem", "conteudo"];
    if (!viewport || !track || !prev || !next || originals.length !== 4 ||
        progress.length !== 4 || filters.length !== 5 ||
        categories.some((key, i) => originals[i].dataset.solution !== key)) return;
    section.dataset.mosaicInit = "1";
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gsap = window.gsap, ST = window.ScrollTrigger;
    let mode = "all", panelWidth = Math.max(1, originals[0].getBoundingClientRect().width);
    let cycleWidth = panelWidth * 4, visible = false, pinned = false, interacting = false;
    let userPaused = false, focusInside = false, resumeDelay = null, autoTween = null;
    let manualTween = null, resizeFrame = 0, fromTouch = false, dragging = false;
    let startX = 0, startY = 0, lastX = 0;
    const position = { auto: 0, manual: 0, scroll: 0 };
    const widthForPanels = () => {
      const el = track.querySelector(".bella-mosaic-panel");
      return Math.max(1, el?.getBoundingClientRect().width || viewport.clientWidth);
    };
    const mod = (value, length) => ((value % length) + length) % length;

    const updateProgress = (pixel) => {
      const fraction = pixel / panelWidth;
      const current = mode === "all" ? Math.min(3, Math.floor(fraction)) : categories.indexOf(mode);
      progress.forEach((button, i) => {
        const fill = mode === "all" ? Math.max(0, Math.min(1, fraction - i)) :
          (categories[i] === mode ? 1 : 0);
        button.style.setProperty("--step-fill", (fill * 100).toFixed(2) + "%");
        button.classList.toggle("is-current", i === current);
        button.setAttribute("aria-current", i === current ? "step" : "false");
      });
    };
    const output = (pixel) => {
      if (gsap && !reduced) gsap.set(track, { x: -pixel });
      updateProgress(pixel);
    };
    const render = () => output(mod(position.auto + position.manual + position.scroll, cycleWidth));
    const canAuto = () => visible && !pinned && !interacting && !userPaused &&
      !focusInside && !document.hidden;
    const sync = () => {
      if (autoTween) canAuto() ? autoTween.resume() : autoTween.pause();
    };
    const cloned = (source) => {
      const clone = source.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.inert = true;
      clone.querySelectorAll("img").forEach(img => {
        img.alt = ""; img.loading = "lazy"; img.decoding = "async";
      });
      return clone;
    };
    const build = (key) => {
      mode = key;
      track.replaceChildren();
      const chosen = key === "all" ? originals : originals.filter(p => p.dataset.solution === key);
      chosen.forEach(item => track.appendChild(item));
      chosen.forEach(item => track.appendChild(cloned(item)));
      panelWidth = widthForPanels();
      cycleWidth = panelWidth * chosen.length;
      filters.forEach(button => {
        const active = button.dataset.bellaFilter === key;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      position.auto = 0; position.manual = 0; position.scroll = 0;
      // A função de desenho é declarada adiante; não acioná-la no primeiro boot.
      updateProgress(0);
    };
    build("all");

    const step = (dir) => mode === "all" ? panelWidth * dir : panelWidth * dir * .72;
    const native = !gsap || reduced;
    if (native) {
      viewport.classList.add("is-native");
      if (toggle) toggle.hidden = true;
      const move = dir => viewport.scrollBy({
        left: step(dir), behavior: reduced ? "auto" : "smooth"
      });
      prev.addEventListener("click", () => move(-1));
      next.addEventListener("click", () => move(1));
      const nativeSelect = (key, jump) => {
        if (mode !== key) build(key);
        viewport.scrollTo({left:jump * panelWidth,behavior:reduced?"auto":"smooth"});
      };
      filters.forEach(button => button.addEventListener("click", () => {
        const key = button.dataset.bellaFilter;
        if (!["all", ...categories].includes(key)) return;
        nativeSelect(key, 0);
        section.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
      }));
      progress.forEach((button,i) => button.addEventListener("click",()=>{
        nativeSelect("all",i);
      }));
      viewport.addEventListener("scroll",()=>{
        updateProgress(mod(viewport.scrollLeft,cycleWidth));
      },{passive:true});
      return;
    }
    if (ST) gsap.registerPlugin(ST);
    const setX = gsap.quickSetter(track, "x", "px");
    // Substitui gsap.set por setter eficiente em cada frame.
    const draw = () => {
      const pixel = mod(position.auto + position.manual + position.scroll, cycleWidth);
      setX(-pixel); updateProgress(pixel);
    };
    const beginAutoplay = () => {
      if (autoTween) autoTween.kill();
      autoTween = gsap.fromTo(position,{auto:0},{
        auto:cycleWidth,repeat:-1,duration:cycleWidth/19,
        ease:"none",paused:true,onUpdate:draw
      });
      sync(); draw();
    };
    beginAutoplay();
    const refresh = () => {if (ST) requestAnimationFrame(()=>ST.refresh());};
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(entries => {
        visible = entries.some(entry=>entry.isIntersecting);
        sync();
      },{threshold:0,rootMargin:"90px 0px"}).observe(section);
    } else {visible=true;sync();}
    const hold = (ms=1600) => {
      interacting=true;sync();
      if(resumeDelay)resumeDelay.kill();
      resumeDelay=gsap.delayedCall(ms/1000,()=>{interacting=false;sync();});
    };
    const slide = (pixels,duration=1.1) => {
      hold((duration+.48)*1000);
      if (manualTween) manualTween.kill();
      manualTween=gsap.to(position,{
        manual:position.manual+pixels,
        duration,ease:"power3.inOut",onUpdate:draw,overwrite:"auto"
      });
    };
    prev.addEventListener("click",()=>slide(-step(1)));
    next.addEventListener("click",()=>slide(step(1)));

    const selectFilter = key => {
      if (!["all",...categories].includes(key)) return;
      if (mode !== key) {
        if (manualTween) manualTween.kill();
        if (autoTween) autoTween.kill();
        build(key);beginAutoplay();refresh();
      }
      hold(1250);
      section.scrollIntoView({behavior:"smooth",block:"start"});
    };
    filters.forEach(button=>button.addEventListener("click",()=>{
      selectFilter(button.dataset.bellaFilter);
    }));
    progress.forEach((button,index) => button.addEventListener("click",()=>{
      if (mode !== "all") {
        // A barra é o atalho de navegação entre os quatro capítulos.
        // Em modo filtrado, retorna à sequência completa no capítulo escolhido.
        if (autoTween) autoTween.kill();
        if (manualTween) manualTween.kill();
        build("all");beginAutoplay();refresh();
      }
      const current=mod(position.auto+position.manual+position.scroll,cycleWidth);
      const dest=index*panelWidth;
      let diff=mod(dest-current,cycleWidth);
      if (diff>cycleWidth/2) diff-=cycleWidth;
      slide(diff,Math.min(1.5,.75+Math.abs(diff)/Math.max(panelWidth,1)*.27));
    }));
    if(toggle)toggle.addEventListener("click",()=>{
      userPaused=!userPaused;
      toggle.setAttribute("aria-pressed",String(userPaused));
      toggle.setAttribute("aria-label",userPaused?"Retomar movimento automático":"Pausar movimento automático");
      toggle.title=userPaused?"Retomar movimento":"Pausar movimento";
      toggle.innerHTML=userPaused
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z" fill="currentColor"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      sync();
    });
    section.addEventListener("focusin",()=>{focusInside=true;sync();});
    section.addEventListener("focusout",()=>{
      focusInside=section.contains(document.activeElement);sync();
    });
    document.addEventListener("visibilitychange",sync);
    // Controles surgem apenas quando o cursor alcança as bordas da galeria.
    if(edgePrev&&edgeNext){
      section.addEventListener("pointermove",event=>{
        if(event.pointerType==="touch")return;
        const bounds=section.getBoundingClientRect();
        const offset=event.clientX-bounds.left;
        edgePrev.classList.toggle("is-near",offset<Math.min(180,bounds.width*.17));
        edgeNext.classList.toggle("is-near",offset>bounds.width-Math.min(180,bounds.width*.17));
      },{passive:true});
      section.addEventListener("pointerleave",()=>{
        edgePrev.classList.remove("is-near");edgeNext.classList.remove("is-near");
      });
    }
    viewport.addEventListener("touchstart",event=>{
      if(event.touches.length!==1)return;
      startX=lastX=event.touches[0].clientX;
      startY=event.touches[0].clientY;
      fromTouch=true;dragging=false;
    },{passive:true});
    viewport.addEventListener("touchmove",event=>{
      if(!fromTouch||event.touches.length!==1)return;
      const x=event.touches[0].clientX;
      const dx=x-startX,dy=event.touches[0].clientY-startY;
      if(!dragging&&Math.abs(dx)>9&&Math.abs(dx)>Math.abs(dy)*1.2)dragging=true;
      if(dragging){hold(1700);position.manual+=lastX-x;draw();}
      lastX=x;
    },{passive:true});
    const endTouch=()=>{if(dragging)hold(1600);dragging=false;fromTouch=false;};
    viewport.addEventListener("touchend",endTouch,{passive:true});
    viewport.addEventListener("touchcancel",endTouch,{passive:true});

    // Percurso horizontal limitado a cerca de três capítulos, em ambos sentidos.
    if(ST){
      const media=gsap.matchMedia();
      media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)",()=>{
        const smooth=gsap.quickTo(position,"scroll",{
          duration:.38,ease:"power2.out",onUpdate:draw
        });
        const trigger=ST.create({
          id:"bellamazon-mosaico-horizontal",trigger:section,pin:section,pinSpacing:true,
          start:"top top",anticipatePin:1,invalidateOnRefresh:true,
          end:()=>"+="+Math.round(Math.min(3400,Math.max(1250,viewport.clientWidth*2.65))),
          onEnter:()=>{pinned=true;sync();},
          onEnterBack:()=>{pinned=true;sync();},
          onLeave:()=>{pinned=false;sync();},
          onLeaveBack:()=>{pinned=false;sync();},
          onUpdate:self=>smooth(self.progress*panelWidth*(mode==="all"?3:1)),
          onRefresh:self=>{
            position.scroll=self.progress*panelWidth*(mode==="all"?3:1);draw();
          }
        });
        return ()=>{trigger.kill();pinned=false;position.scroll=0;draw();sync();};
      });
      refresh();
    }
    if("ResizeObserver" in window){
      const obs=new ResizeObserver(()=>{
        cancelAnimationFrame(resizeFrame);
        resizeFrame=requestAnimationFrame(()=>{
          const size=widthForPanels();
          if(Math.abs(size-panelWidth)<1)return;
          const ratio=size/panelWidth;
          position.manual*=ratio;position.scroll*=ratio;
          panelWidth=size;cycleWidth=size*(mode==="all"?4:1);
          beginAutoplay();refresh();
        });
      });
      obs.observe(viewport);
    }
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();