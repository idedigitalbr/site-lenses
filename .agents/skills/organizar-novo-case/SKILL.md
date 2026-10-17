---
name: organizar-novo-case
description: Organiza case LENSES do Google Drive: lê documentos, organiza textos, cataloga fotos/vídeos, extrai thumbnails e gera WebP e vídeo otimizado no computador usando Antigravity. Apenas preparação privada, SEM página ou publicação. Invocar por /organizar-novo-case.
---

# LENSES | Organizar Novo Case

**Somente FASE 1: organizar e preparar materiais.** Nunca criar HTML, atualizar case público, fazer commit/push ou iniciar a publicação. Esta skill é independente de /postar-novo-case.

## Recepção

Se vier somente o comando, responder em português:

> Fala, mano! 💙 Vamos organizar o novo case da LENSES! Vou ler os documentos, catalogar fotos e vídeos do Google Drive, separar os textos, escolher thumbnails, preparar WebP e os vídeos web necessários. Tudo ficará organizado localmente, sem publicar nada.
>
> **Me passa o link da pasta do Google Drive.**

Quando a URL já vier junto, executar sem pedir de novo. Derivar nome/slug do documento do cliente, quando disponível. Se faltar acesso, orientar autorização OAuth local, nunca pedir senhas/tokens pelo chat.

## Preparar o ambiente

- Ler docs/CASE-TEMPLATE.md, scripts/case-media.mjs, scripts/case-handoff.mjs e data/cases/_modelo.json.
- Verificar que o workspace é site-lenses e git status está seguro.
- Detectar Node 20+, FFmpeg/ffprobe, rclone, GPU e espaço livre automaticamente. Não perguntar a placa.
- Configurar/verificar acesso ao Drive (rclone remote lensesdrive ou LENSES_RCLONE_REMOTE) de maneira autenticada e sem credenciais no Git.

## Etapa A. Ler tudo antes de baixar

1. Listar recursivamente pasta/subpastas, tipos, tamanhos e nomes, sem transferir vídeos.
2. Procurar Google Docs, DOC/DOCX/PDF/TXT, vídeos institucionais, brutos, histórias verticais, drones, fotos, logos, materiais de comunicação.
3. Exportar documentos nativos do Google Docs via API autenticada quando necessário; DOCX/PDF de tamanho pequeno primeiro.
4. Ler o conteúdo real dos documentos: cliente, sobre, objetivo, desafio, soluções, entregas, créditos, métricas, localidades, autorizações. Não inventar.
5. Definir slug do cliente. Executar os utilitários locais:
   node scripts/case-handoff.mjs init SLUG "URL_DRIVE"
   node scripts/case-media.mjs scan SLUG "URL_DRIVE"
   node scripts/case-media.mjs docs SLUG "URL_DRIVE"
   Se o handoff já existe, retomar sem sobrescrever.

## Etapa B. Organizar e otimizar mídias

1. Preferir thumbnail nativa do Drive quando autenticada, aproveitável e passível de download; não embutir link temporário no site.
2. Caso contrário: node scripts/case-media.mjs previews SLUG "URL_DRIVE" extrai 3 WebP de cada vídeo pequeno. Inspecionar e escolher frames sem repetição, preto ou tremido.
3. Preservar proporção 16:9, 9:16 ou original; otimizar fotos reais em WebP/AVIF e separar drone, vídeo, story, fotografia, bastidores, etc.
4. Para vídeo grande, verificar disco e solicitar autorização antes de baixar (ex.: 4,11 GB). Executar encode somente com consentimento:
   node scripts/case-media.mjs encode SLUG "URL_DRIVE" "CAMINHO_EXATO" --confirm-large
   Produzir MP4 H.264/AAC 1080p com faststart e poster WebP. Se o case precisar de WebM, acrescentar --webm ao comando encode, preferencialmente após teste curto de VP9 para estimar tempo/tamanho/qualidade; o arquivo e o manifesto ficam em optimized/. Sem VPS, sem upload de vídeo pesado.
5. Manter mídias finais selecionadas em .lenses-work/SLUG/, nunca nos arquivos públicos durante organização. Deletar originais temporários apenas se já existe versão otimizada íntegra.

## Etapa C. Criar o handoff

Preencher .lenses-work/SLUG/handoff.json (contrato do case-handoff.mjs):
- schemaVersion=1, slug, driveUrl, clientName, status=organized se fase concluída;
- documents com fontes reais e paths;
- text.about, text.challenge, text.challengeDetails, text.summary, text.solutions e text.sources;
- deliverables com quantidades confirmadas;
- media.selected com type, label, localPath, sourceDrivePath e usage; paths relativos dentro de .lenses-work/SLUG e arquivos existentes;
- media.institutionalVideo com o caminho da versão MP4/WebM/poster e pendências de hospedagem;
- pending com dados/documentos/licenças faltantes. Nunca definir review.mediaRightsChecked=true sem confirmação.

Criar resumo legível .lenses-work/SLUG/README-ORGANIZACAO.md com material organizado, mídia disponível e pendências.
Validar: node scripts/case-handoff.mjs validate SLUG
Se houver faltas reais, manter pendências explícitas; não inventar informação para passar no teste.

## Entrega

Relatar número de arquivos, documentos lidos, quadros selecionados, vídeo preparado, tamanho final, pasta local, lacunas e o próximo passo. Não executar a segunda fase automaticamente. Encerrar orientando a usar /postar-novo-case SLUG (sinônimo /publicar-novo-case SLUG). O comando de publicação sempre solicita aprovação antes do push.
