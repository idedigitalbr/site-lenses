# Changelog — LENSES

> Registro cronológico das atualizações do projeto (padrão Obsidian `.MD/`).

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
