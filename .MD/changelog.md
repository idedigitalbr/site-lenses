# Changelog — LENSES

> Registro cronológico das atualizações do projeto (padrão Obsidian `.MD/`).

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
