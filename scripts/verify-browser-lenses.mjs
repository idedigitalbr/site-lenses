import { chromium } from "playwright";
const browser=await chromium.launch({headless:true,channel:"chrome",args:["--no-sandbox"]});
const contexts=[{name:"desktop",viewport:{width:1440,height:900}}];
let fail=0;
for(const c of contexts){
 for(const blockCDN of [false,true]){
  const context=await browser.newContext({viewport:c.viewport,reducedMotion:"no-preference"});
  if(blockCDN)await context.route(/cdn\.jsdelivr\.net/,route=>route.abort());
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",error=>errors.push(error.message));
  try{
   await page.goto("http://127.0.0.1:8123/casev2/bellamazon/",{waitUntil:"domcontentloaded",timeout:30000});
   await page.waitForTimeout(1200);
   const meta=await page.evaluate(()=>{
    const section=document.querySelector(".bella-mosaic-scroll-space");
    const stage=section?.querySelector(".bella-mosaic-story-stage");
    const gallery=section?.querySelector(".bella-infinite-gallery");
    const morph=section?.querySelector(".bella-mosaic-story-morph");
    return {gsap:!!window.gsap,scrollTrigger:!!window.ScrollTrigger,initialized:gallery?.dataset.mosaicInit,storyReady:section?.classList.contains("is-story-ready"),height:section?.offsetHeight,stageHeight:stage?.offsetHeight,sticky:getComputedStyle(stage).position,cardCount:section?.querySelectorAll("[data-bella-filter]").length,morphPresent:!!morph,top:section?.getBoundingClientRect().top+scrollY};
   });
   console.log("CASE INIT",JSON.stringify({mode:blockCDN?"no-cdn":"cdn",...meta,errors}));
   const timeline=[];
   for(const progress of [.01,.08,.15,.24,.35,.49,.64,.88]){
    await page.evaluate(({top,height,stageHeight,progress})=>scrollTo(0,top+(height-stageHeight)*progress),{...meta,progress});
    await page.waitForTimeout(110);
    const state=await page.evaluate(()=>{
      const stage=document.querySelector(".bella-mosaic-story-stage");
      const gallery=document.querySelector(".bella-infinite-gallery");
      const morph=document.querySelector(".bella-mosaic-story-morph");
      const overview=document.querySelector(".bell-s5.bella-reuse-results");
      return {y:Math.round(scrollY),stageTop:Math.round(stage.getBoundingClientRect().top),galleryOpacity:getComputedStyle(gallery).opacity,morphOpacity:getComputedStyle(morph).opacity,morphDisplay:getComputedStyle(morph).display,overviewOpacity:getComputedStyle(overview).opacity,chapter:Array.from(document.querySelectorAll(".bella-mosaic-step")).findIndex(a=>a.classList.contains("is-current"))};
    });
    timeline.push({progress,...state});
   }
   console.log("CASE SCROLL",JSON.stringify({mode:blockCDN?"no-cdn":"cdn",timeline,errors}));
   const hasMorph=timeline.some(s=>s.morphDisplay==="block"&&parseFloat(s.morphOpacity)>.25);
   const pinned=timeline.some(s=>Math.abs(s.stageTop)<=4);
   if(!meta.storyReady||!hasMorph||!pinned||errors.length){fail++;console.error("CASE FAIL",JSON.stringify({mode:blockCDN?"no-cdn":"cdn",hasMorph,pinned,errors}));}
  }catch(error){fail++;console.error("CASE ERROR",String(error),JSON.stringify(errors));}
  await context.close();
 }
 const context=await browser.newContext({viewport:c.viewport,reducedMotion:"no-preference"});
 const page=await context.newPage();let errors=[];page.on("pageerror",e=>errors.push(e.message));
 try{
  await page.goto("http://127.0.0.1:8123/",{waitUntil:"domcontentloaded",timeout:30000});
  await page.waitForTimeout(5000);
  const video=await page.evaluate(()=>{
   const v=document.querySelector("#heroVideo");
   return {paused:v.paused,currentTime:v.currentTime,readyState:v.readyState,networkState:v.networkState,error:v.error?.message||null,src:v.currentSrc,poster:v.poster,autoplay:v.autoplay,preload:v.preload,duration:v.duration,buffered:v.buffered.length?v.buffered.end(v.buffered.length-1):0};
  });
  console.log("HOME HERO",JSON.stringify({video,errors}));
  if(video.error||video.paused||video.currentTime===0||errors.length){fail++;console.error("HOME FAIL");}
 }catch(error){fail++;console.error("HOME ERROR",String(error),JSON.stringify(errors));}
 await context.close();
}
await browser.close();
if(fail){console.error("FAILED CHECKS",fail);process.exitCode=1}else console.log("ALL BROWSER CHECKS PASSED");
