# LENSES — Próximos Passos e Itens Interrompidos

> **Projeto:** site-lenses (landing page LENSES)
> **Última atualização:** 23/09/2026
> **Repositório:** https://github.com/idedigitalbr/site-lenses.git (branch `main`)

---

## 🟢 Itens Resolvidos nesta Retomada (23/09/2026)

| # | Item | Status | O que foi feito |
|---|------|--------|-----------------|
| 1 | **Pasta do Vídeo do Hero** | ✅ Resolvido | Renomeada de `assets/S1 TOPO HERO/` para `assets/hero/`, corrigido no HTML para evitar falhas de `%20`. |
| 2 | **Logo Outlined Órfã** | ✅ Resolvido | Inserida no Footer como imagem oficial com link suave para o topo (`assets/logos/lenses-outlined-logo.png`). |
| 3 | **URLs e Ações dos Cases (`PROJECTS`)** | ✅ Resolvido | Todos os 9 cases agora possuem links comerciais diretos via WhatsApp contextualizado por projeto com `target="_blank"`. |
| 4 | **Âncora `#projetos-todos`** | ✅ Resolvido | Integrado link interativo no título `ALGUNS PROJETOS` com chamada `TODOS OS CASES ↓` e efeito hover elétrico. |
| 5 | **QA de Altura do Split "Sobre a LENSES"** | ✅ Resolvido | Adicionada media query `@media (min-width: 1101px) and (max-height: 740px)` prevenindo compressão vertical em notebooks baixos (<= 740px). |
| 6 | **Contraste dos Cards sobre Fotos Claras** | ✅ Resolvido | Overlays dos carrosséis reforçados com gradiente linear escuro até 0.94 na base, garantindo legibilidade AAA. |

---

## 🔴 Itens Pendentes / Próximas Fases

| # | Item | Dependência / Bloqueio |
|---|------|------------------------|
| 1 | **SEO: `og:image` e `<link rel="canonical">`** | Aguardando **domínio definitivo** para preencher as URLs absolutas. |
| 2 | **Deploy VPS + Sincronização Notion (DB_IDE)** | Rodar quando as alterações visuais forem homologadas pelo cliente. |
| 3 | **Testes em dispositivo físico real (iOS Safari)** | Validação touch manual de swipe dos carrosséis e reprodução de vídeos nos cards de serviços. |
