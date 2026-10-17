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
- Execução local pelo Antigravity em duas etapas: .agents/skills/organizar-novocase-lenses/SKILL.md e .agents/skills/postar-novocase-lenses/SKILL.md. Alias de postagem: /publicar-novocase-lenses.
- Pipeline local Drive / thumbnails / vídeo: scripts/case-media.mjs (rclone + FFmpeg).
- GitHub Actions: .github/workflows/build-cases.yml, apenas validação manual opcional.

Exemplo de preenchimento (fictício, não publicar): data/cases/_modelo.json.

**Manual completo para a equipe e agentes de IA:** docs/CASE-TEMPLATE.md.

Com Node 20+:

    node scripts/build-case.mjs data/cases/hydro.json
    node scripts/check-generated-cases.mjs

A página final é casev2/hydro/index.html, acessível pela rota /site-lenses/casev2/hydro/. Nunca reutilize KPIs de outro cliente ou exiba arquivos privados do Drive diretamente; trabalhe com mídia aprovada e otimizada.

### Ativar Antigravity

Abra o repositório no Antigravity e sincronize o main. Use **/organizar-novocase-lenses** e envie a pasta do Drive. A skill cria um pacote local privado em .lenses-work/SLUG/ com textos, inventário e mídias otimizadas, sem site ou commit. Depois use **/postar-novocase-lenses SLUG** (ou **/publicar-novocase-lenses SLUG**) para montar a página, revisar e publicar *somente após sua aprovação*. O arquivo de transição é .lenses-work/SLUG/handoff.json, que pode ser inspecionado com scripts/case-handoff.mjs. Os comandos oficiais são exclusivos do projeto LENSES e usam o sufixo -novocase-lenses. Primeira execução requer Node 20+, rclone OAuth e FFmpeg no PATH. Nenhum vídeo grande deve ir ao Git. Consulte docs/CASE-TEMPLATE.md.


## Soluções LENSES | Digital (out/2026)

Página publicada no HTML estático da branch main:

- **URL:** https://idedigitalbr.github.io/site-lenses/solucoes/digital/
- **Markup:** solucoes/digital/index.html (reutiliza literalmente header e footer da Home)
- **CSS scoped:** assets/solucao-digital.css (tokens de assets/tokens.css via assets/styles.css)
- **Animação acessível:** assets/solucao-digital.js (IntersectionObserver com prefers-reduced-motion)
- **Menu global:** assets/script.js injeta o submenu "Soluções > Digital" no desktop e no mobile, mantendo acesso a "Todos os serviços". Estilos em assets/components.css.
- **Estrutura:** hero, apresentação, 6 soluções, processo com 4 etapas, painel conceitual sem métricas inventadas, portfólio e CTA.
- **Mídia:** reutiliza imagens já versionadas em assets/ do projeto, sem copiar prints nem colocar dados fictícios de clientes.
- **QA:** scripts/check-design-system.mjs valida estrutura, âncoras, assets e navegação. Fazer revisão visual no navegador desktop/mobile depois do deploy.
- **Migração Astro:** permanece isolada em experiment/astro-lenses-poc. Trazer esta página para a arquitetura Astro posteriormente, com os mesmos critérios de paridade visual.
