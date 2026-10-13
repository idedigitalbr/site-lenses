/* LENSES | Fundamentos que constroem: entrada animada e interação suave. */
(() => {
  const section = document.querySelector('[data-lenses-foundations]');
  if (!section) return;
  const steps = Array.from(section.querySelectorAll('.lf-step'));
  const nodes = Array.from(section.querySelectorAll('.lf-track-node'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function highlight(index) {
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    nodes.forEach((node, i) => node.classList.toggle('is-active', i === index));
  }

  steps.forEach((step, index) => {
    step.addEventListener('pointerenter', () => highlight(index));
    step.addEventListener('focus', () => highlight(index));
    step.addEventListener('pointerleave', () => {
      if (!step.matches(':focus-visible')) highlight(-1);
    });
    step.addEventListener('blur', () => highlight(-1));
    step.addEventListener('pointermove', event => {
      if (reducedMotion.matches || event.pointerType === 'touch') return;
      const rect = step.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      step.style.setProperty('--lf-spot-x', ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
      step.style.setProperty('--lf-spot-y', ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
    }, {passive:true});
    step.addEventListener('pointerleave', () => {
      step.style.removeProperty('--lf-spot-x');
      step.style.removeProperty('--lf-spot-y');
    });
    step.addEventListener('click', () => {
      if (!window.matchMedia('(hover: none)').matches) return;
      const active = step.classList.contains('is-active');
      highlight(active ? -1 : index);
    });
  });

  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  section.classList.add('lf-motion-ready');
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      section.classList.add('is-in-view');
      observer.disconnect();
    }
  }, {threshold:.16});
  observer.observe(section);
})();
