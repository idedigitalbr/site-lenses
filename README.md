# Site LENSES

Site institucional estático publicado no GitHub Pages a partir de main.

**Links**
- https://idedigitalbr.github.io/site-lenses/
- https://idedigitalbr.github.io/site-lenses/sobre.html
- https://idedigitalbr.github.io/site-lenses/sobre2/
- https://idedigitalbr.github.io/site-lenses/design-system-preview.html

**Arquitetura**
- assets/tokens.css: valores canônicos da identidade.
- assets/base.css: reset, tipografia, utilitários.
- assets/components.css: navbar, componentes, layout da Home, rodapé e responsividade.
- assets/pages.css: página Sobre e componentes específicos.
- assets/styles.css: ponto de entrada com imports na ordem original.
- docs/DESIGN.md e docs/COMPONENTS.md: diretrizes normativas.
- scripts/check-design-system.mjs: verificação automática, Node.js 20+, sem dependências.

Rodar antes de publicar:

    node scripts/check-design-system.mjs

As páginas sobre.html e sobre-nos.html devem ser idênticas. A variante principal é sobre2/index.html, acessível em /sobre2/. Os aliases sobre2.html e Sobre2.html apenas redirecionam.
