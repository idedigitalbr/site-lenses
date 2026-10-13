# LENSES — Design System digital vigente

Atualizado em 13/10/2026. O manual oficial está em assets/imagens-diversas/documentos-pdf/LENSES_IDV25_MANUAL-DA-MARCA-ID-VISUAL.pdf.

## Ordem de autoridade
1. Manual institucional de identidade visual.
2. assets/tokens.css: única fonte para valores implementados.
3. Este documento e docs/COMPONENTS.md: regras de aplicação.
4. design-system-preview.html: catálogo de demonstração, sem cópia de tokens.
5. .MD/changelog.md: histórico, não norma vigente.

## Fundamentos
| Papel | Token | Valor |
| --- | --- | --- |
| Azul Espacial | --color-brand-space-blue | #202A44 |
| Azul Sabóia | --color-brand-saboia | #5C6CA4 |
| Branco anti-flash | --color-brand-antiflash | #EDECED |
| Branco puro | --color-brand-white | #FFFFFF |
| Fundo cinema | --bg-body | #050505 |
| Fonte oficial | --font-main, --font-heading, --font-nav | Inter |

Tipografia: Inter. Hierarquia editorial com variações de tamanho e peso; evitar negrito excessivo e uniforme. O estilo da marca é cinematográfico, editorial, sofisticado, com fotografia real e respiro. **Alternar intencionalmente superfícies claras, escuras e azuis da marca. Não criar um site 100% dark mode.** Não usar fontes, cores fluorescentes, degradês coloridos ou paleta não autorizados pelo manual.

## Tokens e arquivos
Editar valores somente em assets/tokens.css. Nunca duplicar seu bloco :root nas páginas ou no catálogo. O CSS de entrada assets/styles.css importa, na ordem: tokens.css, base.css, components.css, pages.css. A ordem atual preserva toda a cascata do projeto antes da refatoração.

Preferir variáveis semânticas para novos estilos. Hexadecimais neutros e overlays alpha legados podem ter intenção visual; não os substituir indiscriminadamente sem validar o resultado. Foram declarados os tokens anteriormente ausentes --radius-full, --bg-surface-elevated e --border-subtle.

## Componentes e experiência
Usar botões, menus, cartões e rodapé já existentes. Preservar IDs e data-attributes usados pelo JavaScript, estados ativos e atributos aria. Verificar links e âncoras. Desktop, tablet e mobile precisam ter navegação equivalente. Usar clamp() e breakpoints existentes (1100/1101, 1080, 860, 769/768, 480). Proibir overflow horizontal involuntário.

Assegurar contraste adequado: referência WCAG AA 4,5:1 para texto normal e 3:1 para UI. Rever legibilidade sobre imagem/vídeo, foco por teclado e prefers-reduced-motion. Dar preferência a fotografias e vídeos reais.

## Páginas
- sobre.html e sobre-nos.html: versão institucional original e alias idêntico.
- sobre2/index.html: variante editorial com novo hero institucional próprio "Onde estratégia encontra propósito", sem o antigo hero em vídeo, cards técnicos ou CTA final. Tokens e componentes compartilhados.
- sobre2.html e Sobre2.html: aliases redirecionados para /sobre2/.

## Fluxo
Antes de publicar: executar node scripts/check-design-system.mjs, revisar desktop/mobile e acessibilidade, validar links, consultar preview, conferir GitHub Pages e registrar a mudança em .MD/changelog.md. Testes estáticos não substituem revisão visual real.
