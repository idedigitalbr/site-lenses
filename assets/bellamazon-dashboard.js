/* Bellamazon · dashboard motion com GSAP/ScrollTrigger já carregados no case.
   Animações decorativas, não aumentam os valores nem alteram o significado dos dados.
   Sem GSAP ou sob movimento reduzido, o dashboard permanece imediatamente legível. */
(() => {
  "use strict";
  const init=()=>{
    const root=document.querySelector(".bell-results");
    if(!root||root.dataset.dashboardMotionInit)return;
    root.dataset.dashboardMotionInit="true";
    const bars=[...root.querySelectorAll(".bell-bar")];
    const months=[...root.querySelectorAll(".bell-bar-unit")];
    months.forEach((unit,index)=>{
      const name=unit.querySelector("span:last-child")?.textContent.trim()||"Mês";
      const bar=unit.querySelector(".bell-bar");
      if(!bar)return;
      unit.tabIndex=0;
      unit.setAttribute("aria-label",name+": valor representado no gráfico ilustrativo");
      const tooltip=bar.querySelector(".bell-bar-tooltip")||document.createElement("span");
      if(!tooltip.classList.contains("bell-bar-tooltip")){
        tooltip.className="bell-bar-tooltip";
        tooltip.textContent=name+" · exemplo";
        bar.appendChild(tooltip);
      }
    });
    const svg=root.querySelector(".bell-line-chart svg");
    const paths=svg?[...svg.querySelectorAll("path")]:[];
    const line=paths.find(path=>path.getAttribute("stroke")==="#5577c1");
    const fill=paths.find(path=>(path.getAttribute("fill")||"").startsWith("url("));
    if(line)line.classList.add("bell-chart-path");
    const counters=[...root.querySelectorAll(".bell-stat > b, .bell-chart-number, .bell-donut b")];
    const finalValues=counters.map(el=>el.textContent.trim());
    const gsap=window.gsap,ST=window.ScrollTrigger;
    if(!gsap||!ST||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    gsap.registerPlugin(ST);
    let animated=false;
    const run=()=>{
      if(animated)return;
      animated=true;
      const stats=root.querySelectorAll(".bell-stat");
      const charts=root.querySelectorAll(".bell-chart");
      const dots=root.querySelectorAll(".bell-world circle");
      const lineDots=root.querySelectorAll(".bell-line-chart circle");
      const gain=root.querySelector(".bell-floating-gain");
      const donut=root.querySelector(".bell-donut");
      const tl=gsap.timeline({defaults:{ease:"power2.out"}});
      tl.fromTo(stats,{opacity:0,y:38,scale:.97},{
        opacity:1,y:0,scale:1,duration:1.05,stagger:.12,ease:"power3.out",clearProps:"transform,opacity"
      },0);
      tl.fromTo(charts,{opacity:0,y:50},{
        opacity:1,y:0,duration:1.18,stagger:.18,ease:"power3.out",clearProps:"transform,opacity"
      },.38);
      tl.fromTo(bars,{scaleY:0,opacity:.5},{
        scaleY:1,opacity:1,duration:1.85,stagger:.17,ease:"power3.out",
        transformOrigin:"center bottom",clearProps:"transform,opacity"
      },.8);
      if(line){
        const length=line.getTotalLength();
        gsap.set(line,{strokeDasharray:length,strokeDashoffset:length});
        tl.to(line,{strokeDashoffset:0,duration:2.45,ease:"power2.inOut",clearProps:"strokeDasharray,strokeDashoffset"},1.1);
      }
      if(fill)tl.fromTo(fill,{opacity:0},{opacity:1,duration:1.65},1.65);
      if(lineDots.length)tl.fromTo(lineDots,{scale:0,transformOrigin:"center center"},
        {scale:1,duration:.7,stagger:.13,ease:"back.out(1.8)",clearProps:"transform"},2.1);
      if(gain)tl.fromTo(gain,{opacity:0,y:14,scale:.9},
        {opacity:1,y:0,scale:1,duration:.8,ease:"back.out(1.5)",clearProps:"transform,opacity"},2.0);
      if(donut){
        tl.fromTo(donut,{"--bell-donut-reveal":"0%"},{"--bell-donut-reveal":"100%",duration:2.15,ease:"power2.inOut",
          onComplete:()=>donut.style.removeProperty("--bell-donut-reveal")},.9);
      }
      if(dots.length)tl.fromTo(dots,{scale:0,transformOrigin:"center center",opacity:0},
        {scale:1,opacity:1,duration:.65,stagger:.16,ease:"back.out(1.6)",clearProps:"transform,opacity"},1.15);
      // Contadores tabulares em pt-BR. Valores finais são restaurados literalmente.
      counters.forEach((el,i)=>{
        const raw=finalValues[i],match=raw.match(/^([+\-]?)(\d[\d.,]*)(.*)$/);
        if(!match)return;
        const prefix=match[1],suffix=match[3],goal=Number(match[2].replace(/\./g,"").replace(",",".")); 
        if(!Number.isFinite(goal))return;
        const value={n:0};
        tl.to(value,{
          n:goal,duration:1.9,ease:"power2.out",
          onUpdate:()=>{
            const shown=Math.round(value.n);
            el.textContent=prefix+shown.toLocaleString("pt-BR")+suffix;
          },
          onComplete:()=>{el.textContent=raw;}
        },.55+i*.075);
      });
      // Evita manter transformações e áreas de GPU após a sequência.
      tl.eventCallback("onComplete",()=>{
        gsap.set(root.querySelectorAll(".bell-stat,.bell-chart,.bell-bar"),{clearProps:"willChange"});
      });
    };
    ST.create({trigger:root,start:"top 78%",once:true,onEnter:run});
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();