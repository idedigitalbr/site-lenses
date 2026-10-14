/* LENSES • Fundamentos v4: linha progressiva, 3 revelações e seleção acessível.
   CSS mantém tudo visível sem JS. Preferência por movimento reduzido respeitada. */
(() => {
  const section = document.querySelector('[data-lenses-foundations]');
  if (!section) return;

  const steps = Array.from(section.querySelectorAll('.lf-step'));
  const nodes = Array.from(section.querySelectorAll('.lf-track-node'));
  if (steps.length !== 3 || nodes.length !== 3) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const touch = window.matchMedia('(hover: none)');
  let settled = false;
  let pinned = -1;
  let hovering = -1;

  const progress = (value, traveling = false) => {
    const amount = Math.max(0, Math.min(1, value));
    section.style.setProperty('--lf-progress', String(amount));
    section.style.setProperty('--lf-beacon-left', (amount * 100) + '%');
    section.classList.toggle('is-traveling', traveling && !reduce.matches);
  };

  const highlight = index => {
    steps.forEach((step, i) => step.classList.toggle('is-active', index === i));
    nodes.forEach((node, i) => node.classList.toggle('is-active', index === i));
  };

  const focusOn = index => {
    if (!settled) return;
    highlight(index);
    progress(index < 0 ? 1 : index / 2, index >= 0);
  };

  const show = index => {
    steps[index].classList.add('is-revealed');
    nodes[index].classList.add('is-revealed', 'is-reached');
    // Durante a entrada, acender somente o ponto da timeline.
    // O card mantém sua superfície branca e o ícone azul até o hover.
    nodes.forEach((node, i) => node.classList.toggle('is-active', i === index));
    section.classList.remove('is-traveling');
  };

  steps.forEach((step, index) => {
    step.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch' || !settled) return;
      hovering = index;
      focusOn(index);
    });
    step.addEventListener('pointerleave', event => {
      if (event.pointerType === 'touch') return;
      hovering = -1;
      step.style.removeProperty('--lf-spot-x');
      step.style.removeProperty('--lf-spot-y');
      if (pinned === -1) focusOn(-1);
    });
    step.addEventListener('pointermove', event => {
      if (reduce.matches || event.pointerType === 'touch' || !settled) return;
      const rect = step.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      step.style.setProperty('--lf-spot-x', ((event.clientX - rect.left) * 100 / rect.width).toFixed(1) + '%');
      step.style.setProperty('--lf-spot-y', ((event.clientY - rect.top) * 100 / rect.height).toFixed(1) + '%');
    }, {passive:true});
    step.addEventListener('focus', () => {
      if (settled) focusOn(index);
    });
    step.addEventListener('blur', () => {
      if (settled && pinned === -1 && hovering === -1) focusOn(-1);
    });
    const toggleSelection = () => {
      if (!settled) return;
      pinned = pinned === index ? -1 : index;
      focusOn(pinned >= 0 ? pinned : hovering);
    };
    step.addEventListener('click', () => {
      if (touch.matches) toggleSelection();
    });
    step.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleSelection();
      }
      if (event.key === 'Escape') {
        pinned = -1;
        hovering = -1;
        focusOn(-1);
        step.blur();
      }
    });
  });

  const enableInteraction = () => {
    settled = true;
    section.classList.add('is-settled');
    highlight(-1);
    progress(1);
    section.classList.remove('is-traveling');
  };

  if (reduce.matches || !('IntersectionObserver' in window)) {
    nodes.forEach(node => node.classList.add('is-revealed','is-reached'));
    steps.forEach(step => step.classList.add('is-revealed'));
    enableInteraction();
    return;
  }

  progress(0);
  section.classList.add('lf-motion-ready');
  let started = false;

  const start = () => {
    if (started) return;
    started = true;
    section.classList.add('is-in-view');

    // Primeiro aparece o Propósito; a linha então alcança a Visão,
    // depois Valores. Em cada chegada, círculo e card acendem juntos.
    window.setTimeout(() => {show(0); progress(.015);}, 560);
    window.setTimeout(() => progress(.5, true), 1320);
    window.setTimeout(() => show(1), 2190);
    window.setTimeout(() => progress(1, true), 2940);
    window.setTimeout(() => show(2), 3810);
    window.setTimeout(enableInteraction, 4940);
  };

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    requestAnimationFrame(start);
  }, {threshold:.13, rootMargin:'0px 0px -6% 0px'});
  observer.observe(section);
})();
