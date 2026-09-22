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
});
