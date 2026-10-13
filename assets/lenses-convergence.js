/* LENSES · Como Conectamos
   Cada pilar é preenchido progressivamente a partir da interseção central.
   Movimento de repouso = somente linhas orbitais sutis, sem piscar pilares. */
(() => {
  const section = document.querySelector('[data-lenses-convergence]');
  if (!section) return;

  const art = section.querySelector('.lcs-art');
  const svg = art.querySelector('.lcs-svg');
  const buttons = [...art.querySelectorAll('[data-lcs-pillar]')];
  const names = ['purpose', 'consistency', 'result'];
  const centers = [
    { name: 'purpose', x: 430, y: 238, r: 184 },
    { name: 'consistency', x: 300, y: 432, r: 188 },
    { name: 'result', x: 560, y: 432, r: 188 }
  ];
  const shapes = names.map(name => ({
    name,
    reveal: svg.querySelector('.lcs-reveal--' + name),
    edge: svg.querySelector('.lcs-disc-edge--' + name),
    button: art.querySelector('[data-lcs-pillar="' + name + '"]')
  }));

  let pinned = [];
  let activeKey = '';
  let isHovering = false;

  function setActive(selection) {
    const next = [...new Set(selection)].filter(name => names.includes(name));
    const nextKey = next.join('|');
    if (nextKey === activeKey) return; // Não reiniciar animação enquanto o cursor permanece no círculo.
    activeKey = nextKey;
    shapes.forEach(({ name, reveal, edge, button }) => {
      const on = next.includes(name);
      if (reveal) reveal.classList.toggle('is-active', on);
      if (edge) edge.classList.toggle('is-active', on);
      if (button) button.classList.toggle('is-active', on);
    });
    section.classList.toggle('lcs-has-focus', next.length > 0);
  }

  function circleSelection(event) {
    const button = event.target.closest?.('[data-lcs-pillar]');
    if (button) return [button.dataset.lcsPillar];

    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return [];
    const x = (event.clientX - rect.left) * 860 / rect.width;
    const y = (event.clientY - rect.top) * 740 / rect.height;
    if (Math.hypot(x - 430, y - 367) < 78) return names; // Interseção central destaca o conjunto.

    return centers.filter(({ x: cx, y: cy, r }) => (
      (x - cx) ** 2 + (y - cy) ** 2 <= r ** 2
    )).map(({ name }) => name);
  }

  art.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    isHovering = true;
    setActive(circleSelection(event));
  }, { passive: true });

  art.addEventListener('pointerleave', () => {
    isHovering = false;
    setActive(pinned);
  });

  buttons.forEach(button => {
    button.addEventListener('focus', () => setActive([button.dataset.lcsPillar]));
    button.addEventListener('blur', () => {
      if (!isHovering) setActive(pinned);
    });
    button.addEventListener('click', () => {
      const name = button.dataset.lcsPillar;
      pinned = pinned.length === 1 && pinned[0] === name ? [] : [name];
      setActive(pinned);
      // O clique mantém a área preenchida para toque e navegação por teclado.
      buttons.forEach(b => b.setAttribute('aria-pressed', String(pinned.includes(b.dataset.lcsPillar))));
    });
  });

  art.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || event.target.closest?.('[data-lcs-pillar]')) return;
    const found = circleSelection(event);
    pinned = found.join('|') === pinned.join('|') ? [] : found;
    setActive(pinned);
    buttons.forEach(b => b.setAttribute('aria-pressed', String(pinned.includes(b.dataset.lcsPillar))));
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      section.classList.toggle('lcs-visible', entries[0].isIntersecting);
    }, { threshold: .07 });
    observer.observe(section);
  } else {
    section.classList.add('lcs-visible');
  }

  // Sem setInterval: a animação de preenchimento só acontece quando o usuário interage.
  // Os detalhes orbitais e o halo central seguem com movimento lento independente do mouse.
})();
