# Site LENSES

Site institucional estático publicado no GitHub Pages a partir de main.

**Links**
- https://idedigitalbr.github.io/site-lenses/
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

A única página Sobre oficial é `sobre2/index.html`, acessível em `/sobre2/` e chamada apenas de **Sobre** no menu. As URLs antigas `sobre.html` e `sobre-nos.html` não têm mais conteúdo próprio: redirecionam para `/sobre2/`, preservando links externos. Os aliases `sobre2.html` e `Sobre2.html` também redirecionam.

**Painel Sobre / Contato:** um único componente `assets/about-split.js`, renderizado em `index.html` (fechado) e `sobre2/index.html` (aberto). Ambos usam a mesma foto, título, texto, métricas, CSS e ações.


## Cases reutilizáveis (out/2026)

O layout editorial Bellamazon é a referência aprovada para os próximos cases de clientes. A arquitetura foi separada para evitar páginas independentes e CSS duplicado:

- Template comum: templates/case-layout.html + assets/case-template-layout.css.
- Fonte de conteúdo de cada cliente: data/cases/SLUG.json e assets/cases/SLUG/.
- Gerador de HTML estático: scripts/build-case.mjs.
- Verificação: scripts/check-generated-cases.mjs.
- Geração via GitHub Actions: .github/workflows/build-cases.yml, se habilitada e com escrita autorizada.

Exemplo de preenchimento (fictício, não publicar): data/cases/_modelo.json.

**Manual completo para a equipe e agentes de IA:** docs/CASE-TEMPLATE.md.

Com Node 20+:

    node scripts/build-case.mjs data/cases/hydro.json
    node scripts/check-generated-cases.mjs

A página final é casev2/hydro/index.html, acessível pela rota /site-lenses/casev2/hydro/. Nunca reutilize KPIs de outro cliente ou exiba arquivos privados do Drive diretamente; trabalhe com mídia aprovada e otimizada.
