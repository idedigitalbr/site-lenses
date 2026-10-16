## 2026-10-16 — feat(typography): contrato tipográfico global de 48px

- **Design system:** tokens canônicos em `assets/tokens.css` (`--type-heading-desktop:48px`, `--type-heading-size`, weight/line-height/letter-spacing, apoio/legendas) e breakpoints tablet/mobile.
- **Aplicação:** nova camada compartilhada `assets/typography.css`, importada por `assets/styles.css` e carregada após estilos específicos nas páginas `sobre.html` e `casev2/bellamazon/index.html`; estilos base `h1/h2` agora consomem tokens.
- **Páginas cobertas:** Home, Sobre e Bellamazon V2. Logo editorial como imagem, H3 de cards e demais destaques deliberados preservados.
- **Bellamazon:** título “Identidade, natureza e oportunidades.” sem `<br>` manual, em linha única no desktop (>= 1200px) e quebra responsiva no mobile. Textos de apoio ajustados.
- **Documentação:** `docs/DESIGN.md` com tabela de padrões e exceções. Contrato central, sem mexer em cores, mídias, conteúdo editorial, animações ou estrutura.
- **Verificação:** conferência estática das importações, dos seletores ativos, da hierarquia e do CI de Design System; conferir também em navegador desktop/tablet/mobile após o deploy.

---

## 2026-10-14 — fix(brand): aplicacao oficial da logo vetorial vertical LENSES na Home e no diagrama Sobre

- **Diagrama de Convergencia (Sobre — `#como-conectamos`):**
  - Substituido o texto generico `<text class="lcs-core-letter">` pelo SVG vetorial oficial inlinado (`<svg class="lcs-core-logo">`) com os 6 caminhos curvos da marca (`L-E-N` / `S-E-S`) extraidos diretamente de `assets/imagens-diversas/logos/logo-lenses-vertical.svg`.
  - Dimensao e proporcao calibradas (`width="56" height="47"`, centralizado em `x="402" y="343.5"`) com preenchimento branco puro (`#ffffff`) e sem dependencia de requisicoes externas para evitar atrasos ou bloqueios de CORS/cache.
  - Atualizado cache buster em `sobre.html` (`assets/lenses-convergence.css?v=8`).
- **Marca d'agua de Clientes (Home — `#clientes`):**
  - Aplicacao dos mesmos 6 caminhos vetoriais da logo oficial no container `.clients-watermark`, renderizado em tom sobre tom escuro (`rgba(32, 42, 68, 0.22)` resultando em `#4F5E8F` sobre `#5C6CA4`, 100% identico ao Anexo 1).
  - Atualizado versionamento de CSS (`v=20261014-vertical-logo`) em `assets/styles.css` e `index.html`.
- **Validacao de QA e integridade:**
  - 100% validado pelo script oficial (`node scripts/check-design-system.mjs`).

---

## 2026-10-14 — refactor(clients): alinhamento fiel à referência visual oficial (marca d'água centralizada, tipografia editorial calibrada e equalização harmônica das marcas)

- **Marca d'água LENSES perfeitamente centralizada e sutil:**
  - Reposicionado o SVG oficial vertical da LENSES (`LEN / SES`) para o interior de `.clients-showcase`, centralizado com precisão matemática (`top: 50%; left: 50%; transform: translate(-50%, -50%);`) exatamente atrás do bloco de marcas parceiras.
  - Dimensão ampliada para cobrir harmoniosamente toda a extensão do grid (`clamp(380px, 50vw, 680px)`).
  - Tonalidade suavizada para tom sobre tom sutil (`rgba(22, 32, 58, 0.15)`), criando o autêntico efeito de marca d'água institucional sem competir com a legibilidade das marcas de clientes.
- **Formatação editorial à esquerda fiel à referência gráfica:**
  - Quebras de linha rigorosas (`<br>`) aplicadas tanto no título principal quanto no parágrafo descritivo.
  - Peso tipográfico da primeira metade do headline calibrado para `bold` (`font-weight: 700`, eliminando o antigo extra-bold 800) em *"Grandes empresas<br>confiam na nossa<br>atuação estratégica"*.
  - Segunda metade em `light` (`font-weight: 300`) com *"em ambientes<br>complexos e de alta<br>responsabilidade."*.
  - Parágrafo descritivo distribuído com 4 quebras exatas e entrelinha refinada.
