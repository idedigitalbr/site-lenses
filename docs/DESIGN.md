# LENSES — Design System digital vigente

Atualizado em 16/10/2026. O manual oficial está em assets/imagens-diversas/documentos-pdf/LENSES_IDV25_MANUAL-DA-MARCA-ID-VISUAL.pdf.

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

## Contrato tipográfico global (16/10/2026)

A família oficial permanece **Inter**. A fonte de verdade para tamanho, peso,
entrelinha e espaçamento dos títulos está em **`assets/tokens.css`**;
a aplicação final, sem alterar a identidade dos componentes, está em
**`assets/typography.css`** (importado por `assets/styles.css`).

| Papel | Token | Desktop >= 1200px | Tablet 769–1199px | Mobile <= 768px |
| --- | --- | --- | --- | --- |
| Headline H1/H2 de seção | `--type-heading-size` | **48px** (`--type-heading-desktop`) | `clamp(36px, 3.8vw, 44px)` | `clamp(30px, 7.6vw, 38px)` |
| Peso de headline | `--type-heading-weight` | 700 | 700 | 700 |
| Entrelinha | `--type-heading-line-height` | 1.12 | 1.12 | 1.12 |
| Tracking | `--type-heading-letter-spacing` | -0.055em | -0.055em | -0.055em |
| Corpo de apoio editorial | `--type-body-support` | 16px | 15px | 14px |
| Entrelinha do apoio | `--type-body-line-height` | 1.6 | 1.6 | 1.6 |
| Legenda de apoio | `--type-caption-support` | 14px | 14px | 13px |

**Como usar:** seções novas devem usar `font-size: var(--type-heading-size)`
junto dos tokens de peso/entrelinha/tracking. Evitar `font-size` específico
por seção e evitar criar outra raiz tipográfica. A camada tipográfica central
concilia overrides legados sem alterar imagem, cores, scroll ou movimento.

**Alcance:** Home, Sobre e Bellamazon V2. A página Sobre mantém a logo
gráfica LENSES dentro do H1 em seu tamanho de marca, sem distorcê-la.
Títulos H3 de cards, métricas, badges, botões, cabeçalho/rodapé e letras
decorativas não são headlines de seção e conservam escalas intencionais.
Ênfase interna com `strong` continua permitida.

**Regra específica Bellamazon:** a headline do vídeo, “Identidade, natureza
e oportunidades.”, usa o mesmo token de 48px e fica em **uma linha em telas
a partir de 1200px**; no tablet/mobile quebra naturalmente, sem overflow
horizontal. Textos secundários usam a escala de apoio.

**Ordem de CSS:** Home recebe `typography.css` pelo import em `styles.css`;
Sobre e Bellamazon carregam também a mesma camada depois de seus estilos
especializados/inline, para garantir que regras legadas não sobrescrevam
o contrato. Não duplicar valores 48px nos arquivos das seções.

## Tokens e arquivos
Editar valores somente em assets/tokens.css. Nunca duplicar seu bloco :root nas páginas ou no catálogo. O CSS de entrada assets/styles.css importa, na ordem: tokens.css, base.css, components.css, pages.css, typography.css. A ordem atual preserva toda a cascata do projeto antes da refatoração.

Preferir variáveis semânticas para novos estilos. Hexadecimais neutros e overlays alpha legados podem ter intenção visual; não os substituir indiscriminadamente sem validar o resultado. Foram declarados os tokens anteriormente ausentes --radius-full, --bg-surface-elevated e --border-subtle.

## Componentes e experiência
Usar botões, menus, cartões e rodapé já existentes. Preservar IDs e data-attributes usados pelo JavaScript, estados ativos e atributos aria. Verificar links e âncoras. Desktop, tablet e mobile precisam ter navegação equivalente. Usar clamp() e breakpoints existentes (1100/1101, 1080, 860, 769/768, 480). Proibir overflow horizontal involuntário.

Assegurar contraste adequado: referência WCAG AA 4,5:1 para texto normal e 3:1 para UI. Rever legibilidade sobre imagem/vídeo, foco por teclado e prefers-reduced-motion. Dar preferência a fotografias e vídeos reais.

## Páginas
- index.html: **página inicial (Home)** com hero vídeo, split LENSES/Contato, serviços, clientes e rodapé.
- sobre.html: **página Sobre oficial da LENSES**, com hero editorial, Fundamentos, Atuação Precisa e Interseção, tokens e componentes compartilhados.
- casev2/bellamazon/index.html: **case Bellamazon V2**, com vídeo, projeto, desafio, soluções, galeria e dashboard demonstrativo.

## Fluxo
Antes de publicar: executar node scripts/check-design-system.mjs, revisar desktop/mobile e acessibilidade, validar links, consultar preview, conferir GitHub Pages e registrar a mudança em .MD/changelog.md. Testes estáticos não substituem revisão visual real.
