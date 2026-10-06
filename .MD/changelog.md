# Changelog — LENSES

> Registro cronológico das atualizações do projeto (padrão Obsidian `.MD/`).

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
