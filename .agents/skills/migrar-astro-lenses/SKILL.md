---
name: migrar-astro-lenses
description: Continua migração experimental do site LENSES de HTML para Astro 7 e Tailwind 4, preservando fielmente o visual e as animações da main. Apenas branch de laboratório, validação estrutural e visual; sem Swiper, Lenis ou deploy de produção.
---

# /migrar-astro-lenses

Você é o engenheiro responsável pela migração de compatibilidade do projeto LENSES.

## Começo automático

1. Confirme que o workspace aberto é idedigitalbr/site-lenses.
2. Trabalhe somente em experiment/astro-lenses-poc. Nunca faça checkout para main com alterações pendentes nem comite diretamente em main.
3. Leia astro-poc/MIGRATION.md, astro-poc/AGENTS.md, docs/DESIGN.md, assets/tokens.css e o design-system-preview.html original.
4. Responda ao usuário com o estado atual, o risco e o próximo marco. Execute as ações locais sem esperar uma nova especificação de stack.

## Stack NÃO negociável

- Astro 7, Tailwind CSS 4 (@tailwindcss/vite), HTML estático, Node 22 atualizado.
- Tokens de cor e tipografia oficiais LENSES de assets/tokens.css.
- GSAP e ScrollTrigger mantidos com o comportamento original.
- Sem Swiper, sem Lenis, sem reinventar a identidade ou mudar os efeitos.
- Não usar componentes paralelos na vitrine de design system: sempre importar os componentes reais compartilhados com o site.

## Ordem de trabalho

FASE 0: dentro de astro-poc executar npm install, npm run build, npm run test:visual e abrir as páginas em navegador desktop/mobile. Resolver build errors, logs, links, CSS e diferenças. Não considerar versão pronta até que tudo passe. Se a conexão à internet impedir npm, registrar erro preciso e preservar a branch.

FASE 1: extrair navbar e footer atuais para componentes Astro reais, mantendo marcação visual e comportamento idênticos; após cada alteração comparar screenshots e menus.

FASE 2: converter Home para seções Astro reutilizáveis com Tailwind, uma por vez, sem alterar copy, assets ou GSAP. Executar testes após cada seção.

FASE 3: converter Sobre da mesma forma, preservando efeitos e mobile.

FASE 4: converter Bellamazon em layout Case Astro e componentes compartilhados, usando dados JSON verificados. Garantir mosaico, dashboards e animações iguais. Integrar as skills organizar-novocase-lenses e postar-novocase-lenses sem quebrar a organização pré-existente.

FASE 5: garantir que o design-system preview real renderize cada componente da aplicação, sem CSS duplicado. Avaliar page weight, imagens, acessibilidade, SEO e Core Web Vitals. Criar novas otimizações somente com baseline comparável.

FASE 6: consolidar testes automatizados, screenshots de regressão, package-lock e documentação. Abrir PR para revisão, mas NÃO fazer merge ou configurar deploy da main sem autorização explícita.

## Forma de trabalho

- Preserve o layout antes de refatorar. Compare pixels e DOM em 1440px e 390px, tablets e scroll normal/reverso.
- Mudanças de GSAP/DOM, head/meta, CSS reset e URLs são de alto risco. Registre diferenças; não aumente tolerância dos testes para ocultar falhas.
- LegacyMirror é uma ponte de compatibilidade, NÃO representa migração final; remova gradualmente conforme cada seção for homologada.
- A branch experimental não publica. Nenhum push de conteúdo do Drive ou vídeo original.
- Ao final de cada etapa, informar: arquivos alterados, riscos, resultado real do build, screenshots, o que resta e URL de branch/commit.
