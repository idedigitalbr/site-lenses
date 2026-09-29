# LENSES — Próximos Passos e Itens Interrompidos

> **Projeto:** site-lenses (landing page e institucional LENSES)
> **Última atualização:** 29/09/2026
> **Repositório:** https://github.com/idedigitalbr/site-lenses.git (branch `main`)

---

## 🟢 Itens Resolvidos na Sessão de 29/09/2026

| # | Item | Status | O que foi feito |
|---|------|--------|-----------------|
| 11 | **Página Sobre Nós Oficial (`sobre.html` / `sobre-nos.html`)** | ✅ Resolvido | Criada página institucional completa com Hero 100vh em vídeo, seção Sobre 100% full-width com split interativo, contadores animados de KPIs (+150, +80, +8, 100%), blocos de Missão, Visão e Valores com efeito iluminação real no hover, seção Nossa Equipe editorial em fundo branco com 4 retratos de estúdio e bios em modal, e CTA final com degradê oficial. |
| 12 | **Degradês Oficiais e Tom Sobre Tom** | ✅ Resolvido | Implementados degradês canônicos (Azul Espacial `#202A44` → Azul Sabóia `#5C6CA4`) no header ticker e botões, além de marca d'água monumental translúcida Tom Sobre Tom conforme Manual da Marca (Anexos 2 e 3). |
| 13 | **Redesign do Footer em 5 Colunas** | ✅ Resolvido | Logotipo empilhado integrado na Coluna 1, Manifesto verticalizado na Coluna 2, Contato na Coluna 3, Redes na Coluna 4 e CTA na Coluna 5, separados por divisores verticais sutis. Breakpoint calibrado para `<= 860px` para linha contínua em 1024px. |
| 14 | **Preenchimento do Vão da Logo & Barra Inferior Agência** | ✅ Resolvido | Coluna 1 em `max-content` e logo ampliada para `clamp(210px, 17.5vw, 270px)` com `aspect-ratio: 541 / 575`, eliminando o vão até a divisória. Barra inferior tripartite (Copyright à esquerda, Termos & Privacidade ao centro e Desenvolvido por IDE Digital com logo branco mono à direita). |
| 15 | **Sincronização Total Multi-Páginas** | ✅ Resolvido | Header e footer perfeitamente idênticos e sincronizados em `index.html`, `sobre.html`, `sobre-nos.html` e `design-system-preview.html`. |

---

## 🟢 Itens Resolvidos em Sessões Anteriores (23/09/2026)

| # | Item | Status | O que foi feito |
|---|------|--------|-----------------|
| 1 | **Pasta do Vídeo do Hero** | ✅ Resolvido | Renomeada de `assets/S1 TOPO HERO/` para `assets/hero/`, corrigido no HTML para evitar falhas de `%20`. |
| 2 | **Logo Outlined Órfã** | ✅ Resolvido | Inserida no Footer como imagem oficial com link suave para o topo (`assets/logos/lenses-outlined-logo.png`). |
| 3 | **URLs e Ações dos Cases (`PROJECTS`)** | ✅ Resolvido | Todos os 9 cases agora possuem links comerciais diretos via WhatsApp contextualizado por projeto com `target="_blank"`. |
| 4 | **Âncora `#projetos-todos`** | ✅ Resolvido | Integrado link interativo no título `ALGUNS PROJETOS` com chamada `TODOS OS CASES ↓` e efeito hover elétrico. |
| 5 | **QA de Altura do Split "Sobre a LENSES"** | ✅ Resolvido | Adicionada media query `@media (min-width: 1101px) and (max-height: 740px)` prevenindo compressão vertical em notebooks baixos (<= 740px). |
| 6 | **Contraste dos Cards sobre Fotos Claras** | ✅ Resolvido | Overlays dos carrosséis reforçados com gradiente linear escuro até 0.94 na base, garantindo legibilidade AAA. |
| 7 | **Certificação ISO 9001 (`#certificacao`)** | ✅ Resolvido | Criada seção institucional com card visual (`assets/iso9001-card.jpg`), 4 pilares operacionais e nota de rodapé. |
| 8 | **Seção Clientes (`#clientes`)** | ✅ Resolvido | Grid responsivo com 18 logos oficiais (`assets/logos-zion/`), repouso monocromático e destaque colorido ao hover. |
| 9 | **Novo Footer Cinematográfico** | ✅ Resolvido | Unificação completa com GIF de palco, overlay escurecido, logo outlined, grid 4 colunas e eixos da marca. |
| 10 | **Tipografia & Design System** | ✅ Resolvido | Pareamento de `Inter Tight` com `Plus Jakarta Sans`, atualização de estilos e documentação no preview. |

---

## 🔴 Itens Pendentes / Próximas Fases

| # | Item | Dependência / Bloqueio |
|---|------|------------------------|
| 1 | **SEO: `og:image` e `<link rel="canonical">`** | Aguardando **domínio definitivo** para preencher as URLs absolutas. |
| 2 | **Deploy VPS + Sincronização Notion (DB_IDE)** | Rodar quando as alterações visuais forem homologadas pelo cliente. |
| 3 | **Testes em dispositivo físico real (iOS Safari)** | Validação touch manual de swipe dos carrosséis e reprodução de vídeos nos cards de serviços. |
