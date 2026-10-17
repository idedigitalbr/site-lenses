/* LENSES · Digital | animações leves, sem bibliotecas extras
   Respeita prefers-reduced-motion e mantém elementos visíveis sem JS. */
(() => {
  const init = () => {
    const body = document.body;
    if (!body.classList.contains('digital-page')) return;
    const nodes = Array.from(document.querySelectorAll('.d-reveal'));
    if (!nodes.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        !('IntersectionObserver' in window)) return;

    // Somente ativar classes de entrada após DOM pronto. Um JS que falhe
    // não pode esconder a seção inteira em produção.
    body.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.09, rootMargin: '0px 0px -25px 0px' });
    nodes.forEach(node => observer.observe(node));
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
