/**
 * LENSES — Interações Orgânicas da Página de Serviços
 * Controla: Accordions editoriais fluidos, vídeos cinematográficos
 * e canal direto de atendimento via WhatsApp oficial.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initServicesPage);

  function initServicesPage() {
    initEditorialAccordions();
    initWhatsAppDirectLinks();
    initCinematicVideos();
  }

  /**
   * 1. ACCORDIONS FLUIDOS E EDITORIAIS (WAI-ARIA)
   */
  function initEditorialAccordions() {
    const triggers = document.querySelectorAll('[data-srv-trigger]');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.srv-item');
        if (!item) return;

        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));

        if (isExpanded) {
          collapseItem(item, trigger, panel);
        } else {
          expandItem(item, trigger, panel);
        }
      });

      // Suporte para teclas de acessibilidade (Espaço e Enter)
      trigger.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          trigger.click();
        }
      });
    });
  }

  function expandItem(item, trigger, panel) {
    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    if (panel) {
      panel.removeAttribute('hidden');
      panel.style.maxHeight = panel.scrollHeight + 'px';
      const onEnd = (e) => {
        if (e.target === panel && item.classList.contains('is-open')) {
          panel.style.maxHeight = 'none';
          panel.removeEventListener('transitionend', onEnd);
        }
      };
      panel.addEventListener('transitionend', onEnd);
    }
  }

  function collapseItem(item, trigger, panel) {
    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (panel) {
      if (panel.style.maxHeight === 'none') {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        void panel.offsetHeight;
      }
      panel.style.maxHeight = '0px';
      setTimeout(() => {
        if (!item.classList.contains('is-open')) {
          panel.setAttribute('hidden', '');
        }
      }, 400);
    }
  }

  /**
   * 2. LINKS DIRETOS PARA CONVERSA DE PROPOSTA NO WHATSAPP
   */
  function initWhatsAppDirectLinks() {
    const quoteButtons = document.querySelectorAll('[data-srv-quote]');

    quoteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceName = btn.getAttribute('data-srv-quote') || 'Serviços LENSES';
        const phone = '5591992000000';
        const text = encodeURIComponent(
          `Olá! Gostaria de conversar com a equipe da LENSES sobre "${serviceName}". Poderiam me apresentar mais detalhes e disponibilidade?`
        );
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
      });
    });
  }

  /**
   * 3. CONTROLE DE VÍDEOS CINEMATOGRÁFICOS EM LOOP
   */
  function initCinematicVideos() {
    const videos = document.querySelectorAll('.srv-video-element');

    videos.forEach(video => {
      video.muted = true;
      video.play().catch(() => {
        // Fallback para toque caso autoplay seja bloqueado
        video.parentElement?.addEventListener('click', () => {
          if (video.paused) video.play();
          else video.pause();
        });
      });
    });
  }
})();
