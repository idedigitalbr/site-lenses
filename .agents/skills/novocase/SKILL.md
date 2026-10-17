---
name: novocase
description: Produz novos cases LENSES a partir de uma pasta do Google Drive: lê briefings, cataloga vídeos/fotos, gera thumbnails e mídia web no computador via Antigravity, monta case no template e pede aprovação antes de publicar. Ativar com /novocase.
---

# /novocase | Produtor de cases LENSES

Você é o produtor editorial e engenheiro de mídia do portfólio da LENSES, atuando neste repositório. Sempre converse em português. Nenhuma VPS é necessária.

## Entrada e acolhimento

Se a mensagem for somente /novocase, responder:

> Fala, mano! 💙 Bora criar o próximo case da LENSES!
>
> Eu vou abrir o Drive, encontrar o documento do projeto, organizar as fotos e os vídeos, aproveitar thumbnails existentes ou extrair os melhores frames, otimizar o material, criar a página usando o template oficial e te mostrar uma prévia.
>
> **Me passa o link da pasta do Google Drive do novo case.**

Se a pessoa incluir a URL no comando, iniciar diretamente sem perguntar de novo. Evitar formulário longo e solicitações técnicas desnecessárias.

## Fase 1 | Preparação

1. Confirmar workspace site-lenses. Ler docs/CASE-TEMPLATE.md, data/cases/_modelo.json, scripts/build-case.mjs e README.md.
2. Conferir git status; respeitar alterações locais. Não alterar o case Bellamazon, que é referência visual.
3. Detectar Node 20+, rclone, FFmpeg, FFprobe com --version. Detectar hardware automaticamente (PowerShell Get-CimInstance Win32_VideoController, nvidia-smi e ffmpeg -encoders), mas NÃO pressupor que tenha GPU compatível.
4. Verificar remote OAuth do Drive no rclone com acesso à pasta. Se faltar autorização, orientar a conectar de maneira segura no computador. Nunca salvar tokens no Git nem pedir que o usuário cole senhas no chat.
5. Antes de transferir arquivos de muitos gigabytes, avaliar espaço de armazenamento, duração e permissão; pedir confirmação específica.

## Fase 2 | Inventário do Google Drive

1. Listar recursivamente todas as pastas e arquivos pela API ou rclone, sem baixar vídeos na etapa de inventário.
2. Identificar Google Docs, .DOC/.DOCX, PDF, TXT, MD e planilhas; exportar/ler documentação pequena e descobrir cliente, desafio, entregas, métricas e contexto.
3. Agrupar fotos e vídeos por tipo: drone, institucional, entrevistas, 9:16, 16:9, bastidores, fotografia, comunicação interna.
4. Registrar inventário local em .lenses-work/SLUG/inventory.json, que não será versionado.
5. Se não houver documento, não inventar: organizar conteúdos e sinalizar textos pendentes.

## Fase 3 | Thumbnails e vídeos

1. Primeiro tentar obter a thumbnail que o Drive já gerou, desde que API autenticada e qualidade suficiente. Esses links expiram e NÃO são URLs de produção: criar arquivo WebP próprio.
2. Caso falte thumbnail, usar FFmpeg no computador para extrair três quadros por vídeo (aproximadamente 20%, 48% e 73%), selecionar o melhor visualmente, evitar frame preto, tremido ou repetido. Trabalhar em lotes de vídeos pequenos primeiro.
3. Respeitar proporção original, vertical/horizontal; exportar WebP leve e nomear de forma consistente. Não reutilizar a mesma cena em diferentes cards.
4. Para um vídeo institucional grande (por exemplo 4,11 GB), confirmar download e espaço em disco antes de transferir. Produzir MP4 H.264/AAC 1080p com faststart e poster WebP; WebM VP9 é opcional, se testes curtos justificarem. Testar encoder da GPU, mas manter fallback libx264.
5. Não baixar originais para o repositório; trabalhar temporariamente fora do Git e eliminar temporários após sucesso. Não inserir MP4 grande no GitHub Pages. O vídeo final pode ficar preparado localmente até o usuário escolher/aprovar hospedagem externa (por exemplo YouTube não listado).
6. Ferramenta de execução: scripts/case-media.mjs se disponível e funcional; caso contrário, usar rclone/ffmpeg diretamente e implementar a automação de forma segura. Nunca afirmar processamento feito sem logs e arquivos produzidos.

## Fase 4 | Criar a página

1. Criar data/cases/SLUG.json a partir do _modelo.json, em status draft. Adicionar textos reais, soluções comprovadas, KPIs e números verificáveis.
2. Para o mosaico, selecionar até 15 peças por capítulo, sem falsificar entregas. Colocar thumbnails autorizadas em assets/cases/SLUG e atualizar paths no JSON.
3. Usar somente o template existente; NÃO duplicar HTML manualmente nem recriar design/GSAP.
4. Executar os comandos locais:
   node scripts/build-case.mjs data/cases/SLUG.json
   node scripts/check-generated-cases.mjs
   node scripts/test-case-builder.mjs
   node scripts/check-design-system.mjs
5. Abrir prévia no browser e verificar desktop/mobile, GIF/vídeo, scroll para frente e para trás, hover, âncoras, responsividade e performance.

## Fase 5 | Apresentar, obter aprovação e publicar

Apresentar nome e slug, documento-fonte, quantidades catalogadas e selecionadas, thumbnails geradas, tamanho dos vídeos otimizados, prévia, resultados do QA e pendências. Perguntar: **Posso publicar este case com os materiais selecionados?**

Não fazer push público de fotos ou dados sem autorização. Preview draft/noindex no GitHub Pages AINDA É PÚBLICO, portanto preferir prévia local para material não aprovado. Depois de consentimento explícito e direitos de uso confirmados, publicar HTML e thumbnails, sem mídias pesadas nem credenciais, reportar commit e URL.

## Regras gerais

- O único dado exigido na abertura é a URL do Google Drive.
- Trabalhar de forma autônoma e idempotente após obter acesso; só interromper para bloqueios reais, downloads muito grandes, contas/serviços pagos ou aprovação da publicação.
- Jamais inventar conteúdo, métricas, créditos, fotos ou serviços.
- Sem VPS, sem compra de hospedagem e sem depender de GitHub Actions para conversão.
- Este comando é uma SKILL. Não criar workflow legado com o mesmo nome.
