# LENSES — Próximos Passos e Itens Interrompidos

> **Projeto:** site-lenses (landing page LENSES)
> **Última atualização:** 22/09/2026
> **Repositório:** https://github.com/idedigitalbr/site-lenses.git (branch `main`)
> **Último commit desta sessão:** `aba283d` — feat: motor de carrossel de cases, split Sobre em tela cheia e cards editorial sobre foto

---

## 🔴 Itens INTERROMPIDOS (sessões paradas — retomar daqui)

Itens que começaram mas foram interrompidos porque o usuário precisou parar várias sessões.

| # | Item | O que já foi feito | O que faltou / parou |
|---|------|--------------------|----------------------|
| 1 | **Carrossel de projetos (01 Destaque / 02 Duplos)** | Motor 100% próprio em `assets/script.js` (sem dependências): 3 cópias de slides, autoplay com pausas (hover, foco, drag, fora da viewport, aba oculta, `prefers-reduced-motion`), swipe/pointer com captura, teclado (←/→), dots, `aria-hidden`/tabindex por slide, resize recalculado, sentidos opostos (destaque → / duplos ←) | Commit ficou pendente por ter sido interrompido — **commitado em `aba283d`**. Falta: testar em dispositivo real (iOS Safari) e validar autoplay em conex lenta |
| 2 | **Split interativo — painel "Sobre a LENSES" em tela cheia** | Novo grid `story-content-grid` (foto full-height à esquerda com legenda editorial + manifesto + assinatura + coluna de KPIs), cabeçalho vira ✕ de fechar no canto superior, adaptações tablet (2 colunas) e mobile (empilhado) | Redesign commitado em `aba283d`. Falta: **QA de alturas em telas baixas (≤700px de altura)** e conferir se o painel de Contato precisa do mesmo tratamento full-height |
| 3 | **Hover sincronizado do split (inversão branco ↔ azul)** | Os dois cards invertem juntos via `[data-state="idle"]:hover` no container, com filete inset, escala do indicador e opacidade 0.5 no card não sob o cursor | Commitado em `aba283d`. Falta: validar comportamento no estado `story`/`contact` expandido (hoje a inversão só existe em `idle`) |
| 4 | **Cards de informação dos cases (texto sobre a foto)** | Substituído o card branco por texto solto com borda-left azul + `text-shadow`, gradiente do overlay reforçado (0.78 no rodapé), hover desloca 6px na horizontal | Commitado em `aba283d`. Falta: **legibilidade em fotos claras** (testar cada imagem do carrossel) |
| 5 | **Logo outlined nova (`assets/logos/lenses-outlined-logo.png`)** | Arquivo criado/commitado no repositório | **Ainda não está referenciada em nenhum lugar do código** (`index.html`/`styles.css` sem match). Decidir uso: menu, footer ou favicon? |
| 6 | **URLs reais dos cases** | Estrutura de dados `PROJECTS.featured` e `PROJECTS.secondary` pronta, campo `url` existe em todos os itens | Todos com `url: ''` → os cards renderizam como `<div>`, sem clique. **Precisa receber as URLs reais** (ou a página de case correspondente) |
| 7 | **SEO: `og:image` e `<link rel="canonical">`** | Comentário `TODO` registrado em `index.html:17` | Aguardando **domínio definitivo** para preencher URLs absolutas — bloqueado até o cliente definir o domínio |
| 8 | **Deploy VPS + sincronização Notion (DB_IDE)** | Não executado nesta sessão (pedido era apenas commit/push no GitHub) | Rodar o pipeline completo de deploy quando o commit for aprovado |
| 9 | **ID `#projetos-todos` na seção de cases** | Adicionado ao `index.html` | Ainda não existe destino: falta decidir se vira âncora de menu, seção "ver todos os projetos" ou página interna |

---

## 🟡 Próximos passos (ordem sugerida)

1. **QA visual geral** — abrir o site local e revisar: hero, serviços, split (Sobre/Contato), carrossel destaque, carrossel duplo, prefooter, footer.
2. **Testar carrossel em dispositivo real** — iOS Safari (swipe + autoplay) e Android Chrome; conferir 1 slide vs. 2 slides no duplo (768px).
3. **Preencher as URLs dos cases** (`PROJECTS` em `assets/script.js`) — campo `url` de todos os 9 projetos.
4. **Definir uso da nova logo outlined** e referenciá-la no HTML/CSS (hoje o arquivo está órfão).
5. **Validar painel "Sobre" em telas baixas** (notebook 1366×768 e mobile landscape).
6. **QA de legibilidade** dos cards de info sobre fotos claras.
7. **Domínio definitivo** → preencher `og:image`, `canonical` e URLs absolutas (fecha o TODO de SEO).
8. **Deploy na VPS** (Docker/SSH) + conferir hash do commit na VPS.
9. **Sincronizar Obsidian `.MD/` e Notion `DB_IDE`** (changelog + status dos módulos).
10. **Mensagem para o cliente no WhatsApp** com o resumo da atualização.

---

## ✅ Concluído nesta sessão (22/09/2026)

- Revisão completa das alterações locais pendentes (3 arquivos modificados + 1 novo).
- Commit `aba283d` na `main`: motor de carrossel, split Sobre full-height, hover sincronizado, cards editorial e nova logo.
- Push para https://github.com/idedigitalbr/site-lenses.git.
- Criação desta pasta `.MD/` com memória do projeto (changelog + próximos passos/interruptos).
