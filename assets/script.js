document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-lnk');

  if (menuToggle && mobileNav) {
    const siteHeaderEl = document.getElementById('siteHeader');
    const toggleMenu = () => {
      const isOpen = mobileNav.classList.toggle('active');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
      if (siteHeaderEl) siteHeaderEl.classList.toggle('menu-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        if (siteHeaderEl) siteHeaderEl.classList.remove('menu-open');
        document.body.style.overflow = '';
      });
    });
  }

  // 2. Video Modal Lightbox (Showreel)
  const showreelBtn = document.getElementById('openShowreel');
  const videoModal = document.getElementById('videoModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalIframe = document.getElementById('modalVideoIframe');
  const defaultVideoSrc = 'https://www.youtube-nocookie.com/embed/Q3G3XXAN3jE?autoplay=1&rel=0';

  function openModal(e) {
    if (e) e.preventDefault();
    if (!videoModal || !modalIframe) return;
    modalIframe.src = defaultVideoSrc;
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!videoModal || !modalIframe) return;
    videoModal.classList.remove('active');
    modalIframe.src = '';
    document.body.style.overflow = '';
  }

  if (showreelBtn) {
    showreelBtn.addEventListener('click', openModal);
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // 3. Autoplay Resiliente exclusivo para o Vídeo de Background (Hero)
  const heroVideo = document.getElementById('heroVideo') || document.querySelector('.hero-video-wrapper video');
  if (heroVideo) {
    heroVideo.muted = true;
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        heroVideo.muted = true;
        heroVideo.play().catch(() => {});
      });
    }

    const onFirstUserGesture = () => {
      if (heroVideo.paused) {
        heroVideo.muted = true;
        heroVideo.play().catch(() => {});
      }
      window.removeEventListener('click', onFirstUserGesture);
      window.removeEventListener('scroll', onFirstUserGesture);
      window.removeEventListener('touchstart', onFirstUserGesture);
    };
    window.addEventListener('click', onFirstUserGesture, { once: true });
    window.addEventListener('scroll', onFirstUserGesture, { once: true });
    window.addEventListener('touchstart', onFirstUserGesture, { once: true });
  }

  // 3.01. Controles Minimalistas do Vídeo do Hero (Mute/Unmute e Fullscreen)
  const heroMuteBtn = document.getElementById('heroMuteBtn');
  const heroFullscreenBtn = document.getElementById('heroFullscreenBtn');
  const heroSection = document.getElementById('inicio');
  const heroControlsZone = document.getElementById('heroVideoControlsZone');
  const heroControls = document.getElementById('heroVideoControls');

  // MUTE / UNMUTE (Sincronizado com o vídeo nativo)
  if (heroVideo && heroMuteBtn) {
    const updateMuteUi = () => {
      const isMuted = heroVideo.muted;
      heroMuteBtn.classList.toggle('is-muted', isMuted);
      const titleText = isMuted ? 'Ativar som' : 'Desativar som';
      heroMuteBtn.setAttribute('aria-label', titleText);
      heroMuteBtn.setAttribute('title', titleText);
    };

    heroMuteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      heroVideo.muted = !heroVideo.muted;
      if (!heroVideo.muted && heroVideo.paused) {
        heroVideo.play().catch(() => {});
      }
      updateMuteUi();
    });

    heroVideo.addEventListener('volumechange', updateMuteUi);
    updateMuteUi();
  }

  // FULLSCREEN NATIVO (Fullscreen API com alternância dinâmica de ícones)
  if (heroSection && heroFullscreenBtn) {
    const isFullscreenActive = () => {
      return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
    };

    const updateFullscreenUi = () => {
      const isFs = isFullscreenActive();
      heroFullscreenBtn.classList.toggle('is-fullscreen', isFs);
      const titleText = isFs ? 'Sair da tela cheia' : 'Tela cheia';
      heroFullscreenBtn.setAttribute('aria-label', titleText);
      heroFullscreenBtn.setAttribute('title', titleText);
    };

    heroFullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isFullscreenActive()) {
        if (heroSection.requestFullscreen) {
          heroSection.requestFullscreen();
        } else if (heroSection.webkitRequestFullscreen) {
          heroSection.webkitRequestFullscreen();
        } else if (heroSection.msRequestFullscreen) {
          heroSection.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    });

    document.addEventListener('fullscreenchange', updateFullscreenUi);
    document.addEventListener('webkitfullscreenchange', updateFullscreenUi);
    document.addEventListener('mozfullscreenchange', updateFullscreenUi);
    document.addEventListener('MSFullscreenChange', updateFullscreenUi);
    updateFullscreenUi();
  }

  // SUPORTE MOBILE / TOUCH (Acessibilidade discreta com auto-hide temporário)
  if (heroControls && heroControlsZone) {
    let hideTimer = null;
    const triggerMobileControls = () => {
      heroControls.classList.add('is-visible');
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        heroControls.classList.remove('is-visible');
      }, 4000);
    };

    heroControlsZone.addEventListener('touchstart', () => {
      triggerMobileControls();
    }, { passive: true });

    if (heroSection) {
      heroSection.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.hero-ctrl-btn') && !e.target.closest('#scrollDownBtn')) {
          triggerMobileControls();
        }
      }, { passive: true });
    }
  }

  // 3.1 Controle Interativo de Vídeos nos Cards de Serviços (Play no Hover)
  const serviceCards = document.querySelectorAll('.service-item');
  serviceCards.forEach(card => {
    const video = card.querySelector('video');
    if (video) {
      video.muted = true;
      video.pause();

      card.addEventListener('mouseenter', () => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      });

      card.addEventListener('mouseleave', () => {
        video.pause();
      });

      // Suporte a toque em mobile e tablets
      card.addEventListener('touchstart', () => {
        serviceCards.forEach(otherCard => {
          const otherVid = otherCard.querySelector('video');
          if (otherVid && otherVid !== video) {
            otherVid.pause();
          }
        });
        if (video.paused) {
          video.play().catch(() => {});
        }
      }, { passive: true });
    }
  });

  // 4. Header Menu Dinâmico com Detecção de Direção de Scroll (Padrão Zion)
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    let lastScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop);
    let isTicking = false;
    const SCROLL_THRESHOLD = 6; // Sensibilidade de scroll para evitar micro-oscilações
    const TOP_THRESHOLD = 28;   // Altura da faixa superior compacta

    const handleHeaderScroll = () => {
      const currentScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop);

      // Não esconde se o drawer mobile estiver ativo
      if (mobileNav && mobileNav.classList.contains('active')) {
        lastScrollY = currentScrollY;
        isTicking = false;
        return;
      }

      // 1. Estado no Topo absoluto da página:
      // Header visível com fundo preto + faixa superior azul visível
      if (currentScrollY <= TOP_THRESHOLD) {
        siteHeader.classList.add('is-top');
        siteHeader.classList.remove('is-hidden', 'is-scrolled-up');
        lastScrollY = currentScrollY;
        isTicking = false;
        return;
      }

      const scrollDiff = currentScrollY - lastScrollY;

      // Ignora micro-movimentos
      if (Math.abs(scrollDiff) < SCROLL_THRESHOLD) {
        isTicking = false;
        return;
      }

      if (scrollDiff > 0) {
        // 2. Scroll para BAIXO:
        // Header sobe suavemente e desaparece completamente da tela
        siteHeader.classList.remove('is-top', 'is-scrolled-up');
        siteHeader.classList.add('is-hidden');
      } else {
        // 3. Scroll para CIMA (estando abaixo do topo):
        // Header reaparece pelo topo com fundo preto elegante e permanece fixo
        siteHeader.classList.remove('is-top', 'is-hidden');
        siteHeader.classList.add('is-scrolled-up');
      }

      lastScrollY = currentScrollY;
      isTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!isTicking) {
        window.requestAnimationFrame(handleHeaderScroll);
        isTicking = true;
      }
    }, { passive: true });

    // Dispara no carregamento
    handleHeaderScroll();
  }

  // 4.1. Scroll Suave para a Seta Minimalista de Scroll do Hero
  const scrollDownBtn = document.getElementById('scrollDownBtn');
  const sobreSection = document.getElementById('sobre');
  if (scrollDownBtn && sobreSection) {
    scrollDownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sobreSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 5. Scroll Reveal com IntersectionObserver (Padrão Zion)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback para navegadores sem suporte
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }


  // 6. Split CTA Interativo Cinematográfico (Breve História & Contato)
  const splitWrapper = document.getElementById('splitInteractive');
  const panelStory = document.getElementById('panelStory');
  const panelContact = document.getElementById('panelContact');

  if (splitWrapper && panelStory && panelContact) {
    let currentState = 'idle'; // 'idle' | 'story' | 'contact'

    function applyState(state) {
      currentState = state;
      splitWrapper.setAttribute('data-state', state);

      if (state === 'story') {
        panelStory.classList.add('is-active', 'is-pinned');
        panelContact.classList.remove('is-active', 'is-pinned');
        panelStory.setAttribute('aria-expanded', 'true');
        panelContact.setAttribute('aria-expanded', 'false');
      } else if (state === 'contact') {
        panelContact.classList.add('is-active', 'is-pinned');
        panelStory.classList.remove('is-active', 'is-pinned');
        panelContact.setAttribute('aria-expanded', 'true');
        panelStory.setAttribute('aria-expanded', 'false');
      } else {
        // Retorno ao Estado Idle (50% / 50%)
        panelStory.classList.remove('is-active', 'is-pinned');
        panelContact.classList.remove('is-active', 'is-pinned');
        panelStory.setAttribute('aria-expanded', 'false');
        panelContact.setAttribute('aria-expanded', 'false');
      }
    }

    // Ativação ao clicar em links que apontam para #sobre
    document.querySelectorAll('a[href="#sobre"]').forEach(link => {
      link.addEventListener('click', () => {
        applyState('story');
      });
    });

    // Interações de Clique (Apenas no clique os painéis se abrem ou fecham)
    function handlePanelClick(targetPanelName, event) {
      // Se clicou em um link ou botão de ação direta dentro do conteúdo, permite a navegação sem fechar
      if (event.target.closest('a[href], button:not([role="button"])')) {
        return;
      }

      if (currentState === targetPanelName) {
        // Clique no mesmo painel já aberto: fecha e retorna ao idle
        applyState('idle');
      } else {
        // Abre o painel clicado ou alterna diretamente entre os painéis
        applyState(targetPanelName);
      }
    }

    panelStory.addEventListener('click', (e) => handlePanelClick('story', e));
    panelContact.addEventListener('click', (e) => handlePanelClick('contact', e));

    // Acessibilidade via Teclado (Enter, Space, Escape)
    function handleKeydown(panelName, event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handlePanelClick(panelName, event);
      }
    }

    panelStory.addEventListener('keydown', (e) => handleKeydown('story', e));
    panelContact.addEventListener('keydown', (e) => handleKeydown('contact', e));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && currentState !== 'idle') {
        applyState('idle');
      }
    });
  }

  // 7. CARROSSÉIS DE PROJETOS (01 Destaque / 02 Duplos) — motor próprio, sem dependências
  const PROJECTS = {
    featured: [
      {
        title: 'Manifesto All Amazônia',
        description: 'Performance audiovisual na Times Square durante a Assembleia Geral da ONU.',
        image: 'assets/festival-futuro.png',
        category: 'Eventos',
        location: 'Nova York',
        year: '2023',
        url: 'https://wa.me/5591992000000?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20case%20Manifesto%20All%20Amaz%C3%B4nia.',
        // A foto já traz a legenda gravada na imagem: não duplicar o texto
        imageCaption: true
      },
      {
        title: 'Echoes',
        description: 'Produção de filme institucional em estúdio, com equipe e equipamento próprio.',
        image: 'assets/about-back.png',
        category: 'Filme',
        location: 'Brasil',
        year: '2024',
        url: 'https://wa.me/5591992000000?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%20produ%C3%A7%C3%A3o%20de%20filmes%20institucionais.'
      },
      {
        title: 'Estúdio LENSES',
        description: 'Captação multicâmera e finalização em 4K no estúdio próprio da LENSES.',
        image: 'assets/contact-bg.png',
        category: 'Audiovisual',
        location: 'Brasil',
        year: '2025',
        url: 'https://wa.me/5591992000000?text=Ol%C3%A1!%20Gostaria%20de%20conhecer%20a%20estrutura%20do%20Est%C3%BAdio%20LENSES.'
      }
    ],
    secondary: [
      {
        title: 'Conversas que Inspiram',
        description: 'Cobertura de evento com podcast e transmissão ao vivo.',
        image: 'assets/servicos/serv-cobertura-eventos-poster.jpg',
        category: 'Eventos',
        year: '2025',
        url: 'https://wa.me/5591992000000?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20cobertura%20de%20eventos%20e%20podcasts.'
      },
      {
        title: 'Estrada Seca',
        description: 'Filme publicitário com direção de arte e captação em locação.',
        image: 'assets/servicos/serv-filmes-publicitarios.jpg',
        category: 'Publicidade',
        year: '2024',
        url: 'https://wa.me/5591992000000?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20filmes%20publicit%C3%A1rios.'
      },
      {
        title: 'War Room de Marca',
        description: 'Planejamento estratégico com time multidisciplinar.',
        image: 'assets/servicos/serv-planejamento-estrategico.jpg',
        category: 'Estratégia',
        year: '2024',
        url: 'https://wa.me/5591992000000?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20planejamento%20estrat%C3%A9gico%20de%20comunica%C3%A7%C3%A3o.'
      },
      {
        title: 'Painel de Cenários',
        description: 'Mapeamento de cenários e leitura de dados para comunicação.',
        image: 'assets/servicos/serv-mapeamento-cenarios.jpg',
        category: 'Estratégia',
        year: '2023',
        url: 'https://wa.me/5591992000000?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20mapeamento%20de%20cen%C3%A1rios.'
      },
      {
        title: 'ESG em Movimento',
        description: 'Campanha publicitária com abordagem documental.',
        image: 'assets/servicos/serv-propaganda-esg-poster.jpg',
        category: 'Publicidade',
        year: '2025',
        url: 'https://wa.me/5591992000000?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20campanhas%20de%20Propaganda%20e%20ESG.'
      },
      {
        title: 'Câmera em Movimento',
        description: 'Produção audiovisual autoral, do conceito à finalização.',
        image: 'assets/servicos/serv-producao-audiovisual-poster.jpg',
        category: 'Audiovisual',
        year: '2024',
        url: 'https://wa.me/5591992000000?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20produ%C3%A7%C3%A3o%20audiovisual.'
      }
    ]
  };

  const esc = (value) => String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  // Informações do slide: texto sobre a foto (título branco + tracinho azul)
  function renderInfoCard(project, variant) {
    const parts = variant === 'sm'
      ? [project.category, project.year]
      : [project.category, project.location, project.year];
    const meta = parts.filter(Boolean).join(' · ');
    const isLink = Boolean(project.url);
    const tag = isLink ? 'a' : 'div';
    const isExternal = isLink && (project.url.startsWith('http://') || project.url.startsWith('https://'));
    const targetAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    const attrs = isLink ? ` href="${esc(project.url)}"${targetAttrs}` : '';

    return `<${tag} class="pc-card${variant === 'sm' ? ' pc-card-sm' : ''}"${attrs}>` +
      `<div class="pc-card-title">${esc(project.title)}</div>` +
      `<div class="pc-card-desc">${esc(project.description)}</div>` +
      (meta ? `<div class="pc-card-meta">${esc(meta)}</div>` : '') +
      `</${tag}>`;
  }

  function renderFeaturedSlide(project) {
    // Suporte futuro a vídeo: basta informar `video` (+ `poster` opcional) nos dados.
    // `imageCaption`: foto já traz legenda gravada → não renderizar o texto por cima.
    const media = project.video
      ? `<video class="featured-slide-media" src="${esc(project.video)}" poster="${esc(project.poster || project.image)}" muted loop playsinline preload="none"></video>`
      : `<img class="featured-slide-media${project.imageCaption ? ' featured-slide-media--caption' : ''}" src="${esc(project.image)}" alt="${esc(project.title)}" decoding="async">`;

    return media +
      `<div class="featured-slide-overlay" aria-hidden="true"></div>` +
      (project.imageCaption ? '' : renderInfoCard(project, 'lg'));
  }

  function renderDuoSlide(project) {
    return `<img class="duo-slide-media" src="${esc(project.image)}" alt="${esc(project.title)}" decoding="async">` +
      `<div class="duo-slide-overlay" aria-hidden="true"></div>` +
      renderInfoCard(project, 'sm');
  }

  function initCarousel(root, config) {
    const viewport = root.querySelector('[data-carousel-viewport]');
    const track = root.querySelector('[data-carousel-track]');
    const prevBtn = root.querySelector('[data-carousel-prev]');
    const nextBtn = root.querySelector('[data-carousel-next]');
    const dotsWrap = root.querySelector('[data-carousel-dots]');
    if (!viewport || !track || !dotsWrap) return;

    const items = config.items;
    const total = items.length;
    if (!total) return;

    const COPIES = 3; // clone + original + clone (margem de segurança visual)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let page = 0;
    let pages = 0;
    let perView = 1;
    let step = 1;
    let slideWidth = 0;
    let stride = 0;

    // --- Slides (3 cópias; bloco central = original) ---
    const slides = [];
    const fragment = document.createDocumentFragment();
    for (let copy = 0; copy < COPIES; copy++) {
      for (let i = 0; i < total; i++) {
        const itemIndex = config.reverse ? total - 1 - i : i;
        const project = items[itemIndex];
        const slide = document.createElement('div');
        slide.className = 'carousel-slide ' + (config.reverse ? 'featured-slide' : 'duo-slide');
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', `${itemIndex + 1} de ${total}`);
        slide.innerHTML = config.render(project);
        fragment.appendChild(slide);
        slides.push(slide);
      }
    }
    track.appendChild(fragment);

    // Índice do slide mais à esquerdo da janela para uma página (bloco central)
    function posOf(targetPage) {
      const offset = targetPage * step;
      return config.reverse ? 2 * total - 1 - offset : total + offset;
    }

    function setPos(index, animate) {
      const instant = !animate || reducedMotion.matches;
      track.classList.toggle('is-instant', instant);
      track.style.transform = `translate3d(${-index * stride}px, 0, 0)`;
      if (instant) void track.offsetHeight; // aplica o salto antes de reativar a transição
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', config.dotLabel(i, pages));
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function measure() {
      const computed = window.getComputedStyle(track);
      const gap = parseFloat(computed.columnGap) || 0;
      perView = config.perView();
      step = perView; // avança de 2 em 2 no desktop, de 1 em 1 no mobile
      const available = viewport.clientWidth;
      slideWidth = perView > 1 ? (available - gap * (perView - 1)) / perView : available;
      stride = slideWidth + gap;
      slides.forEach((slide) => {
        slide.style.width = `${slideWidth}px`;
      });

      const nextPages = Math.ceil(total / step);
      if (nextPages !== pages) {
        pages = nextPages;
        page = Math.min(page, pages - 1);
        buildDots();
      }
    }

    function syncUI() {
      const start = posOf(page);
      const end = start + perView;

      for (let i = 0; i < dotsWrap.children.length; i++) {
        if (i === page) {
          dotsWrap.children[i].setAttribute('aria-current', 'true');
        } else {
          dotsWrap.children[i].removeAttribute('aria-current');
        }
      }

      slides.forEach((slide, index) => {
        const inView = index >= start && index < end;
        slide.setAttribute('aria-hidden', inView ? 'false' : 'true');
        slide.querySelectorAll('a, button').forEach((el) => {
          if (inView) el.removeAttribute('tabindex');
          else el.setAttribute('tabindex', '-1');
        });
        const video = slide.querySelector('video');
        if (video) {
          if (inView && !shouldPause()) video.play().catch(() => {});
          else video.pause();
        }
      });
    }

    function goTo(targetPage, animate = true) {
      page = ((targetPage % pages) + pages) % pages;
      setPos(posOf(page), animate);
      syncUI();
      schedule();
    }

    // --- Autoplay com pausas (hover, foco, drag, fora da tela, aba oculta, reduced-motion) ---
    let hoverPause = false;
    let focusPause = false;
    let inViewport = true;
    let dragging = false;
    let autoplayTimer = null;

    function shouldPause() {
      return reducedMotion.matches || hoverPause || focusPause || !inViewport ||
        document.hidden || dragging;
    }

    function schedule() {
      clearTimeout(autoplayTimer);
      if (shouldPause() || pages < 2) return;
      autoplayTimer = setTimeout(() => goTo(page + 1), config.interval);
    }

    root.addEventListener('mouseenter', () => {
      hoverPause = true;
      schedule();
    });
    root.addEventListener('mouseleave', () => {
      hoverPause = false;
      schedule();
    });
    root.addEventListener('focusin', () => {
      focusPause = true;
      schedule();
    });
    root.addEventListener('focusout', () => {
      focusPause = root.contains(document.activeElement);
      schedule();
    });
    document.addEventListener('visibilitychange', schedule);
    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', schedule);
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          inViewport = entry.isIntersecting;
        });
        schedule();
      }, { threshold: 0.2 });
      io.observe(root);
    }

    // --- Controles ---
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(page - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(page + 1));

    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(page - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(page + 1);
      }
    });

    // --- Swipe / drag (touch-action: pan-y no CSS preserva o scroll vertical) ---
    let dragStartX = 0;
    let dragOffset = 0;
    let dragMoved = false;
    let activePointer = null;

    viewport.addEventListener('pointerdown', (e) => {
      if (e.button != null && e.button !== 0) return;
      if (e.target.closest('button, a')) return;
      dragging = true;
      dragMoved = false;
      dragOffset = 0;
      dragStartX = e.clientX;
      activePointer = e.pointerId;
      clearTimeout(autoplayTimer);
      try {
        viewport.setPointerCapture(e.pointerId);
      } catch (err) { /* noop */ }
    });

    viewport.addEventListener('pointermove', (e) => {
      if (!dragging || e.pointerId !== activePointer) return;
      dragOffset = e.clientX - dragStartX;
      if (!dragMoved && Math.abs(dragOffset) < 8) return;
      dragMoved = true;
      track.classList.add('is-instant');
      track.style.transform = `translate3d(${-(posOf(page) * stride) + dragOffset}px, 0, 0)`;
    });

    function endDrag(e) {
      if (!dragging || (e && e.pointerId !== activePointer)) return;
      dragging = false;
      try {
        viewport.releasePointerCapture(activePointer);
      } catch (err) { /* noop */ }
      activePointer = null;

      if (dragMoved) {
        const threshold = Math.min(80, slideWidth * 0.18);
        if (Math.abs(dragOffset) > threshold) {
          // Sentido oposto ao carrossel grande: aqui o arrasto avança para a esquerda
          const advancing = config.reverse ? dragOffset > 0 : dragOffset < 0;
          goTo(advancing ? page + 1 : page - 1);
        } else {
          setPos(posOf(page), true); // volta para a posição atual com transição
        }
        const suppressClick = (event) => {
          event.preventDefault();
          event.stopPropagation();
        };
        root.addEventListener('click', suppressClick, { capture: true, once: true });
      }
      schedule();
    }

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    // --- Resize: recalcula larguras, passo e dots (sem transição) ---
    let resizeFrame = null;
    window.addEventListener('resize', () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        measure();
        setPos(posOf(page), false);
        syncUI();
        schedule();
      });
    });

    // --- Estado inicial (síncrono: evita qualquer flash de layout) ---
    measure();
    setPos(posOf(page), false);
    syncUI();
    schedule();
  }

  const CAROUSEL_CONFIGS = {
    featured: {
      items: PROJECTS.featured,
      reverse: true, // movimento → direita
      interval: 5500,
      perView: () => 1,
      render: renderFeaturedSlide,
      dotLabel: (index, total) => `Ir para o case ${index + 1} de ${total}`
    },
    duo: {
      items: PROJECTS.secondary,
      reverse: false, // movimento ← esquerda (oposto ao grande)
      interval: 6500,
      perView: () => (window.matchMedia('(max-width: 768px)').matches ? 1 : 2),
      render: renderDuoSlide,
      dotLabel: (index, total) => `Ir para o grupo ${index + 1} de ${total}`
    }
  };

  document.querySelectorAll('[data-carousel]').forEach((rootEl) => {
    const config = CAROUSEL_CONFIGS[rootEl.getAttribute('data-carousel')];
    if (config) initCarousel(rootEl, config);
  });
});
