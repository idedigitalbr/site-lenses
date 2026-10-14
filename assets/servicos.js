/**
 * LENSES — Interações da Página de Serviços
 * Controla: Accordions acessíveis, Filtros por Frente Estratégica,
 * Expansão em massa e Gerador de Proposta personalizada via WhatsApp.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initServicesPage);

  function initServicesPage() {
    initAccordions();
    initFilterTabs();
    initMassToggle();
    initServiceQuoteButtons();
    initVideoPlayers();
  }

  /**
   * 1. ACCORDIONS ACESSÍVEIS (WAI-ARIA)
   */
  function initAccordions() {
    const triggers = document.querySelectorAll('[data-service-trigger]');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.service-accordion-item');
        if (!item) return;

        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));

        if (isExpanded) {
          collapseItem(item, trigger, panel);
        } else {
          expandItem(item, trigger, panel);
        }
      });

      // Suporte para teclas de navegação
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
    }
  }

  function collapseItem(item, trigger, panel) {
    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (panel) {
      panel.style.maxHeight = '0px';
      setTimeout(() => {
        if (!item.classList.contains('is-open')) {
          panel.setAttribute('hidden', '');
        }
      }, 300);
    }
  }

  /**
   * 2. TABS & FILTRO POR FRENTE ESTRATÉGICA
   */
  function initFilterTabs() {
    const filterButtons = document.querySelectorAll('[data-service-filter]');
    const pillars = document.querySelectorAll('.service-pillar-section');

    if (!filterButtons.length || !pillars.length) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-service-filter');

        // Atualizar estado ativo dos botões
        filterButtons.forEach(b => {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });

        // Filtrar visualização das seções
        if (filter === 'all') {
          pillars.forEach(p => {
            p.classList.remove('is-hidden');
            p.style.display = '';
          });
        } else {
          pillars.forEach(p => {
            const matches = p.getAttribute('data-pillar') === filter;
            p.classList.toggle('is-hidden', !matches);
            p.style.display = matches ? '' : 'none';
          });

          // Scroll suave até a frente selecionada se for específica
          const targetPillar = document.querySelector(`.service-pillar-section[data-pillar="${filter}"]`);
          if (targetPillar) {
            targetPillar.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  /**
   * 3. BOTÃO EXPANDIR / RECOLHER TODOS OS SERVIÇOS
   */
  function initMassToggle() {
    const toggleAllBtn = document.getElementById('toggleAllServices');
    if (!toggleAllBtn) return;

    let allExpanded = false;

    toggleAllBtn.addEventListener('click', () => {
      allExpanded = !allExpanded;
      const visibleItems = document.querySelectorAll('.service-pillar-section:not(.is-hidden) .service-accordion-item');

      visibleItems.forEach(item => {
        const trigger = item.querySelector('[data-service-trigger]');
        if (!trigger) return;
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));

        if (allExpanded) {
          expandItem(item, trigger, panel);
        } else {
          collapseItem(item, trigger, panel);
        }
      });

      const labelEl = toggleAllBtn.querySelector('.toggle-label');
      if (labelEl) {
        labelEl.textContent = allExpanded ? 'Recolher todos os detalhes' : 'Expandir todos os detalhes';
      }
      toggleAllBtn.classList.toggle('is-expanded', allExpanded);
    });
  }

  /**
   * 4. BOTÃO DINÂMICO PARA SOLICITAR PROPOSTA VIA WHATSAPP
   */
  function initServiceQuoteButtons() {
    const quoteButtons = document.querySelectorAll('[data-service-quote]');

    quoteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const serviceName = btn.getAttribute('data-service-quote') || 'Serviços LENSES';
        const pillarName = btn.getAttribute('data-pillar-name') || 'Comunicação e Audiovisual';
        const phone = '5591992000000';
        const text = encodeURIComponent(
          `Olá! Gostaria de conversar com a equipe da LENSES sobre o serviço de "${serviceName}" (Frente: ${pillarName}). Poderiam me apresentar uma proposta e disponibilidade?`
        );
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
      });
    });
  }

  /**
   * 5. PLAYER DE VÍDEO DOS CARDS DE AUDIOVISUAL
   */
  function initVideoPlayers() {
    const videoElements = document.querySelectorAll('.service-card-video');

    videoElements.forEach(video => {
      // Tentar autoplay com mudo garantido
      video.muted = true;
      video.play().catch(() => {
        // Fallback para toque / interação caso o navegador bloqueie
        const container = video.closest('.service-video-container');
        if (container) {
          container.addEventListener('mouseenter', () => video.play().catch(() => {}));
          container.addEventListener('click', () => {
            if (video.paused) video.play();
            else video.pause();
          });
        }
      });
    });
  }
})();
