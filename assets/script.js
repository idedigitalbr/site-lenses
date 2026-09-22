document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-lnk');

  if (menuToggle && mobileNav) {
    const toggleMenu = () => {
      const isOpen = mobileNav.classList.toggle('active');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
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

  // 3. Autoplay Resiliente para o Vídeo de Background
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    heroVideo.muted = true;
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        heroVideo.muted = true;
        heroVideo.play().catch(() => {});
      });
    }

    // Tentar tocar novamente caso haja qualquer primeira interação do usuário
    const onFirstUserGesture = () => {
      if (heroVideo.paused) {
        heroVideo.muted = true;
        heroVideo.play().catch(() => {});
      }
      window.removeEventListener('click', onFirstUserGesture);
      window.removeEventListener('scroll', onFirstUserGesture);
    };
    window.addEventListener('click', onFirstUserGesture, { once: true });
    window.addEventListener('scroll', onFirstUserGesture, { once: true });
  }

  // 4. Scroll Suave para o Indicador de Scroll Circular
  const scrollDownBtn = document.getElementById('scrollDownBtn');
  const blueTicker = document.getElementById('blueTicker');
  if (scrollDownBtn && blueTicker) {
    scrollDownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      blueTicker.scrollIntoView({ behavior: 'smooth' });
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
});
