/* LENSES · Motion editorial v1
   Home, Sobre e case BDA. JS progressivo, sem esconder conteúdo na falta de JS.
   GSAP + ScrollTrigger quando disponíveis; Web Animations + IntersectionObserver como fallback.
   Mantém carrosséis, modais, header, split e diagramas sob controle dos scripts originais. */
(() => {
  "use strict";
  const boot = () => {
    if (document.documentElement.dataset.lensesMotionReady) return;
    document.documentElement.dataset.lensesMotionReady = "1";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const home = !!document.getElementById("servicos");
    const about = !!document.getElementById("inicio-sobre2");
    const bda = !!document.getElementById("topo-case");
    if (!home && !about && !bda) return;

    const plans = [];
    const add = (section, selector, options = {}) => {
      const trigger = document.querySelector(section);
      if (!trigger) return;
      const elements = Array.from(trigger.querySelectorAll(selector));
      if (!elements.length) return;
      plans.push({
        trigger, elements,
        axis: options.axis || "y",
        distance: options.distance ?? 52,
        duration: options.duration ?? 1.22,
        stagger: options.stagger ?? .15,
        scale: options.scale ?? 1,
        mode: options.mode || "rise",
        start: options.start || "top 78%"
      });
    };

    if (home) {
      // A Home começa pelo showreel: não interromper o vídeo nem seus controles.
      // Hero já usa vídeo e seta com animação CSS; não disputar o transform da seta.
      add("#servicos", ".services-track .service-item", { distance:64, duration:1.34, stagger:.16, start:"top 76%" });
      add("#projetos", ".highlight-action-title", { axis:"x", distance:-44, duration:1.42, start:"top 70%" });
      // Apenas o viewport; nunca animar a track cujo translate é controlado pelo carrossel.
      add("#projetos-todos", ".carousel-viewport", { distance:34, scale:.975, duration:1.36, start:"top 82%" });
      add("#certificacao", ".certified-visual", { mode:"mask", duration:1.55, start:"top 78%" });
      add("#certificacao", ".certified-kicker, .certified-headline, .certified-feature", {
        distance:42, duration:1.12, stagger:.18, start:"top 75%"
      });
      add("#clientes", ".clients-headline, .clients-desc", {
        distance:48, duration:1.35, stagger:.23, start:"top 73%"
      });
      add("#clientes", ".client-logo-item", {
        distance:25, duration:.95, stagger:.085, start:"top 77%"
      });
    }

    if (about) {
      add("#inicio-sobre2", ".about2-origin-hero__headline, .about2-origin-hero__lead, .about2-origin-hero__roots", {
        distance:48, duration:1.46, stagger:.26, start:"top 100%"
      });
      // Fundamentos/Presença/Interseção já têm engines próprias. Animar só texto de apoio.
      add("#fundamentos", ".lf-heading", { distance:42, duration:1.22, start:"top 80%" });
      add("#atuacao-precisa", ".lap-overline, .lap-heading", {
        distance:37, duration:1.25, stagger:.18, start:"top 77%"
      });
      add("#como-conectamos", ".lcs-kicker, .lcs-title, .lcs-description", {
        distance:44, duration:1.34, stagger:.19, start:"top 75%"
      });
    }

    if (bda) {
      add("#topo-case", ".case-hero__eyebrow, .case-hero__title, .case-hero__subtitle, .case-hero__meta-strip", {
        distance:44, duration:1.4, stagger:.19, start:"top 100%"
      });
      add("#o-desafio", ".case-act-kicker, .case-act-editorial-title, .case-method-step-pill", {
        distance:40, duration:1.22, stagger:.14, start:"top 77%"
      });
      add("#a-solucao", ".case-act-kicker, .case-act-editorial-title, .case-poster-monument", {
        distance:47, duration:1.38, stagger:.20, start:"top 78%"
      });
      add("#os-resultados", ".team-header-clean, .case-monograph-item", {
        distance:44, duration:1.2, stagger:.13, start:"top 78%"
      });
      add("#outros-projetos", ".case-act-editorial-title, .case-card-editorial", {
        distance:36, duration:1.2, stagger:.16, start:"top 80%"
      });
    }

    const startFallback = () => {
      if (!("IntersectionObserver" in window) || !Element.prototype.animate) return;
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (document.hidden) continue;
          observer.unobserve(entry.target);
          const plan = plans.find(p => p.trigger === entry.target);
          if (!plan) continue;
          plan.elements.forEach((element, index) => {
            const horizontal = plan.axis === "x";
            const x = horizontal ? plan.distance : 0;
            const y = horizontal ? 0 : plan.distance;
            const animation = element.animate([
              { opacity:0, transform:"translate3d(" + x + "px," + y + "px,0) scale(" + plan.scale + ")" },
              { opacity:1, transform:"translate3d(0,0,0) scale(1)" }
            ], {
              duration:Math.round(plan.duration * 1000),
              delay:index * Math.round(plan.stagger * 1000),
              easing:"cubic-bezier(.19,1,.22,1)",
              fill:"both"
            });
            animation.addEventListener("finish", () => animation.cancel(), { once:true });
          });
        }
      }, { threshold:.10, rootMargin:"0px 0px -8% 0px" });
      plans.forEach(plan => observer.observe(plan.trigger));
      // A aba pode abrir em background; retomar somente quando estiver visível.
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) return;
        plans.forEach(plan => {
          const rect = plan.trigger.getBoundingClientRect();
          if (rect.top < innerHeight * .88 && rect.bottom > 0) {
            // Deixa o observer cuidar do disparo, sem duplicar entradas.
            observer.unobserve(plan.trigger);
            observer.observe(plan.trigger);
          }
        });
      });
    };

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) {
      startFallback();
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const motion = gsap.matchMedia();

    motion.add("(prefers-reduced-motion: no-preference)", () => {
      for (const plan of plans) {
        const x = plan.axis === "x" ? plan.distance : 0;
        const y = plan.axis === "y" ? plan.distance : 0;
        const from = plan.mode === "mask"
          ? { autoAlpha:0.65, clipPath:"inset(0 100% 0 0)" }
          : { autoAlpha:0, x, y, scale:plan.scale };
        const to = plan.mode === "mask"
          ? { autoAlpha:1, clipPath:"inset(0 0% 0 0)" }
          : { autoAlpha:1, x:0, y:0, scale:1 };
        const anim = gsap.fromTo(plan.elements, from, {
          ...to,
          duration:plan.duration,
          stagger:plan.stagger,
          ease:"power3.out",
          overwrite:"auto",
          immediateRender:false,
          clearProps:plan.mode === "mask" ? "opacity,visibility,clipPath" : "opacity,visibility,transform",
          scrollTrigger:{
            trigger:plan.trigger,
            start:plan.start,
            once:true,
            invalidateOnRefresh:true
          }
        });
      }
    });

    motion.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      // Scroll progress de verdade, mas somente em ornamentos passivos.
      // Nenhum pin, nenhum scroll-jacking, nenhum transform nos carrosséis.
      if (about) {
        const media = document.querySelector("#inicio-sobre2 .about2-origin-hero__media");
        if (media) gsap.fromTo(media, { scale:1.085 }, {
          scale:1.025,
          ease:"none",
          scrollTrigger:{
            trigger:"#inicio-sobre2",
            start:"top top",
            end:"bottom top",
            scrub:.9,
            invalidateOnRefresh:true
          }
        });
      }
      if (home) {
        const watermark = document.querySelector("#clientes .clients-watermark-svg");
        if (watermark) gsap.fromTo(watermark, { y:18 }, {
          y:-18,
          ease:"none",
          scrollTrigger:{
            trigger:"#clientes",
            start:"top bottom",
            end:"bottom top",
            scrub:1.1,
            invalidateOnRefresh:true
          }
        });
      }
    });
    window.addEventListener("pagehide", () => motion.revert(), { once:true });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once:true });
  } else {
    boot();
  }
})();
