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
      // Header visível + fundo transparente sobre o Hero + faixa superior azul visível
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

  // 4.1. Scroll Suave para o Indicador de Scroll Circular do Hero
  const scrollDownBtn = document.getElementById('scrollDownBtn');
  const marcasSection = document.getElementById('marcas');
  if (scrollDownBtn && marcasSection) {
    scrollDownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      marcasSection.scrollIntoView({ behavior: 'smooth' });
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

  // 6. Testimonial Dots Interactivity
  const dots = document.querySelectorAll('.quote-pagination .dot');
  const testimonials = [
    {
      text: 'A LENSES conseguiu traduzir nossa essência em um filme que emocionou e gerou resultados reais.',
      role: 'Diretor de Comunicação',
      company: 'Empresa Parceira'
    },
    {
      text: 'Trabalhar com a equipe da LENSES nos deu a certeza de uma entrega com padrão cinematográfico internacional.',
      role: 'Gerente Executivo de Marca',
      company: 'Grupo Industrial'
    },
    {
      text: 'Sensibilidade amazônica e precisão técnica raras no mercado. Uma parceria estratégica indispensável.',
      role: 'Head de Conteúdo & Relações Institucionais',
      company: 'Operação Nacional'
    }
  ];

  const quoteBody = document.querySelector('.quote-body');
  const authorRole = document.querySelector('.author-role');
  const authorCompany = document.querySelector('.author-company');

  if (dots.length > 0 && quoteBody && authorRole && authorCompany) {
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        if (testimonials[index]) {
          quoteBody.style.opacity = '0';
          setTimeout(() => {
            quoteBody.textContent = testimonials[index].text;
            authorRole.textContent = testimonials[index].role;
            authorCompany.textContent = testimonials[index].company;
            quoteBody.style.opacity = '1';
          }, 200);
        }
      });
    });
  }

  // 7. Split CTA Interativo Cinematográfico (Breve História & Contato)
  const splitWrapper = document.getElementById('splitInteractive');
  const panelStory = document.getElementById('panelStory');
  const panelContact = document.getElementById('panelContact');

  if (splitWrapper && panelStory && panelContact) {
    let currentState = 'idle'; // 'idle' | 'story' | 'contact'
    let isPinned = false;

    function applyState(state, pin = false) {
      currentState = state;
      isPinned = (state !== 'idle') && pin;

      splitWrapper.setAttribute('data-state', state);

      if (state === 'story') {
        panelStory.classList.add('is-active');
        panelContact.classList.remove('is-active');
        panelStory.setAttribute('aria-expanded', 'true');
        panelContact.setAttribute('aria-expanded', 'false');

        if (isPinned) {
          panelStory.classList.add('is-pinned');
          panelContact.classList.remove('is-pinned');
        } else {
          panelStory.classList.remove('is-pinned');
          panelContact.classList.remove('is-pinned');
        }
      } else if (state === 'contact') {
        panelContact.classList.add('is-active');
        panelStory.classList.remove('is-active');
        panelContact.setAttribute('aria-expanded', 'true');
        panelStory.setAttribute('aria-expanded', 'false');

        if (isPinned) {
          panelContact.classList.add('is-pinned');
          panelStory.classList.remove('is-pinned');
        } else {
          panelStory.classList.remove('is-pinned');
          panelContact.classList.remove('is-pinned');
        }
      } else {
        // Retorno ao Estado Idle (50% / 50%)
        panelStory.classList.remove('is-active', 'is-pinned');
        panelContact.classList.remove('is-active', 'is-pinned');
        panelStory.setAttribute('aria-expanded', 'false');
        panelContact.setAttribute('aria-expanded', 'false');
      }
    }

    // Interações de Hover (Pointer/Desktop)
    panelStory.addEventListener('mouseenter', () => {
      if (!isPinned) {
        applyState('story', false);
      }
    });

    panelContact.addEventListener('mouseenter', () => {
      if (!isPinned) {
        applyState('contact', false);
      }
    });

    splitWrapper.addEventListener('mouseleave', () => {
      if (!isPinned) {
        applyState('idle', false);
      }
    });

    // Interações de Clique (Fixação, Desafixação e Transição Direta)
    function handlePanelClick(targetPanelName, event) {
      // Se clicou em um link ou botão de ação direta dentro do conteúdo, permite a navegação sem fechar
      if (event.target.closest('a[href], button:not([role="button"])')) {
        return;
      }

      if (isPinned) {
        if (currentState === targetPanelName) {
          // Clique no mesmo painel já fixado: fecha e desafixa
          applyState('idle', false);
        } else {
          // Clique no outro painel: transição direta mantendo o novo fixado
          applyState(targetPanelName, true);
        }
      } else {
        // Painel não estava fixado (estava em hover ou neutro): fixa o painel clicado
        applyState(targetPanelName, true);
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
      if (e.key === 'Escape' && isPinned) {
        applyState('idle', false);
      }
    });
  }
});
