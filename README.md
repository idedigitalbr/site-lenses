# Site LENSES

Site institucional estático publicado no GitHub Pages a partir de main.

**Links**
- https://idedigitalbr.github.io/site-lenses/
- https://idedigitalbr.github.io/site-lenses/sobre.html
- https://idedigitalbr.github.io/site-lenses/solucoes/audiovisual/
- https://idedigitalbr.github.io/site-lenses/solucoes/digital/
- https://idedigitalbr.github.io/site-lenses/casev2/bellamazon/
- https://idedigitalbr.github.io/site-lenses/design-system-preview.html

**Arquitetura**
- assets/tokens.css: valores canônicos da identidade.
- assets/base.css: reset, tipografia, utilitários, acessibilidade (WCAG skip-links).
- assets/components.css: navbar, componentes, layout da Home, rodapé e responsividade.
- assets/pages.css: página Sobre e componentes específicos.
- assets/styles.css: ponto de entrada com imports na ordem original.
- docs/DESIGN.md e docs/COMPONENTS.md: diretrizes normativas.
- scripts/check-design-system.mjs: verificação automática, Node.js 20+, sem dependências.

Rodar antes de publicar:

    npm run check

A página Sobre oficial é `sobre.html`, chamada apenas de **Sobre** no menu de navegação. Na infraestrutura Astro, a rota `/sobre2/` é mantida como espelho de compatibilidade para preservar links externos e legados sem quebra.

**Painel Sobre / Contato:** um único componente `assets/about-split.js`, renderizado em `index.html` (fechado) e `sobre.html` (aberto). Ambos usam a mesma foto, título, texto, métricas, CSS e ações.


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


## Soluções LENSES | Audiovisual & Digital (2026)

Páginas publicadas no HTML estático da branch main:

- **Audiovisual:** https://idedigitalbr.github.io/site-lenses/solucoes/audiovisual/
  - **Markup:** solucoes/audiovisual/index.html (reutiliza literalmente header e footer da marca)
  - **CSS scoped:** assets/solucao-audiovisual.css (identidade cinematográfica escura com tokens de marca)
  - **Animação acessível:** assets/solucao-audiovisual.js (IntersectionObserver com prefers-reduced-motion)
  - **Estrutura:** hero em vídeo, apresentação cinematográfica, 6 frentes audiovisuais, método em 4 etapas, portfólio e CTA.

- **Digital:** https://idedigitalbr.github.io/site-lenses/solucoes/digital/
  - **Markup:** solucoes/digital/index.html (reutiliza literalmente header e footer da Home)
  - **CSS scoped:** assets/solucao-digital.css (tokens de assets/tokens.css via assets/styles.css)
  - **Animação acessível:** assets/solucao-digital.js (IntersectionObserver com prefers-reduced-motion)
  - **Estrutura:** hero, apresentação, 6 soluções, processo com 4 etapas, painel conceitual sem métricas inventadas, portfólio e CTA.

- **Menu global:** assets/script.js injeta o submenu "Soluções > Audiovisual / Digital" no desktop e no mobile, mantendo acesso a "Todos os serviços". Estilos em assets/components.css.
- **QA:** scripts/check-design-system.mjs e astro-poc/scripts/verify-parity.mjs validam estrutura, âncoras, assets e navegação.
- **Arquitetura Astro Homologada (`astro-poc/`):** Astro 7 + Tailwind CSS v4 homologado e integrado na `main` com paridade visual de 100% (`0.000%` pixel diff) em todas as rotas (`Home`, `Sobre`, `Soluções > Audiovisual`, `Soluções > Digital` e `Bellamazon`), além das rotas de componentes compartilhados (`/lab/`, `/design-system/` e `/preview/`).

## Comandos Padronizados (Astro + QA)

Na raiz do projeto:

    npm run dev          # Inicia o servidor de desenvolvimento Astro
    npm run build        # Compila o projeto Astro e valida arquitetura + paridade byte-a-byte
    npm run preview      # Serve a build Astro em http://localhost:4321/
    npm run serve:static # Serve a raiz estática em http://localhost:3333/
    npm run check        # Executa todos os testes de Design System, Arquitetura e Paridade
    npm test             # Executa check completo + testes do pipeline de cases
    npm run test:cases   # Executa os testes do pipeline e handoff de novos cases
    npm run test:visual  # Executa regressão visual Playwright (Desktop + Mobile)

