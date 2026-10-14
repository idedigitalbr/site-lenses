# LENSES — Contratos de componentes

## Camadas
- tokens.css: fundamentos visuais canônicos.
- base.css: reset, tipografia, elementos globais.
- components.css: header, ticker, botões, Home, split, serviços, carrosséis, clientes, rodapé e responsividade.
- pages.css: componentes específicos de Sobre (.about-*) e de Serviços (.services-*, .service-pillar-*, .service-accordion-*).
- styles.css: apenas ponto de entrada, imports em ordem.

A divisão conserva todas as regras e a ordem de cascata originais.

## Elementos reutilizáveis
| Elemento | Seletores | Contratos |
| --- | --- | --- |
| Navbar | .site-header, .nav-actions, .nav-mobile-drawer | Menu em desktop/mobile e estado ativo |
| Botões | .btn, .btn-pill, .btn-gradient, .btn-top | Tokens, hover, teclado |
| Painel Sobre | #splitInteractive, #panelStory, #panelContact | JS e acessibilidade |
| Equipe | .about-team-section-clean, #teamModal | Modal e atributos da equipe |
| Carrossel | [data-carousel], .carousel-*, .pc-card, .duo-slide | Swipe, teclado e motion |
| Accordion Serviços | .service-accordion-item, [data-service-trigger], .service-accordion-panel | WAI-ARIA, teclado, expansão fluida |
| Filtro de Frentes | [data-service-filter], .services-filter-btn, .service-pillar-section | Tablist, estado ativo e scroll suave |
| Rodapé | .footer, .footer-grid, .footer-col | Cinco colunas responsivas |

## HTML estático
Header/footer estão padronizados e sincronizados nas páginas de produção: index.html, sobre2/index.html e servicos/index.html. sobre.html, sobre-nos.html e servicos.html redirecionam sem conteúdo próprio. O verificador automático compara navegação e rodapé para impedir divergências, sem injetar HTML por JavaScript em tempo de execução.

Menu padrão: Início, Sobre, Portfólio / Cases, Nossos Serviços e Contato (o CTA depende da página). Alterações devem ser sincronizadas na Home e na Sobre oficial.

Caminhos na raiz: assets/... e sobre2/. Caminhos da pasta sobre2/: ../assets/... e ../sobre2/. Não recriar as antigas páginas Sobre; manter somente redirecionamentos.

## Alteração segura
Preservar hooks de JS e ARIA, não modificar outras páginas ao editar uma variante, utilizar tokens e classes existentes, testar âncoras e botões e executar node scripts/check-design-system.mjs. Remoção de seção deve eliminar links quebrados e rever dependências de scripts.

## Componente compartilhado Sobre / Contato
O painel de Sobre e Contato vem de `assets/about-split.js` (fonte única de HTML e conteúdo). A Home insere `<section data-lenses-about-split data-initial-state="idle">` e `/sobre2/` usa `data-initial-state="story"`. Ambos recebem as mesmas classes `about2-reference-split`, estilo em `assets/pages.css` e interações em `assets/script.js`. O script do componente deve ser carregado antes de `assets/script.js`. Para editar fotografia, headline, manifesto, KPIs ou links, editar só `assets/about-split.js`. Não duplicar marcação nas páginas.