- **Calibração óptica harmoniosa das 13 marcas:**
  - Equalização equilibrada entre marcas verticais/empilhadas (Hydro, ALBRAS, Ativo, Fontaim) e marcas horizontais (Rochamar vetorial SVG, EuroChem, Hidrovias do Brasil, NewFortress, Mitsubishi Power, Gás do Pará, Unitapajós, Solar Coca-Cola, Consag).
  - Remoção das barras antigas de metadados (`PORTFÓLIO` / `LENSES` / `2026`).
  - Sincronização 100% idêntica entre [index.html](file:///d:/.GITHUB/site-lenses/index.html) e [design-system-preview.html](file:///d:/.GITHUB/site-lenses/design-system-preview.html).
- **Validação de QA e integridade:**
  - 100% validado pelo script oficial (`node scripts/check-design-system.mjs`).

---

## 2026-10-14 — chore(sobre): arquivamento preventivo da seção Nossa Equipe em backup dedicado

- **Criação de backup seguro:** extraída a seção completa `Nossa Equipe` (grid de 4 cards com fotos de estúdio, dados dos profissionais e pílulas de ação) junto com o modal interativo `teamModal` e salva em arquivo independente [secao-nossa-equipe.html](file:///d:/.GITHUB/site-lenses/backups/secao-nossa-equipe.html) com instruções detalhadas para restauração imediata quando necessário.
- **Remoção da página pública:** removida a `<section class="about-team-section-clean" id="equipe">` e a `<div class="team-modal" id="teamModal">` de [sobre.html](file:///d:/.GITHUB/site-lenses/sobre.html), preservando os estilos CSS e lógica JS intactos.
- **Atualização de QA:** ajustado [scripts/check-design-system.mjs](file:///d:/.GITHUB/site-lenses/scripts/check-design-system.mjs) para refletir a nova estrutura da página Sobre sem interrupção de validação no CI/CD.
- 100% validado pelo script de integridade (`node scripts/check-design-system.mjs`).

---

## 2026-10-14 — fix(sobre): restauração da fotografia panorâmica de fundo do hero institucional

- **Restauração da imagem do hero:** restaurada a fotografia panorâmica de alta resolução em WebP (`assets/paginas/sobre/hero-topo-sobre.webp` e espelhada em `assets/paginas/sobre2/hero-topo-sobre2.webp` para compatibilidade retroativa).
- **Correção de caminho e cache buster:** atualizado `assets/pages.css` para apontar diretamente para `paginas/sobre/hero-topo-sobre.webp`, e incrementado o versionamento de cache em `assets/styles.css` e `sobre.html` (`v=20261014-hero-restaurado`), eliminando o fundo azul liso e reestabelecendo a atmosfera visual do topo.
- 100% validado pelo script de integridade (`node scripts/check-design-system.mjs`).

---

## 2026-10-14 — style(clients): escala compacta, discreta e padronizada das 13 marcas e remoção de metadados

- **Atualização da logo Rochamar:** aplicação do novo ativo oficial vetorial SVG em alta precisão (`assets/imagens-diversas/logos-clientes/rochamar_logo_vetorial.svg`), substituindo o PNG bitmap anterior tanto na Home (`index.html`) quanto no catálogo do Design System (`design-system-preview.html`).
- **Remoção de elementos redundantes:** eliminadas as barras superior (`PORTFÓLIO` / `LENSES`) e inferior (`2026`) da seção de clientes na Home e no catálogo do Design System, proporcionando um layout mais limpo, fluido e focado exclusivamente no conteúdo editorial e nas marcas parceiras.
- **Redução de escala compacta e refinada:**
  - Redução proporcional de ~40% na escala global das logos para um padrão discreto, elegante e corporativo.
  - Alturas máximas calibradas entre `11px` e `20px` para marcas horizontais (Rochamar, EuroChem, Hidrovias, NewFortress, Mitsubishi, Solar, Consag, Unitapajós, Gás do Pará) e entre `30px` e `40px` para marcas empilhadas/verticais (Hydro, Albras, Ativo, Fontaim).
  - Altura do container de cada logo reduzida para `clamp(42px, 4.8vw, 60px)`, proporcionando ampla respiração e leveza estética.
  - Opacidade de repouso suavizada para `0.88` para integração harmoniosa com a superfície Azul Sabóia.
- **Invalidação imediata de cache:** adicionado parâmetro de versão `?v=20261014-compact` no import de `assets/styles.css` e no link em `index.html`.
- 100% validado pelo script de integridade (`node scripts/check-design-system.mjs`).

---

## 2026-10-14 — refactor(estrutura): unificação profissional da página Sobre na raiz e eliminação de pastas redundantes

- **Unificação da página Sobre na raiz:** promovido o conteúdo canônico da página Sobre diretamente para `sobre.html` (43 KB) na raiz do repositório, ao lado de `index.html`.
- **Eliminação de stubs e pastas duplicadas:** removidos em definitivo os arquivos de atalho obsoletos (`sobre-nos.html`, `sobre2.html`, `Sobre2.html`), a pasta `sobre2/` e a pasta órfã `assets/paginas/sobre2/`.
- **Rotas e links profissionais:** menus desktop e mobile de `index.html` e `cases/bda-premio-brasileiro-de-design/index.html` atualizados para apontar diretamente para `sobre.html` (e `../../sobre.html`), funcionando de forma transparente e imediata tanto offline via duplo clique no Windows Explorer (`file:///`) quanto em ambiente web.
- **Preview e testes sincronizados:** catálogo do Design System (`design-system-preview.html`), documentações (`docs/COMPONENTS.md`, `docs/DESIGN.md`) e script de integridade (`scripts/check-design-system.mjs`) atualizados para validar o contrato oficial de `index.html` e `sobre.html`.
- **Servidor local inteligente:** `scripts/serve.mjs` aprimorado para suportar clean URLs (resolvendo `/sobre` diretamente para `sobre.html`).
- 100% validado pelo script de QA oficial do repositório (`node scripts/check-design-system.mjs`).

---

## 2026-10-14 — feat(brand): aplicação da logo LENSES vertical oficial no Sobre e na Home

- **Logo oficial LENSES vertical:** padronizado e vetorizado o ativo oficial `assets/imagens-diversas/logos/logo-lenses-vertical.svg` com os 6 glifos originais da marca (`L-E-N` / `S-E-S`), tipografia exclusiva (diagonal estilizada do `N`, curvas do `S`) e suporte nativo a `currentColor`.
- **Diagrama "Como Conectamos" (Sobre / Anexo 2):** substituído o texto cru em fonte genérica pelo logotipo vertical oficial em branco puro (`#f8f7f8`) perfeitamente centralizado no núcleo de convergência (`sobre2/index.html`), mantendo dimensões harmônicas (56×47px) e margem de respiro dentro do círculo pontilhado interno.
- **Marca d'água da Seção de Clientes (Home / Anexo 1):** substituído o texto em CSS font-family pelo SVG da logo vertical oficial atrás do grid de clientes (`index.html` e `design-system-preview.html`), aplicando a cor escura institucional tom sobre tom (`--tone-saboia-watermark` / `rgba(32, 42, 68, 0.22)`) sobre o fundo Azul Sabóia (`#5C6CA4`).
- **Ajustes de responsividade e estilo:** adicionadas regras em `assets/components.css` e `assets/lenses-convergence.css` para dimensionamento fluido (`clamp`) e preservação do alinhamento óptico em desktop, tablet e mobile.
- 100% validado pelo script de QA oficial (`node scripts/check-design-system.mjs`).

---

## 2026-10-14 — fix(offline): suporte a navegação local offline (file:///) e resolução de páginas de 1 KB

- **Resolução de stubs de 1 KB:** os arquivos de redirecionamento histórico (`sobre.html`, `sobre-nos.html`, `sobre2.html`, `case-bda.html`, `cases/bda/index.html` e `project/bda-premio-brasileiro-de-design/index.html`) foram atualizados para apontar explicitamente para o arquivo canônico com `/index.html` no final.
- **Eliminação da tela de diretório no Chrome:** ao abrir offline no Windows (duplo clique no arquivo via `file:///`), o navegador Chrome não mais exibe a tela de listagem de diretório (*"Índice de D:\..."*), abrindo imediatamente a página oficial completa de 43 KB em `sobre2/index.html`.
- **Compatibilidade dinâmica em navegação:** injetado handler em `assets/script.js` que detecta o protocolo `file:` e resolve links relativos terminados em `/` para `/index.html`, permitindo transição sem falhas entre Home, Sobre e Cases em ambiente 100% desconectado.
- 100% validado pelo script de QA oficial do repositório (`node scripts/check-design-system.mjs`).

---

## 2026-10-14 — fix(home): otimização de performance e resposta imediata de hover no diagrama "Como Conectamos"

- **Eliminação de latência no hover:** removidos os atrasos forçados (`transition-delay: 220ms` e `150ms`) na troca de cor da tipografia dos pilares (*Propósito*, *Consistência*, *Resultado*).
- **Aceleração da expansão do disco:** reduzida a transição de preenchimento (`.lcs-reveal-solid` e `.lcs-reveal-disc`) de 850ms/1150ms para 320ms snappy com curva suave `cubic-bezier(.16, 1, .3, 1)`.
- **Contraste nítido e remoção de artefato embaçado:** retirado o `text-shadow` branco difuso do estado em repouso (`rgba(255,255,255,.48)`) que causava borrão ao expandir o fundo azul, aplicando agora transição direta e limpa para branco puro (`#ffffff`) com sombra de precisão sutil.
- **Sincronização imediata:** traço indicador e microgeometrias com transição instantânea sincronizada no hover e foco de teclado.
- 100% validado pelo script de QA do Design System (`node scripts/check-design-system.mjs`).

---

## 2026-10-14 — fix(logos): atualização da logo da ALBRAS com ativo oficial em alta definição

- Atualizada a logo da **ALBRAS** para a versão oficial em alta resolução (`assets/imagens-diversas/logos-clientes/albras-seeklogo.png` e espelhada em `albras.png`), com resolução de 2000×1073px e canal alfa transparente.
- Atualizadas as referências na Home (`index.html`), na página de Serviços (`servicos/index.html`) e no catálogo do Design System (`design-system-preview.html`).
- Validação completa de integridade executada via `node scripts/check-design-system.mjs`.

---

## 2026-10-14 — feat(home): nova seção editorial de Portfólio / Clientes em Azul Sabóia

- Implementada a nova seção de Portfólio / Clientes antes do rodapé na Home (`index.html`), seguindo rigorosamente a referência editorial do slide da LENSES com o Azul Sabóia (`--color-brand-saboia` / `#5C6CA4`) como superfície protagonista.
- **Marca d'água monumental tom sobre tom:** `LEN / SES` em tipografia Inter bold no fundo com contraste institucional (`--tone-saboia-watermark`).
- **Metadados editoriais nos cantos:** tags `PORTFÓLIO` (superior esquerda), `LENSES` (superior direita) e `2026` (inferior esquerda).
- **Composição em Split Editorial:**
  - Coluna esquerda: manchete com peso diferenciado (*"Grandes empresas confiam na nossa atuação estratégica em ambientes complexos e de alta responsabilidade"*) e texto de apoio institucional.
  - Coluna direita: grid de 13 marcas oficiais monocromáticas em branco puro em 4 linhas (Hydro, ALBRAS, Hidrovias do Brasil | Gás do Pará, Ativo Construções, Fontaim Serviços, Unitapajós | Rochamar, EuroChem, Solar Coca-Cola | NewFortress Energy, Mitsubishi Power, Consag Engenharia).
- **Ativos locais de alta resolução:** extração e tratamento dos 3 novos logos ausentes (`fontaim-servicos.png`, `rochamar.png`, `solar-coca-cola.png`) padronizados com altura canônica de 180px e transparência com canal alfa.
- **Responsividade & Acessibilidade:** adaptação suave para tablet e mobile (grid de 2 colunas legíveis em telas menores), suporte a `prefers-reduced-motion` e 100% aprovado no script de testes `scripts/check-design-system.mjs`.

---

## 2026-10-14 — refactor(servicos): redesign editorial orgânico com protagonismo do Azul Sabóia


- Refatoração completa da página de Serviços (`servicos/index.html` e `assets/pages.css`) eliminando o aspecto de "AI slop" (caixas duras, checklists robóticos e dashboards repetitivos) em favor de um layout editorial fluido, humano e natural, idêntico ao padrão da Home e da página Sobre Nós.
- **Azul Sabóia (`#5C6CA4`) como protagonista absoluto da identidade visual:** aplicação dominante em títulos, radiais luminosos, marca d'água institucional `LENSES / TERRITÓRIO`, nós da linha do tempo, tags e superfície inteira da Frente de ESG & Território.
- **Estrutura editorial em Split Assimétrico para as 4 frentes:** coluna esquerda contextual com número monumental, manifesto da frente e mídia real de campo em proporção cinematográfica; coluna direita fluida com linhas divisórias finas e accordions editoriais de expansão orgânica.
- Textos humanizados e narrativos para cada um dos 16 serviços, focando no propósito, no método e no resultado real, sem tabelas genéricas de bullet points.
- Metodologia LENSES em 4 fases conectadas por linha contínua com nós animados em Azul Sabóia (`.srv-method__track`), grade minimalista dos 12 clientes e grande manifesto final de conversão.
- Totalmente validado pelo script automatizado de integridade `scripts/check-design-system.mjs`.

---

## 2026-10-14 — refactor(cases): redesign editorial do case BDA espelhado 1:1 na identidade da Sobre 2 e protagonismo Azul Sabóia

- Redesign completo da página de case BDA – Prêmio Brasileiro de Design (`cases/bda-premio-brasileiro-de-design/index.html` e `assets/pages.css`), eliminando qualquer aspecto de "AI slop" e espelhando com fidelidade absoluta a linguagem visual, orgânica, arquitetural e natural de `https://idedigitalbr.github.io/site-lenses/sobre2/`.
- **Azul Sabóia (`#5C6CA4` / `--color-brand-saboia`) como protagonista absoluto da página:**
  - Aplicação como cor mestra em todos os títulos, destaques, linhas divisórias, nós de progresso, cantoneiras arquiteturais, botões e na superfície total do banner de conversão.
- **Hero Arquitetural & Topográfico (`.case-hero`):**
  - Incorporação das curvas topográficas territoriais (`ellipse 73% 61%`) e radiais luminosos em Azul Sabóia.
  - Hierarquia de display tipográfico em Inter com peso refinado (`font-weight: 350` no subtítulo com keywords em Sabóia bold).
  - Régua arquitetural de especificação técnica (Abedesign, 2025, Identidade Visual & Motion, Colaborar & Transformar) com divisores translúcidos.
  - Vitrine cenográfica do palco de LED com moldura nobre e cantoneiras de precisão.
  - **Assinatura territorial idêntica ao "Raiz & Futuro" da Sobre 2:** ampersand `&` monumental em Azul Sabóia, tipografia empilhada "Colaborar & Transformar" e descritivo conceitual.
- **Ato 01 — O Projeto (`.lf-section`):**
  - Reutilização direta dos componentes de fundações de `assets/lenses-foundations.css` com cantoneiras de anéis concêntricos (`.lf-corner`), trilho dinâmico com nós pulsantes em Azul Sabóia (`.lf-track`), citação editorial com filete vertical Sabóia e 3 KPIs de impacto.
- **Ato 02 — O Desafio (`.case-act-space-saboia`):**
  - Canvas profundo em Azul Espacial e Azul Sabóia com pílulas de fluxo metodológico da imersão (Nuvem Semântica &rarr; Mapeamento de Biomas &rarr; Metáfora dos Pássaros) e instalação flutuante da bandeira têxtil.
- **Ato 03 — A Solução (`.case-act-cinema-solution`):**
  - Superfície clara de catálogo com cantoneiras sutis, narrativa da tipografia Plau com geometria dos pássaros e exibição monumental do cartaz oficial do BDA 2025 com tag de chancela.
- **Ato 04 — Resultados & Artefatos (`.case-act-monograph`):**
  - Padrão idêntico à seção Nossa Equipe da Sobre 2 (`.about-team-section-clean`): cabeçalho elegante com filete Sabóia (`.team-rule-clean`), 4 cards com cantos arredondados de 24px, base escura em Azul Espacial profundo, badge em Azul Sabóia e pílula interativa "Explorar Peça" com seta diagonal.
- **CTA Final & Rodapé Canônico:**
  - Banner manifesto em gradiente e aura profunda de Azul Sabóia com botão pílula em branco puro e rodapé oficial de 5 colunas com GIF de fundo.
- **Validação Automatizada:**
  - 100% de conformidade validada pelo script `node scripts/check-design-system.mjs`.

---

## 2026-10-14 — feat(cases): criação da página de case BDA – Prêmio Brasileiro de Design

- Criada a nova página de case study em `cases/bda-premio-brasileiro-de-design/index.html`, adaptando a estrutura e narrativa de referência (`libra.ag/project/bda-premio-brasileiro-de-design/`) à identidade visual e design system canônico da LENSES.
- Alternância intencional de superfícies conforme diretrizes do manual: Cinema Dark (#050505), Editorial Claro Anti-Flash (#EDECED), Azul Espacial (#202A44) e Off-White (#FFFFFF).
- Estruturação em 4 atos narrativos: O Projeto (Contexto & Propósito), O Desafio (Estratégia & Fórum Criativo), A Solução (Pássaros Migratórios & Tipografia Plau) e Os Resultados (Troféus, Medalhas e Entregáveis).
- Download e armazenamento local de todas as imagens em alta resolução em `assets/paginas/cases/bda/` (screen LED, flag, poster, caixa kit, troféu, medalha, grafismos).
- Componentes e utilitários de case study adicionados a `assets/pages.css` (`.case-*`), reutilizando 100% dos tokens institucionais e mantendo compatibilidade com `scripts/check-design-system.mjs`.
- Inclusão do case no carrossel de destaques da Home em `assets/script.js` (`PROJECTS.featured`).
- Criadas rotas e aliases amigáveis: `cases/bda/`, `project/bda-premio-brasileiro-de-design/` e `case-bda.html`.

---

## 2026-10-13 — Componente Sobre unificado

- Transformados os painéis Sobre / Contato da Home e da Sobre em um único componente renderizado por `assets/about-split.js`.
- A Home começa fechada (`idle`), a Sobre começa aberta (`story`). Somente essa configuração varia.
- Visual, texto, foto e indicadores da Sobre passam a valer também para a Home; sem CTA extra.
- Estilos e comportamento compartilhados, X como controle de fechamento e verificação automática contra duplicação.

---
## 2026-10-13 — Página Sobre oficial única

- /sobre2/ passa a ser a única página Sobre oficial, exibida apenas como "Sobre" na navegação desktop e mobile.
- A antiga /sobre.html e /sobre-nos.html deixaram de conter a página duplicada e agora redirecionam para /sobre2/, evitando erros em links históricos.
- Links da Home, CTA interno de história, documentação, prévia e verificador de design atualizados para a rota canônica.
- Nenhuma alteração no visual ou conteúdo da página Sobre oficial.

---

# Changelog — LENSES

> Registro cronológico das atualizações do projeto (padrão Obsidian `.MD/`).


## 2026-10-13 — fix(sobre2): imagem otimizada no hero editorial

- Adicionada a fotografia panorâmica criada para o topo da página em `assets/paginas/sobre2/hero-topo-sobre2.webp` (WebP, 1916×821).
- Fundo da seção `about2-origin-hero` passa a apontar para o arquivo local de alta qualidade, preservando overlay, textos e responsividade.

---

## 2026-10-13 — feat(sobre2): hero editorial Raiz & Futuro

- Adicionada a primeira seção da variante `/sobre2/`, seguindo a referência "Onde estratégia encontra propósito".
- Tipografia Inter, composição editorial com grid, azul institucional, texturas topográficas, chamada Nossa história e mensagem territorial.
- Reutilizado asset amazônico existente e incluídas regras responsivas e de redução de movimento em `assets/pages.css`.
- Nenhuma alteração em `sobre.html` ou `sobre-nos.html`.

---

## 2026-10-13 — refactor: design system modular e governança

- Tokens consolidados em assets/tokens.css e correção de 3 variáveis CSS ausentes.
- CSS de produção separado em base.css, components.css e pages.css sem reordenar regras.
- Preview sincronizado com tokens.css, incluindo documentação da variante Sobre 2.
- Sobre2.html atualizado para redirecionar à versão canônica /sobre2/.
- Criados README, docs/DESIGN.md, docs/COMPONENTS.md e QA automatizado por GitHub Actions.
- Sem mudanças editoriais ou de layout nas páginas originais.

---

## 2026-10-07 — feat(sobre-nos): aprimoramento cinematográfico completo da página institucional Sobre Nós

### Alterações
- **Hero Cinematográfico Imersivo (`#topo`):**
  - Implementado overlay editorial sobre o vídeo showreel com badge de kicker (*"PRODUTORA CINEMATOGRÁFICA & AUDIOVISUAL DE IMPACTO"*), tipografia monumental em `clamp()`, degradê de texto suave e botões de ação com navegação suave (*"CONHECER NOSSA HISTÓRIA"* e *"FALAR COM A DIREÇÃO"*).
- **Ativação dos Contadores Dinâmicos de KPIs (`#sobre`):**
  - Conectados os atributos `data-target` nos elementos `.counter-val` (+150 projetos, +80 marcas, +8 anos, 100% conformidade), ativando a animação com interpolação `easeOutExpo` do `IntersectionObserver` já presente em `assets/script.js`.
- **Cabeçalho Institucional de Missão, Visão e Valores (`#pilares`):**
  - Adicionado `.about-section-header` com kicker estilizado, título em caixa alta com divisor visual (`about-section-rule`) e subtítulo de apoio.
- **Nova Seção: Infraestrutura Técnica & Diferenciais Cinema (`#diferenciais`):**
  - Seção inédita em fundo grafite escuro (`var(--color-bg-dark)`) com 4 cards técnicos de diferenciais da LENSES:
    1. *Câmeras de Cinema 8K & Ópticas Prime* (sensores full frame RED e ARRI);
    2. *Certificação ISO 9001:2015* (gestão de qualidade, compliance e segurança);
    3. *Operação Aérea & FPV Homologada* (pilotos certificados ANAC/DECEA);
    4. *Pós-Produção & Color Grading DaVinci Resolve Studio* (calibração DCI-P3/Rec.709).
- **Modal Interativo de Biografia da Equipe (`#teamModal`):**
  - Inserido modal acessível (`dialog` com backdrop blur, fechamento por `Esc`, clique fora ou botão `X`) conectado aos 4 líderes criativos da LENSES:
    - Lucas Silveira (Diretor Geral & Fundador)
    - Mariana Castro (Diretora de Fotografia)
    - Camila Vasconcelos (Diretora de Produção)
    - Rodrigo Albuquerque (Head de Estratégia e Roteiro)
  - Cards enriquecidos com badge interativo *"Conhecer Trajetória"* e transições de elevação no hover.
- **Correção Visual no CTA Final (`#cta-final`):**
  - Substituído o GIF repetido (`prefooter-stage.gif`) pela imagem de estúdio em alta resolução `contact-bg.png`, mantendo contraste e acabamento premium.
- **Paridade Rigorosa Multi-Páginas:**
  - Conteúdo sincronizado com hash SHA256 idêntico entre `sobre.html` e `sobre-nos.html`.

---

## 2026-10-06 — fix(cta-split): aplicação do azul oficial da marca (Azul Sabóia) no título e seta de SOBRE A LENSES

### Alterações
- **Identidade e Contraste no Split Interativo:**
  - Corrigido o título `<h2 class="h2 split-heading">SOBRE A LENSES</h2>` e o indicador de ação (`.panel-indicator svg`) no estado padrão para o azul oficial da LENSES (`var(--color-electric-blue)` / `#5C6CA4` - Azul Sabóia).
  - Mantida a simetria perfeita do sistema visual do Split:
    - **Painel Sobre a Lenses:** Fundo Branco + Título e Seta em Azul Sabóia.
    - **Painel Contato:** Fundo Azul Espacial/Sabóia + Título e Seta em Branco Puro.
    - **No Hover:** Inversão cromática dinâmica e sincronizada entre ambos os painéis.

---

## 2026-10-06 — style(clients): calibração de peso visual e alinhamento óptico uniforme de altura para as 12 logos

### Alterações
- **Equalização de Altura Óptica:**
  - Padronização da altura visual entre 40px e 44px para todas as 12 marcas no grid de clientes.
  - Correção de disparidades: logos quadradas/verticais (Hydro e Ativo) que estavam com 60px foram calibradas, e marcas horizontais longas (EuroChem, MoveInfra, Hidrovias) que ficavam comprimidas em 27px-33px ganharam espaço e peso visual equivalente.
  - Normalização dos assets em canvas transparente de alta densidade (3x retina).
  - Atualização no `assets/styles.css` com altura fixa e responsiva para desktop, tablet e mobile.

---

## 2026-10-06 — refactor(assets): reestruturação arquitetural completa das pastas de mídia por página e seções

### Alterações
- **Arquitetura de Diretórios de Ativos (`assets/`):**
  - **`assets/imagens-diversas/`**:
    - `logos/`: Identidade da LENSES (topo, rodapé e favicons).
    - `logos-clientes/`: 12 marcas de clientes em PNG transparente + subpasta `_originais_/`.
    - `documentos-pdf/`: Manual de Identidade Visual e Portfólio oficial.
    - `legado/`: Mídias e mockups arquivados de seções descontinuadas.
  - **`assets/paginas/`**:
    - `home/`:
      - `s1-topo-hero/`: Vídeo showreel cinematográfico.
      - `s2-sobre/`: Imagem de textura de fundo.
      - `s3-servicos/`: Vídeos, posters e fotografias dos 6 serviços.
      - `s4-cases-destaque/`: Fotografia do Festival do Futuro.
      - `s5-cases-duo/`: Cards simultâneos da Amazônia e Histórias.
      - `s6-certificacao/`: Imagem oficial da Certificação ISO 9001.
      - `s7-footer/`: GIF cinematográfico de palco.
    - `sobre/`:
      - `s2-missao-visao-valores/`: 3 cards institucionais de cinema.
      - `s3-equipe/`: 4 retratos de estúdio em alta definição.
- **Sincronização Total de Código:**
  - Atualizadas todas as referências em `index.html`, `sobre.html`, `sobre-nos.html`, `design-system-preview.html` e `assets/script.js`.

---

## 2026-10-05 — feat(clients): integração dos 12 logos oficiais de clientes LENSES e remoção do acervo legado Zion

### Alterações
- **Substituição Oficial de Logos de Clientes:**
  - Removido o acervo legado de marcas da Zion (`assets/logos-zion/`).
  - Integrado o acervo com os 12 clientes oficiais da LENSES em `assets/logos-clientes-lenses/`:
    - Albras, Ativo Construções, Consag Engenharia, EuroChem, Gás do Pará, Hidrovias do Brasil, Hydro, Mitsubishi Power, MoveInfra, New Fortress Energy, Ultracargo e Unitapajós.
  - Processamento e otimização visual de alta definição: conversão para PNG transparente, eliminação de margens brancas e compatibilidade total com Retina.
  - Atualização da seção `#clientes` na Home (`index.html`), Design System (`design-system-preview.html`) e regras de layout CSS (`assets/styles.css`).

---

## 2026-10-05 — fix(hero): atualização do vídeo de fundo hero para nova versão Dia da Amazônia

### Alterações
- **Vídeo do Topo (Hero Cinematográfico):**
  - Substituição da mídia por `assets/hero/290926-dia-da-amazonia-lenses-v2.mp4` em todas as instâncias:
    - Home (`index.html`)
    - Sobre (`sobre.html` e `sobre-nos.html`)
    - Design System Oficial (`design-system-preview.html`)

---

## 2026-10-02 — refactor(design-system): atualização completa do Design System Oficial e eliminação de seções obsoletas

### Alterações
- **Eliminação de Seções Obsoletas e Descontinuadas:**
  - Removido o antigo Rail Marquee de marcas sob o hero (`#rail-marcas`), que havia sido descontinuado do fluxo do site.
  - Removido o bloco estático legado "Destaque Festival do Futuro", substituído pela documentação do motor de carrossel de cases.
  - Removidos os blocos estáticos antigos "Duo Cards", substituídos pelo Carrossel Duo dinâmico de projetos.
  - Removida a antiga seção "Publicações — Revista Eletrônica & Informes Trimestrais" (`#cards-editorial`), descontinuada do site ativo.
  - Removido o antigo banner duplicado de contato "Vamos criar algo incrível juntos" (`assets/contact-bg.png`).
  - Unificada a "Cena do Rodapé" e o "Rodapé" em uma única seção oficial de Rodapé Cinematográfico.
- **Incorporação das Novas Seções Oficiais da One Page (Home):**
  - **S4 · Carrossel Destaque de Cases:** Documentação visual do slide destacado com overlay, `.pc-card`, navegação, dots e ancoragem cruzada com `ALGUNS PROJETOS`.
  - **S5 · Carrossel Duo de Projetos:** Amostra com 2 slides simultâneos (`PROJECTS.secondary`), cards com metadados e efeito hover zoom.
  - **S6 · Certificação ISO 9001 (`#certificacao`):** Bloco institucional completo com card visual (`assets/iso9001-card.jpg`), 4 pilares/features operacionais de qualidade e botão CTA circular com fio azul.
  - **S7 · Clientes & Parceiros ("Com quem já trabalhamos" `#clientes`):** Grid oficial com 18 logos de clientes Zion, repouso monocromático e iluminação ao hover.
  - **S8 · Rodapé Cinematográfico Unificado (`#footer`):** Layout oficial de 5 colunas com GIF de fundo de palco (`assets/prefooter-stage.gif`), logotipo grande outlined (541×575) e barra tripartite com a IDE Digital.
- **Incorporação das Seções Oficiais da Página Sobre (`sobre.html`):**
  - **P1 · Hero Showreel Clean:** Hero cinemático puro em 100vh com vídeo e controles discretos.
  - **P2 · Missão, Visão e Valores (`#sobre-mvv`):** 3 cards lado a lado com fotografias de cinema e filtro escuro que acende para opacidade 0% no hover.
  - **P3 · Nossa Equipe (`#sobre-equipe`):** Grid editorial sobre fundo branco com 4 retratos de estúdio em alta definição e base escura.
  - **P4 · CTA Final Cinematográfico (`#sobre-cta`):** Encerramento de impacto com vídeo/GIF de palco e marca d'água monumental translúcida "LENSES".
- **Atualização das Diretrizes (Do's & Don'ts):**
  - Atualizadas as regras normativas: proibição expressa de reintroduzir seções mortas (rail marquee, revista/informes, banner duplicado); inclusão da governança para ISO 9001, logos de clientes Zion e carrosséis.
- **Sincronização da Navegação e Filtro de Busca:**
  - Sidebar e busca JS atualizadas com 100% dos links e âncoras válidos e funcionais.

---

## 2026-09-29 — refactor(footer): ampliação do logotipo, eliminação de vão e barra inferior padrão IDE Digital

### Alterações
- **Eliminação do Vão e Ampliação do Logotipo (Coluna 1):**
  - Coluna 1 redefinida para `max-content` no grid, ajustando a divisória vertical perfeitamente colada ao padding do logotipo sem vãos excessivos.
  - Dimensão do logotipo ampliada para `clamp(210px, 17.5vw, 270px)` com `aspect-ratio: 541 / 575`, preenchendo o espaço de forma sólida e cinematográfica em todas as resoluções.
  - Coluna 2 (Manifesto) estreitada proporcionalmente (`minmax(0, 1.05fr)`), garantindo equilíbrio estético e hierarquia visual refinada.
- **Barra Inferior Padrão Agência (3 Eixos):**
  - Estrutura em CSS Grid tripartite (`grid-template-columns: 1fr auto 1fr`):
    - Esquerda: `Copyright © 2026 Lenses – All rights reserved`.
    - Centro: `Termos & Privacidade` (centralizado no grid da página).
    - Direita: `Desenvolvido por:` acompanhado do logotipo oficial branco mono da **IDE Digital** (`assets/logos/logo-idedigital-white.webp`) com link direto para `https://digital.ideinstituto.com.br/`.
  - Tratamento responsivo para dispositivos móveis (`≤768px` e `375px`) empilhando os itens com alinhamento centralizado e espaçamento fluído.
- **Sincronização 100% Homogênea em Todas as Páginas:**
  - Código do rodapé e da barra inferior unificado em `index.html`, `sobre.html`, `sobre-nos.html` e `design-system-preview.html`.
  - Atualização correspondente na tabela de especificações técnicas do Design System.

---

## 2026-09-29 — feat: incorporação de Gradientes Oficiais e Técnica de Tom Sobre Tom (Tone-on-Tone)

### Alterações
- **Gradientes Oficiais Institucionais Integrados:**
  - Incorporação do gradiente linear oficial canônico conectando **Azul Espacial (`#202A44`)** a **Azul Sabóia (`#5C6CA4`)**, conforme comprovado na barra de cores primárias do Manual da Marca (pág. 13 / Anexo 1).
  - Tokens criados: `--gradient-brand-primary` (linear 90°), `--gradient-brand-angle` (linear 135°), `--gradient-brand-reverse`, `--gradient-brand-radial`, `--gradient-brand-surface` e `--gradient-brand-card`.
  - Aplicação na **Faixa Superior do Header (`#topTicker` / `.top-blue-ticker`)**, criando uma transição fluida do Azul Espacial à esquerda para o Azul Sabóia à direita que sangra em 100vw.
  - Criação da classe `.btn-gradient` e atualização do `.btn-cta-large` com gradiente angular institucional e elevação suave.
- **Técnica de Tom Sobre Tom (Tone-on-Tone — Anexos 2 e 3):**
  - Reprodução fiel das pranchas do Manual da Marca onde o wordmark monumental **LENSES** vaza em marca d'água translúcida com opacidade sutil (`rgba(32,42,68,0.22)` sobre Azul Sabóia e `rgba(92,108,164,0.24)` sobre Azul Espacial).
  - Classes utilitárias criadas: `.tone-on-tone-saboia`, `.tone-on-tone-space`, `.brand-watermark`, `.brand-watermark-center`.
  - Aplicação no **Painel de Contato do Split (`#panelContact` / `.split-panel-contact`)** em `index.html`, `sobre.html` e `sobre-nos.html`, tornando o painel idêntico à prancha do Anexo 2 ("Áreas de segurança").
  - Aplicação na seção de **CTA Final (`#cta-final` / `.about-cta-section`)** com marca d'água monumental centralizada translúcida.
- **Design System Preview (`design-system-preview.html`) Ampliado:**
  - Novo item de navegação lateral: *01 Fundamentos → Degradês & Tom Sobre Tom*.
  - Nova seção visual completa (`#degrades`) exibindo:
    1. A barra de gradiente primário horizontal 90° com dados de Pantone, RGB, CMYK e HEX com botão de cópia de token.
    2. Dois palcos vivos de Tom Sobre Tom simulando fielmente os Anexos 2 e 3 do Manual da Marca.
    3. Grid de swatches de tokens funcionais de gradiente.
    4. Amostra ao vivo de botões com degradê (`.btn-gradient`) e badges.
  - Atualização dos Do's & Don'ts com regras estritas: permitidos apenas degradês entre Azul Espacial e Azul Sabóia; proibidos gradientes arco-íris, cores secundárias ou azuis fluorescentes.
  - Bloco de tokens CSS `:root` sincronizado com os novos tokens.

---

## 2026-09-29 — fix: alinhamento 100% full-width da seção Sobre e fidelidade visual aos Anexos 1, 2 e 3

### Alterações
- **Seção Sobre a Lenses (Anexo 1) 100% Full-Width:** Removido o container restritivo (`.about-container`) e adotada diretamente a estrutura master `.section-cta-split` e `.split-interactive-wrapper[data-state="story"]`, fazendo a seção ocupar toda a largura do viewport (0 a 100vw). O ajuste é perfeitamente fluído mesmo em zoom de 50%, 75%, 100%, 200% ou telas ultrawide: a fotografia editorial sangra na margem esquerda absoluta, o manifesto com assinatura fica centralizado no bloco branco com botão de fechar (✕) no topo direito, os KPIs (+150, +80, +8) permanecem alinhados com o divisor vertical e a aba azul `CONTATO ▷` fica ancorada no extremo direito.
- **Interatividade Bidirecional Preservada:** Inicialização dinâmica do estado do split no JavaScript (`assets/script.js`) a partir do atributo `data-state` do wrapper, permitindo alternar suavemente entre a visualização de história e de contato ao clicar.
- **Missão, Visão e Valores (Anexo 2) com Efeito Iluminação Real:**
  - 3 cards dispostos lado a lado (`grid-template-columns: repeat(3, 1fr)`) com cantos arredondados de 26px e contorno fino.
  - Filtro escuro em repouso (`rgba(4,4,7,0.88)`). No hover, a opacidade do filtro escuro vai estritamente para **0%** e o desfoque zera, enquanto a vinheta inferior é atenuada, fazendo o fundo fotográfico de cinema "acender" de forma vívida e reluzente.
  - Tipografia em `DM Serif Display` com ícones lineares brancos (alvo, olho e estrela) e sombras de texto calibradas para legibilidade impecável mesmo com a imagem acesa.
- **Nossa Equipe (Anexo 3) Editorial sobre Fundo Branco:** Seção com fundo claro (`#ffffff`), kicker `LENSES` em ouro suave, título `Nossa Equipe` em serif com filete centralizado, e grid de 4 cards verticais com cantos arredondados (28px), retratos de estúdio no topo e base escura uniforme (`#141310`) exibindo nome em serif branca e especialidade em tipografia limpa.
- **Hero Limpo 100% Vídeo:** Hero cinemático puro em 100vh sem qualquer texto sobreposto, com controles discretos de áudio e tela cheia no canto inferior direito e seta de scroll centralizada na base.
- **Sincronização Total:** Arquivos `sobre.html` e `sobre-nos.html` perfeitamente idênticos (mesmo hash SHA-256).

---

## 2026-09-29 — refactor: novo rodapé compacto de 5 colunas e remoção dos eixos laterais

### Alterações
- **Layout de 5 Colunas Alinhadas:** Unificação do logotipo empilhado oficial na Coluna 1 da grade, trazendo Manifesto Editorial (Coluna 2), Contato (Coluna 3), Acompanhe (Coluna 4) e CTA (Coluna 5) para uma mesma linha contínua.
- **Ampliação Extraordinária da Logo (Coluna 1):** Proporção da coluna da logo expandida para `1.55fr` e dimensão da imagem ampliada para `clamp(145px, 13vw, 215px)`, preenchendo harmonicamente o vão lateral antes do primeiro divisor vertical.
- **Estreitamento Refinado do Manifesto (Coluna 2):** Largura da coluna 2 reduzida para `1.35fr` e `max-width` do texto travado em `25ch`, gerando um bloco textual verticalizado, compacto e em perfeita harmonia de altura com o logotipo.
- **Ajuste de Altura e Proporção Cinematográfica:** Definida altura equilibrada (~360px a 1024px / ~480px a 1440px) com o conteúdo ancorado na base e o topo reservado para ampla visibilidade da cena e dos performers no palco.
- **Breakpoint de Quebra Ajustado:** Redefinido o breakpoint para `<= 860px`, garantindo que todas as 5 colunas permaneçam perfeitamente em linha única contínua em resoluções de 1024px e laptops, sem quebrar linhas precocemente.
- **Remoção de Elementos:** Removido o bloco textual inferior direito (*Audiovisual / Conteúdo / Estratégia / Impacto*) e apagada a repetição do logo textual (*LENSES —*) ao lado do copyright, mantendo apenas a menção legal `© 2026 Lenses. Todos os direitos reservados.`.
- **Divisores Verticais:** Inserção de linhas divisórias sutis de 1px entre cada uma das 5 colunas com espaçamento simétrico.
- **Sincronização Total em Todas as Páginas:** Padronização rigorosa do header e footer 5 colunas idênticos em `index.html`, `sobre.html`, `sobre-nos.html` e `design-system-preview.html`.

---

## 2026-09-29 — feat: nova página Sobre Nós oficial da LENSES (`sobre.html`)

### Alterações
- **Nova Página `sobre.html` (e alias `sobre-nos.html`):** Criada página institucional completa, alinhada à identidade visual da Lenses e inspirada no ritmo, hierarquia e respiro editorial da referência (Leggacy).
- **1. Hero Cinematográfico:** Abertura com vídeo background nativo (`assets/hero/TOPO-VIDEO-AMAZONIA.mp4`), overlay profundo com gradiente, headline curta e imponente (*"DAR FORMA ÀS HISTÓRIAS QUE MERECEM PERMANECER"*), tipografia expandida, tags de universo criativo e controles discretos de som e tela cheia.
- **2. Seção Sobre a Lenses:** Preservado e aprofundado o manifesto da Home, lado esquerdo com fotografia grande da equipe e do estúdio (`assets/about-back.png`), badge `LENSES` e legenda editorial; lado direito com kicker azul, título display, assinatura e tags de posicionamento.
- **3. Números e Destaques Consolidados:** Grid de 4 indicadores reais da marca (+150 projetos, +80 marcas atendidas, +8 anos de experiência, 100% processos certificados ISO 9001) com contador dinâmico animado via JavaScript (Counter Up com easing).
- **4. Missão, Visão e Valores (Construção Editorial Alternada):** Três blocos ritmados com alternância Imagem + Texto / Texto + Imagem:
  - *01 / Missão:* foco na potência das histórias e verdade humana com imagem de produção cinematográfica.
  - *02 / Visão:* referência de cinema e inovação da Amazônia para o mundo com imagem de grande escala/festival.
  - *03 / Valores:* 5 pilares estruturais (Excelência em Cada Detalhe, Respeito à Essência, Processos & Previsibilidade ISO 9001, Compromisso com Impacto & ESG, Criatividade Viva em Movimento) com card visual de processos.
- **5. Nossa Equipe:** Grid editorial com 4 retratos de estúdio em alta definição gerados sob encomenda com estética de set cinematográfico (`assets/equipe/`): Lucas Silveira (Diretor Geral & Fundador), Mariana Castro (Diretora de Fotografia), Camila Vasconcelos (Diretora de Produção & Pós) e Rodrigo Albuquerque (Head de Estratégia & Roteiro), com microinterações no hover e modal interativo com biografia completa ao clique.
- **6. CTA Final:** Encerramento cinematográfico de impacto com fundo em movimento (`assets/prefooter-stage.gif`), headline marcante (*"TRANSFORMAR IDEIAS EM IMAGEM, HISTÓRIAS OU EXPERIÊNCIAS AUDIOVISUAIS"*) e botão de contato direto via WhatsApp.
- **7. Header & Footer Oficiais:** Integração com o header master dinâmico com ticker azul, link ativo no menu para Sobre, e footer com o GIF oficial de palco e logo outlined.
- **8. Interconexão na Home (`index.html`):** Atualizados links de navegação para `sobre.html` e adicionado botão de acesso no painel split institucional.

---

## 2026-09-25 — refactor: remoção da seção rail marquee de marcas sob o hero

### Alterações
- **Remoção do Rail Marquee (`#marcas`):** Eliminada a faixa preta horizontal intermediária com logos vetoriais repetidos logo abaixo do vídeo hero.
- **Redirecionamento do Scroll do Hero (`#scrollDownBtn`):** Atualizada a âncora e o gatilho JS da seta de rolagem do Hero diretamente para a seção Sobre (`#sobre`).

---

## 2026-09-23 — refactor: remoção de texto vazado, seção de publicações e banner de contato

### Alterações
- **Remoção de Texto Vazado:** Eliminado comentário HTML mal formatado que exibia nota interna de rodapé na tela.
- **Remoção da Seção Publicações (`#revista` / `#informes`):** Removidos cards da Revista Eletrônica e Informes Trimestrais.
- **Remoção do Banner CTA Contato (`#contato`):** Eliminado banner duplicado "Vamos criar algo incrível juntos?".
- **Preservação de Âncora `#contato`:** Atribuído `id="contato"` diretamente ao novo Footer Cinematográfico, mantendo navegação e atalhos de contato plenamente funcionais.

---

## 2026-09-23 — feat: nova seção ISO 9001, grid de clientes oficiais e novo footer cinematográfico

### Alterações
- **Certificação ISO 9001 (`#certificacao`):** Novo bloco institucional com card visual (`assets/iso9001-card.jpg`), 4 pilares/features operacionais de qualidade e assinatura de marca com fio azul.
- **Seção Clientes / "Com quem já trabalhamos" (`#clientes`):** Grid responsivo com 18 logos oficiais importados (`assets/logos-zion/`), efeito monocromático de repouso e ativação cromática vibrante ao hover.
- **Novo Footer Cinematográfico:** Unificação do rodapé com fundo em GIF de cena de palco (`assets/prefooter-stage.gif`), overlay com leitura em alto contraste, logo outlined oficial, grid de 4 colunas (Manifesto, Contato, Acompanhe e CTA) e barra de eixos da marca.
- **Tipografia:** Inclusão e pareamento da fonte Google Fonts `Inter Tight` com `Plus Jakarta Sans`.
- **Design System Preview:** Atualização do `design-system-preview.html` com o novo footer e tabela de especificações técnicas.
- **Governança:** Inclusão de `*.bak*` no `.gitignore` e higienização de arquivos temporários.

### Status
- Obsidian `.MD/`: ✅ atualizado
- Notion `DB_IDE`: ⏳ pendente confirmação de deploy
- Deploy VPS: ⏳ aguardando confirmação do usuário

---

## 2026-09-23 — Retomada Antigravity · fix: resolução de pendências do OpenCode, logo outlined e refinamento visual


### Alterações
- **Pasta do Vídeo Hero:** Renomeada de `assets/S1 TOPO HERO/` para `assets/hero/`, corrigido caminho no `index.html` para eliminar risco de falhas com `%20`.
- **Logo Outlined Oficial:** Inserida no rodapé (`footer`) substituindo texto simples por `assets/logos/lenses-outlined-logo.png` com transições suaves e link para o topo.
- **Ações dos 9 Cases nos Carrosséis:** Ativação dos links com chamadas inteligentes contextuais de WhatsApp para cada um dos 9 projetos com `target="_blank"` seguro.
- **Navegação `#projetos-todos`:** Título `ALGUNS PROJETOS` transformado em link interativo para o carrossel duplo com micro-interação no hover e texto `TODOS OS CASES ↓`.
- **QA de Altura do Split "Sobre":** Adicionada regra `@media (min-width: 1101px) and (max-height: 740px)` para prevenir aperto vertical em notebooks compactos.
- **Contraste de Legibilidade:** Reforçados os gradientes lineares inferiores em `.featured-slide-overlay` e `.duo-slide-overlay` para garantir leitura nítida sobre qualquer imagem.
- **Publicações Simétricas:** Adicionado rodapé com botão de solicitação e descrição nos Informes Trimestrais e WhatsApp direto na Revista Eletrônica.

### Status
- Obsidian `.MD/`: ✅ atualizado
- Notion `DB_IDE`: ⏳ aguardando homologação
- Deploy VPS: ⏳ aguardando homologação

---

## 2026-09-22 — Commit `aba283d` · feat: motor de carrossel de cases, split Sobre em tela cheia e cards editorial sobre foto

**Push:** https://github.com/idedigitalbr/site-lenses.git (`main`)

### Alterações
- **Carrossel de projetos (Destaque + Duplos):** novo motor próprio em `assets/script.js` (+410 linhas), sem dependências externas. Autoplay com pausas (hover, foco, drag, fora da viewport, aba oculta, reduced-motion), swipe/pointer, teclado, dots acessíveis, `aria-hidden`/tabindex sincronizados por slide, recálculo no resize e sentidos opostos (destaque → / duplos ←).
- **Split interativo — painel "Sobre a LENSES":** layout em tela cheia com foto full-height à esquerda (tag + legenda editorial), kicker/título/manifesto/assinatura ao centro e coluna de KPIs à direita; cabeçalho resume ao ✕ de fechar; grid redesenhado para tablet e mobile.
- **Hover sincronizado do split:** os dois painéis invertem juntos (branco ↔ azul) via container `[data-state="idle"]:hover`, com filete inset, escala do indicador e atenuação do card não sob o cursor.
- **Cards de info dos cases:** substituído o card branco por texto sobre a foto (borda-left azul, `text-shadow`), overlay com gradiente mais forte no rodapé e hover horizontal de 6px.
- **`index.html`:** nova estrutura do "Sobre a LENSES" (título, legenda, assinatura) e `id="projetos-todos"` na seção de cases.
- **Novo asset:** `assets/logos/lenses-outlined-logo.png` (ainda não referenciada no código).

### Status
- Obsidian `.MD/`: ✅ criado (changelog + `PROXIMOS-PASSOS-E-INTERRUPTOS.md`)
- Notion `DB_IDE`: ⏳ pendente
- Deploy VPS: ⏳ pendente
