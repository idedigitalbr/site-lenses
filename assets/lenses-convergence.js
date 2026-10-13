/* LENSES · Como Conectamos: movimento leve, hover, foco e acessibilidade. */
(() => {
  const section = document.querySelector('[data-lenses-convergence]');
  if (!section) return;
  const art = section.querySelector('.lcs-art');
  const triggers = Array.from(section.querySelectorAll('[data-lcs-pillar]'));
  const pillars = ['purpose', 'consistency', 'result'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let inViewport = false;
  let interacting = false;
  let pinned = null;
  let pointerInside = false;
  let index = -1;

  function activate(name) {
    section.dataset.focus = name || 'none';
  }
  function resume() {
    interacting = false;
    activate(pinned);
  }
  triggers.forEach(button => {
    const name = button.dataset.lcsPillar;
    button.addEventListener('pointerenter', () => { interacting = true; activate(name); });
    button.addEventListener('pointerleave', () => { if (!section.contains(document.activeElement)) resume(); });
    button.addEventListener('focus', () => { interacting = true; activate(name); });
    button.addEventListener('blur', () => { if (!pointerInside) resume(); });
    button.addEventListener('click', () => {
      pinned = pinned === name ? null : name;
      activate(pinned || name);
    });
  });
  art.addEventListener('pointerenter', () => { pointerInside = true; });
  art.addEventListener('pointerleave', () => {
    pointerInside = false;
    if (!section.contains(document.activeElement)) resume();
    art.style.removeProperty('--spot-x');
    art.style.removeProperty('--spot-y');
  });
  art.addEventListener('pointermove', event => {
    if (reduceMotion.matches) return;
    const box = art.getBoundingClientRect();
    art.style.setProperty('--spot-x', (((event.clientX - box.left) / box.width) * 100).toFixed(1) + '%');
    art.style.setProperty('--spot-y', (((event.clientY - box.top) / box.height) * 100).toFixed(1) + '%');
  }, {passive: true});

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inViewport = entries[0].isIntersecting;
      section.classList.toggle('lcs-visible', inViewport);
    }, {threshold: .08});
    observer.observe(section);
  } else {
    inViewport = true;
    section.classList.add('lcs-visible');
  }
  if (!reduceMotion.matches) {
    window.setInterval(() => {
      if (!inViewport || document.hidden || interacting || pinned) return;
      index = (index + 1) % pillars.length;
      activate(pillars[index]);
    }, 4300);
  }
})();
