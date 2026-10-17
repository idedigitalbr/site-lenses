# LENSES | Migração controlada Astro 7 + Tailwind CSS 4

## Status e invariantes

Branch: experiment/astro-lenses-poc, derivada da main. Sem deploy, sem merge, sem edição na main.

Stack: Astro 7 estático, Tailwind CSS v4 pelo plugin @tailwindcss/vite, tokens da marca de assets/tokens.css, GSAP/ScrollTrigger legado preservado. NÃO instalar Swiper, Lenis nem React sem necessidade. Tailwind Preflight desativado durante fase de compatibilidade para evitar regressões visuais; compressHTML=false.

O requisito FINAL é: Home, Sobre, Bellamazon e futuros cases devem usar componentes Astro + Tailwind e manter aparência/animações aprovadas. Importar o HTML antigo para Astro não é, sozinho, uma migração completa; é a FASE P0 para manter o funcionamento enquanto fazemos refatoração segura.

## Estado implementado neste laboratório

P0 | Compatibilidade Astro:
- Rota / usa HTML original da Home via LegacyMirror.astro.
- Rota /casev2/bellamazon/ usa HTML original do case.
- Rota /sobre2/ usa conteúdo de sobre.html com ajuste de caminhos relativos.
- Alias /sobre.html e /design-system-preview.html permanecem idênticos ao original.
- Cases JSON já publicados são espelhados por rota dinâmica quando possuem HTML aprovado.
- /lab/ e /design-system/ demonstram componentes reais Astro e Tailwind. /preview/ mostra case fictício, identificado como tal.
- public/assets é sincronizada na build a partir de ../assets, sem duplicação versionada. CSS e JS antigos ficam idênticos, inclusive GSAP e mosaico.
- Tailwind lê exatamente os tokens CSS originais por @theme inline. O novo design system reutiliza StatCard, SectionHeading, ActionLink e ColorToken; não usa uma cópia separada de UI.

## Testes antes de alterar qualquer layout

No Antigravity, abrir o clone, selecionar experiment/astro-lenses-poc, depois:

    cd astro-poc
    npm install
    npm run check:architecture
    npm run dev
    npm run build
    npx playwright install chromium
    npm run test:visual

O build valida DOM/links/scripts das páginas originais e bytes de assets críticos. O teste Playwright compara screenshots em 1440px e 390px, inclusive Bellamazon em scroll. Tolerância inicial de 0,5% de pixels diferentes, mas investigar cada diferença e NÃO apenas aumentar limite. A comparação visual reduz animações para estabilidade; testes manuais de scroll/GSAP continuam obrigatórios.

Existe workflow CI na branch experimental, que somente testa e publica artifacts privados de build/diff, NUNCA faz deploy de produção.

Requisitos: Node 22 atualizado compatível com Astro 7, internet para npm, espaço em disco. Gerar e versionar package-lock.json após validação do ambiente. Não assumir que o build já passou até observar logs/resultados.

## Roadmap para migração final

P1 - NavBar e Footer: extrair componentes Astro compartilhados a partir da marcação exata, mantendo classes, atributos, links, menu e dimensões. Testar paridade depois de cada mudança. Unificar variantes quando for visualmente seguro.

P2 - Home: migrar uma seção por vez, usando Astro para markup e Tailwind tokens/utilities como camada dominante. Preservar fotografias, copy, tamanho de seções, GSAP e transições.

P3 - Sobre: migrar timeline, interseções/círculos, equipe, hover e imagens sem alterar animação ou mobile.

P4 - Bellamazon e futuros cases: componentes Astro para todas as seis seções, consumindo JSON do cliente e curadoria do pipeline Antigravity. Não reinventar dashboard nem mosaico sticky. Testar scroll reverso, vídeo/story 9:16 e imagens 16:9. Substituir o LegacyMirror apenas após screenshot e testes de interação equivalentes.

P5 - Design system VIVO: substituir o preview antigo somente após todos os componentes comuns serem realmente usados no site. Centralizar cores, fontes, espaçamento, motion, botões, cards, breakpoints, header/footer. O preview deve importar os mesmos componentes reais da aplicação, não copiar CSS.

P6 - Performance e SEO: otimizar imagens com Astro/Sharp gradualmente sem mudar crop, preservar URLs e canonical, headings, meta/OG, performance mobile, lazy-loading e acessibilidade. Vídeos grandes continuam passando por FFmpeg local.

P7 - Homologar e substituir: medir antes/depois, testes de browser e regressão visual por viewport, manter URLs antigas e GitHub Pages base /site-lenses. Mostrar preview completo e solicitar aprovação expressa. Só então planejar PR/merge, criar workflow de produção e poder remover a compatibilidade.

## Critérios de aceite

- Aparência visual igual em desktop/tablet/mobile, sem diferenças de composição, pesos de fonte, imagens ou animação.
- Hero, menu, mosaico, GSAP ScrollTrigger e dashboard funcionam com scroll para frente e para trás, além de reduced motion.
- Arquivos JS e CSS migrados sem regressão; dados e indicadores nunca trocados ou inventados.
- Cada token usado pelo Tailwind tem como fonte assets/tokens.css.
- Design system é a mesma implementação de componentes das páginas.
- Lighthouse, SEO e acessibilidade testados; nunca prometer nota 100 automaticamente.
- Sem JS extra desnecessário; sem dependências Lenis/Swiper.
- Nenhum merge ou push na main sem aprovação. O rollback é simplesmente manter a main atual.

## Prompt para o Antigravity continuar

Continue SOMENTE na branch experiment/astro-lenses-poc. Leia este documento. Primeiro confirme que Astro+Tailwind compila e que a compatibilidade P0 tem paridade. Corrija falhas de build e screenshot. Depois migre componentes de P1 a P7, um por vez, com screenshots antes/depois, mantendo design existente e GSAP. Sempre preserve tokens oficiais e não altere a produção.
