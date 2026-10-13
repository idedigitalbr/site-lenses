/* LENSES • Timeline Fundamentos: entrada em três etapas, hover e toque.
 * Animação CSS declarativa com observação de viewport; nunca repete o reveal. */
(() => {
  const section = document.querySelector('[data-lenses-foundations]');
  if (!section) return;

  const steps = [...section.querySelectorAll('.lf-step')];
  const nodes = [...section.querySelectorAll('.lf-track-node')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const touchDevice = window.matchMedia('(hover: none)');

  let touched = -1;

  const setActive = index => {
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    nodes.forEach((node, i) => node.classList.toggle('is-active', i === index));
  };

  steps.forEach((step, index) => {
    step.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') setActive(index);
    });
    step.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'touch' && touched < 0) setActive(-1);
      step.style.removeProperty('--lf-spot-x');
      step.style.removeProperty('--lf-spot-y');
    });
    step.addEventListener('focus', () => setActive(index));
    step.addEventListener('blur', () => {
      if (touched < 0) setActive(-1);
    });
    step.addEventListener('pointermove', event => {
      if (reducedMotion.matches || event.pointerType === 'touch') return;
      const rect = step.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      step.style.setProperty('--lf-spot-x', ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
      step.style.setProperty('--lf-spot-y', ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
    }, {passive:true});
    step.addEventListener('click', () => {
      if (!touchDevice.matches) return;
      touched = touched === index ? -1 : index;
      setActive(touched);
    });
    step.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        touched = touched === index ? -1 : index;
        setActive(touched);
      }
    });
  });

  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const lastStep = steps[steps.length - 1];
  const settle = event => {
    if (event.target !== lastStep || event.propertyName !== 'opacity') return;
    section.classList.add('is-settled');
    lastStep.removeEventListener('transitionend', settle);
  };
  if (lastStep) lastStep.addEventListener('transitionend', settle);

  section.classList.add('lf-motion-ready');
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    requestAnimationFrame(() => section.classList.add('is-in-view'));
    observer.disconnect();
  }, {threshold: .12});
  observer.observe(section);
})();
