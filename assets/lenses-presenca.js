/* Movimento editorial: imagens + timeline progressiva, respeitando reduced-motion. */
(() => {
  const section = document.querySelector('[data-lenses-presenca]');
  if (!section) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = Array.from(section.querySelectorAll('.lap-milestone'));
  const panel = section.querySelector('.lap-panel');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        section.classList.add('is-visible');
        observer.disconnect();
      }
    }, {threshold: .15, rootMargin:'0px 0px -25px 0px'});
    observer.observe(section);
  } else {
    section.classList.add('is-visible');
  }
  items.forEach(item => {
    item.addEventListener('pointerenter', () => {
      items.forEach(other => other.classList.toggle('is-active', other === item));
    });
    item.addEventListener('focus', () => {
      items.forEach(other => other.classList.toggle('is-active', other === item));
    });
  });
  section.addEventListener('pointerleave', () => items.forEach(item => item.classList.remove('is-active')));
  section.addEventListener('focusout', event => {
    if (!section.contains(event.relatedTarget)) items.forEach(item => item.classList.remove('is-active'));
  });
  if (!reduceMotion && panel && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let raf = 0;
    panel.addEventListener('pointermove', e => {
      if (raf) return;
      const {left, top, width, height} = panel.getBoundingClientRect();
      const offsetX = ((e.clientX - left) / width - .5) * 18;
      const offsetY = ((e.clientY - top) / height - .5) * 18;
      raf = requestAnimationFrame(() => {
        panel.style.setProperty('--lap-orbit-x', offsetX.toFixed(1) + 'px');
        panel.style.setProperty('--lap-orbit-y', offsetY.toFixed(1) + 'px');
        raf = 0;
      });
    });
    panel.addEventListener('pointerleave', () => {
      panel.style.setProperty('--lap-orbit-x','0px');
      panel.style.setProperty('--lap-orbit-y','0px');
    });
  }
})();