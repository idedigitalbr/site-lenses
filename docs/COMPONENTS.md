# LENSES — Contratos de componentes

## Camadas
- tokens.css: fundamentos visuais canônicos.
- base.css: reset, tipografia, elementos globais.
- components.css: header, ticker, botões, Home, split, serviços, carrosséis, clientes, rodapé e responsividade.
- pages.css: componentes específicos de Sobre (.about-*).
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
| Rodapé | .footer, .footer-grid, .footer-col | Cinco colunas responsivas |

## HTML estático
Header/footer estão replicados em index.html, sobre.html, sobre-nos.html e sobre2/index.html. O verificador automático compara navegação e rodapé para impedir divergências, sem injetar HTML por JavaScript em tempo de execução.

Menu padrão: Início, Sobre, Sobre 2, Portfólio / Cases, Nossos Serviços e Contate-nos. Alterações devem ser sincronizadas nas quatro páginas.

Caminhos na raiz: assets/... e sobre2/. Caminhos da pasta sobre2/: ../assets/... e ../sobre2/. Evitar duplicar páginas apenas para URL legada.

## Alteração segura
Preservar hooks de JS e ARIA, não modificar outras páginas ao editar uma variante, utilizar tokens e classes existentes, testar âncoras e botões e executar node scripts/check-design-system.mjs. Remoção de seção deve eliminar links quebrados e rever dependências de scripts.
