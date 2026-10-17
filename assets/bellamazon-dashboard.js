/* LENSES · Bellamazon | Dashboard motion v2
   Coreografia vinculada ao scroll, por linha de KPIs e por gráfico.
   O scroll permanece nativo. Os dados do painel continuam ilustrativos.
   GSAP/ScrollTrigger são os que o case já carrega; sem bibliotecas novas. */
(() => {
  "use strict";

  const init = () => {
    const root = document.querySelector(".bell-results");
    if (!root || root.dataset.dashboardMotionInit) return;
    root.dataset.dashboardMotionInit = "true";

    // Os tooltips permanecem acessíveis por mouse e teclado.
    root.querySelectorAll(".bell-bar-unit").forEach(unit => {
      const month = unit.querySelector("span:last-child")?.textContent.trim() || "Mês";
      const bar = unit.querySelector(".bell-bar");
      if (!bar) return;
      unit.tabIndex = 0;
      unit.setAttribute("aria-label", month + ": valor ilustrativo do gráfico");
      if (!bar.querySelector(".bell-bar-tooltip")) {
        const tooltip = document.createElement("span");
        tooltip.className = "bell-bar-tooltip";
        tooltip.textContent = month + " · exemplo";
        bar.appendChild(tooltip);
      }
    });

    const svg = root.querySelector(".bell-line-chart svg");
    const svgPaths = svg ? [...svg.querySelectorAll("path")] : [];
    const line = svgPaths.find(el => el.getAttribute("stroke") === "#5577c1");
    const fill = svgPaths.find(el => (el.getAttribute("fill") || "").startsWith("url("));
    if (line) line.classList.add("bell-chart-path");

    const gsap = window.gsap, ST = window.ScrollTrigger;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!gsap || !ST || reduced) return;
    gsap.registerPlugin(ST);

    const compact = window.matchMedia("(max-width: 760px)").matches;
    const START = compact ? "top 92%" : "top 94%";
    const END = compact ? "top 41%" : "top 36%";
    const scrub = compact ? 0.6 : 0.85;
    const active = [];
    const $ = (host, selector) => [...host.querySelectorAll(selector)];
    const has = (host, selector) => host.querySelector(selector);
    const ease = "power2.out";

    // Não usamos transform inline nos cards: CSS translate/scale preserva
    // o hover original (transform:translateY(-6px)) sem conflito com GSAP.
    function entrance(tl, node, at, duration = .62, startY = 55) {
      if (!node) return;
      tl.fromTo(node,
        {opacity:0, "--bell-enter-y":startY + "px", "--bell-enter-scale":.975},
        {opacity:1, "--bell-enter-y":"0px", "--bell-enter-scale":1,
          duration, ease:"power2.out", immediateRender:true}, at);
    }

    const number = new Intl.NumberFormat("pt-BR");
    function animateNumber(tl, element, at, duration = .68) {
      if (!element) return;
      const raw = element.textContent.trim();
      const match = raw.match(/^([+\-]?)(\d[\d.,]*)(.*)$/);
      if (!match) return;
      const goal = Number(match[2].replace(/\./g,"").replace(",","."));
      if (!Number.isFinite(goal)) return;
      const decimals = match[2].includes(",") ? match[2].split(",")[1].length : 0;
      const formatter = new Intl.NumberFormat("pt-BR",{
        minimumFractionDigits:decimals,maximumFractionDigits:decimals
      });
      const prefix = match[1], suffix = match[3];
      const state = {value:0};
      // Scroll reversível: ao rolar para cima a contagem retrocede.
      tl.fromTo(state,{value:0},{value:goal,duration,ease,
        immediateRender:true,
        onUpdate:()=>{
          const value = decimals ? state.value : Math.round(state.value);
          element.textContent = prefix + formatter.format(value) + suffix;
        }
      },at);
      // Valor originalmente rotulado continua intacto para leitores de tela.
      element.setAttribute("aria-label",raw);
      element.style.fontVariantNumeric = "tabular-nums";
    }

    function timeline(trigger, end = END) {
      const t = gsap.timeline({paused:false,defaults:{ease}});
      active.push(ST.create({
        trigger,start:START,end,
        animation:t,scrub,
        invalidateOnRefresh:true,
        fastScrollEnd:false
      }));
      return t;
    }

    // Título do dashboard aparece antes dos indicadores.
    const heading = root.querySelector(".bell-results-heading");
    if (heading) {
      const t = timeline(heading,compact?"top 55%":"top 52%");
      t.fromTo($(heading,".bell-accent-line,h2,p"),
        {autoAlpha:0,y:30},
        {autoAlpha:1,y:0,duration:.62,stagger:.13,ease:"power2.out"},0);
    }

    // Os quatro KPIs aparecem em cascata, e seus números crescem juntos.
    const statRow = root.querySelector(".bell-stat-grid");
    const stats = statRow ? $(statRow,".bell-stat") : [];
    if (statRow && stats.length) {
      const t = timeline(statRow,compact?"top 49%":"top 45%");
      stats.forEach((card,i) => {
        const begin = i*(compact?.105:.145);
        entrance(t,card,begin,.59,compact?30:49);
        const icon=has(card,".bell-stat-icon");
        if (icon) t.fromTo(icon,{scale:.65,rotate:-12,opacity:.1},
          {scale:1,rotate:0,opacity:1,duration:.45,ease:"back.out(1.6)"},begin+.15);
        animateNumber(t,has(card,":scope > b"),begin+.20,.58);
      });
    }

    // Cada gráfico possui sua própria zona de scroll, para não animar
    // fora da viewport nem competir com o painel anterior.
    const charts = $(root,".bell-chart");
    charts.forEach(chart => {
      const t = timeline(chart);
      entrance(t,chart,0,.56,compact?36:55);
      const header = $(chart,".bell-overline,.bell-chart-number,.bell-chart-heading p");
      if (header.length) {
        t.fromTo(header,{opacity:0,y:15},
          {opacity:1,y:0,duration:.30,stagger:.055},.16);
      }

      if (chart.classList.contains("bell-chart-reach")) {
        const bars = $(chart,".bell-bar");
        // Da base para o topo, em sequência por mês.
        t.fromTo(bars,{scaleY:0,opacity:.3,transformOrigin:"center bottom"},
          {scaleY:1,opacity:1,duration:.55,stagger:.095,ease:"power2.out",
            transformOrigin:"center bottom"},.35);
        animateNumber(t,has(chart,".bell-chart-number"),.29,.78);
        const trend = has(chart,".bell-bottom-trend");
        if (trend) t.fromTo(trend,{opacity:0,y:12},
          {opacity:1,y:0,duration:.29},.91);

      } else if (chart.classList.contains("bell-chart-engagement")) {
        animateNumber(t,has(chart,".bell-chart-number"),.29,.77);
        if (line) {
          // Desenha a curva real por strokeDashoffset.
          const length = line.getTotalLength();
          if (length > 0) t.fromTo(line,
            {strokeDasharray:length,strokeDashoffset:length},
            {strokeDasharray:length,strokeDashoffset:0,
              duration:.78,ease:"power1.inOut"},.35);
        }
        if (fill) t.fromTo(fill,{opacity:0},{opacity:1,duration:.38},.68);
        const dots=$(chart,".bell-line-chart circle");
        if (dots.length) t.fromTo(dots,
          {opacity:0,scale:0,transformOrigin:"center center"},
          {opacity:1,scale:1,duration:.36,stagger:.10,ease:"back.out(1.5)"},.78);
        const bubble=has(chart,".bell-floating-gain");
        if (bubble) t.fromTo(bubble,{opacity:0,y:24,scale:.82},
          {opacity:1,y:0,scale:1,duration:.43,ease:"back.out(1.4)",
            clearProps:"transform"},.83);

      } else if (chart.classList.contains("bell-chart-map")) {
        const land=$(chart,".bell-world path");
        if (land.length) t.fromTo(land,{opacity:.10,y:12},
          {opacity:1,y:0,duration:.46,stagger:.12},.35);
        const pins=$(chart,".bell-world circle");
        if (pins.length) t.fromTo(pins,
          {opacity:0,scale:0,transformOrigin:"center center"},
          {opacity:1,scale:1,duration:.40,stagger:.15,ease:"back.out(1.8)"},.63);
        const note=has(chart,".bell-chart-muted");
        if (note) t.fromTo(note,{opacity:0,y:10},
          {opacity:1,y:0,duration:.30},.88);

      } else if (chart.classList.contains("bell-chart-mix")) {
        const donut=has(chart,".bell-donut");
        if (donut) t.fromTo(donut,
          {"--bell-donut-reveal":"0%"},
          {"--bell-donut-reveal":"100%",duration:.78,ease:"power1.inOut"},.35);
        const legend=$(chart,".bell-mix-legend > div");
        if (legend.length) t.fromTo(legend,
          {opacity:0,x:18},
          {opacity:1,x:0,duration:.43,stagger:.13},.46);
        animateNumber(t,has(chart,".bell-donut b"),.45,.72);
      }
    });

    // Ao abrir diretamente o hash da seção, o progresso reflete o scroll.
    requestAnimationFrame(() => ST.refresh());
    if (document.fonts?.ready) document.fonts.ready.then(() => ST.refresh());

    // Desmontagem limpa ao navegar fora da página (sem triggers duplicados).
    window.addEventListener("pagehide",()=>{
      active.forEach(trigger => trigger.kill());
    },{once:true});
  };
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
