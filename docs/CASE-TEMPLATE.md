# LENSES | Template reutilizável de cases

## Objetivo

A página Bellamazon é a referência visual aprovada. A LENSES poderá ter milhares de cases usando a mesma estrutura, sem copiar e editar manualmente todo o HTML.

**Fluxo:** briefing → seleção de mídias → JSON validado → HTML estático gerado → QA → aprovação visual/editorial → publicação.

## Arquitetura

| Arquivo | Responsabilidade |
|---|---|
| casev2/bellamazon/index.html | Case atual, mantido sem regressões |
| templates/case-layout.html | Modelo único de layout, com as seções e os scripts já aprovados |
| assets/case-template-layout.css | Estilos compartilhados, carregados com cache em todas as novas páginas |
| assets/bellamazon-mosaic.css + .js | Motor do mosaico, reutilizado em todos os cases |
| assets/bellamazon-dashboard.css + .js | Componentes analíticos e animação pelo scroll |
| data/cases/NOME.json | Fonte da verdade do conteúdo de cada cliente |
| data/cases/_modelo.json | Exemplo fictício de preenchimento, não deve ser publicado |
| scripts/build-case.mjs | Gera a página estática em casev2/SLUG/index.html |
| scripts/check-generated-cases.mjs | Verifica seções, conteúdo e status de publicação |
| .github/workflows/build-cases.yml | Regenera cases quando JSON/modelo é atualizado |

**O JSON e a pasta de mídia são os arquivos-fonte do cliente.** O HTML gerado não deve receber alterações manuais; ajustes no layout devem ir para o modelo ou CSS compartilhados.

## Seções obrigatórias

1. Hero: cliente, texto, fotografia, marca e quatro serviços.
2. O Projeto: apresentação, audiovisual quando disponível, contexto e crédito.
3. O Desafio: problema, argumentos, imagem e três pilares.
4. Soluções: quatro cards editoriais com expansão por scroll e mosaico de mídia.
5. Dados do Projeto: quatro indicadores e quatro painéis, gerados somente com os dados fornecidos.
6. CTA e footer: mesma navegação, identidade e contato da LENSES.

A paleta permanece no azul LENSES (#5C6CA4), fonte Inter e padrões de UX atuais. As quatro soluções ocupam posições fixas no motor do mosaico. Podem ter nomes diferentes em cada case, mas não se deve inventar serviços prestados. Quando o briefing trouxer só duas frentes, divida pelas entregas confirmadas em quatro capítulos editoriais coerentes.

## Modelo de dados

Copie data/cases/_modelo.json para data/cases/hydro.json e altere os campos:

- slug: URL kebab-case, como hydro.
- status: draft por padrão; published somente após revisão e aprovação.
- name, meta, hero, project, challenge: textos, fotos e conteúdo editorial.
- hero.services: exatamente quatro itens, cada um com title e description.
- solutions: exatamente quatro itens, cada qual com title, short, lead, description, footer, media.
- solutions[].media: itens com type, label, src, alt e link opcional. Types aceitos: foto, drone, video, story, conceito.
- deliverables: quantidades por formato, com label, short e quantity. Elas geram o gráfico de barras e a distribuição circular.
- kpis: exatamente quatro indicadores com label, value, description, informados ou comprovadamente derivados das entregas.
- locations: somente localidades reais confirmadas.
- project.video.youtubeId: ID validado de 11 caracteres, caso exista vídeo no YouTube.
- metricsVerified / mediaApproved: só verdadeiros após conferência.
- driveFolderUrl: referência à pasta de origem dos materiais, não URL de imagem pública.

Exemplo de contagem de entregas (a confirmar): 23 vídeos com drone, 15 stories, 2 vídeos institucionais, 50 fotografias. São quatro formatos diferentes. Esses números devem refletir entregas confirmadas, e o mosaico pode exibir curadoria de até 15 mídias por solução sem repetir imagens de forma artificial.

Não copiar dados de alcance, engajamento, tráfego ou resultados de outros projetos para um novo cliente. Sem série temporal, NÃO inventar um gráfico de evolução mensal. O gerador usa contagens de produção, proporções calculadas e informações editoriais do próprio cliente.

## Origem de mídias: Google Drive

Uma pasta do Drive é **origem de arquivos**, não CDN de produção. Um link privado não vira imagem do site automaticamente.

Para cada projeto:
1. Abrir a pasta com a conta/autorização necessária.
2. Inventariar mídias, selecionar peças e validar autorização de uso.
3. Exportar e otimizar fotos em WebP/AVIF; vídeos preferencialmente em MP4/H.264 e com poster WebP.
4. Salvar os materiais aprovados em assets/cases/SLUG/.
5. Referenciar as imagens no JSON por caminhos relativos ao HTML, por exemplo: ../../assets/cases/hydro/foto-01.webp.
6. Marcar orientation/formatos no tipo de mídia: story vertical 9:16, vídeo e foto horizontal 16:9, drone etc.

O mosaico usa carregamento lazy e thumbnails. Não carregar dezenas de vídeos MP4 automaticamente. Quando o conteúdo estiver em Vimeo/YouTube, guardar a miniatura e link apropriados, não embutir URL de edição do Google Drive em src.

Se o Drive exigir acesso indisponível, solicitar permissão ou anexos exportados. Nunca inventar imagens como se fossem entregas realizadas. Não enviar materiais confidenciais ou sem autorização ao repositório público.

## Revisão antes de publicar

O status draft gera página com aviso de PRÉVIA e metatag noindex,nofollow. **A URL da prévia ainda pode ser pública**, portanto informações confidenciais jamais devem entrar no JSON ou na pasta de mídia.

O status published exige mediaApproved=true, metricsVerified=true e pelo menos uma mídia real por solução. Esses flags não substituem aprovação de conteúdo e verificação de direitos autorais.

## Construir e validar

Requer Node.js 20+, sem instalar dependências.

    node scripts/build-case.mjs data/cases/hydro.json
    node scripts/build-case.mjs --all
    node scripts/check-generated-cases.mjs
    node scripts/check-design-system.mjs

Depois da geração, revisar:
- Desktop, tablet e mobile.
- Scroll da seção de soluções nos dois sentidos.
- Hover/touch e acessibilidade.
- Mídias 16:9 e 9:16, posters, links e textos alternativos.
- Dashboard: valores, rótulos, proporções e gráfico sem achatamento.
- Navegação, CTA, footer, SEO e performance.
- Dados demonstrativos ou não verificados corretamente identificados.

URL resultante: https://idedigitalbr.github.io/site-lenses/casev2/hydro/

O fluxo oficial de geração, curadoria e publicação acontece localmente no Antigravity. GitHub Actions permanece como validação manual opcional, sem downloads nem autopush.

## Prompt de trabalho para qualquer IA

> Você é o agente responsável por produzir cases para o site LENSES, repositório idedigitalbr/site-lenses. Leia docs/CASE-TEMPLATE.md e data/cases/_modelo.json. Receba o briefing e a pasta de mídia autorizada; diferencie fatos confirmados de dados pendentes; escreva textos editoriais objetivos; categorize e otimize mídias; crie data/cases/SLUG.json; gere a página via scripts/build-case.mjs. Preserve as mesmas seis seções, a tipografia, as cores, o mosaico, os dashboards e as animações. Não invente números, fotos, resultados, marcas nem autorizações. Se faltar mídia ou confirmação, use draft. Execute QA e revisão visual em desktop/mobile. Só publique com revisão; entregue a URL, o commit e as pendências.

### Exemplo de briefing enviado pelo cliente

    Nome Cliente/Projeto: Hydro
    Sobre o Projeto: ...
    O Desafio: ...
    Soluções Entregues:
      Audiovisual: 23 vídeos de drone, 15 stories,
      2 vídeos institucionais, 50 fotos editadas
      Estratégia: ...
    Link dos materiais (Google Drive): ...
    Status da autorização de publicação: ...

**Resultado:** um novo case derivado do template, não uma página criada com estilo diferente.


## Fluxo oficial Antigravity local: /novocase

A partir de outubro de 2026, o Antigravity executa a produção no computador em duas skills independentes: /organizar-novocase-lenses (Drive e preparação privada) e /postar-novocase-lenses (página, prévia, revisão e aprovação para publicar).

**Google Drive → inventário → documento → curadoria de thumbnails → vídeo web otimizado → JSON do case → prévia local → aprovação → commit/push.**

Precondições no computador (instalar/configurar uma vez):
- Node 20+; FFmpeg/ffprobe no PATH; rclone no PATH.
- Configurar uma conexão OAuth do rclone para a conta Google autorizada ao Drive, nomeada lensesdrive: rodar rclone config; não salvar credenciais no repositório.
- Verificar espaço livre em disco antes de baixar um vídeo pesado. 4,11 GB de origem exige margem para fonte, transcodificação e temporários.
- Opcional: definir LENSES_RCLONE_REMOTE no ambiente se o remote possuir outro nome. Nunca incluir tokens em JSON versionado.

Comandos disponíveis para o agente, que deve executá-los automaticamente após receber a URL:

    node scripts/case-media.mjs scan hydro "https://drive.google.com/drive/folders/ID"
    node scripts/case-media.mjs docs hydro "https://drive.google.com/drive/folders/ID"
    node scripts/case-media.mjs previews hydro "https://drive.google.com/drive/folders/ID"

scan lista metadados recursivamente e não baixa vídeos. docs baixa DOC/DOCX/PDF/TXT de tamanho limitado, não outros arquivos. previews processa lote inicial de até 12 vídeos, priorizando os pequenos (até 250 MB), extrai três frames WebP por vídeo e apaga originais temporários. Native Google Docs podem precisar de exportação adicional pelo conector/API.

Os arquivos da curadoria ficam em .lenses-work/hydro/previews/; o inventário e candidatos ficam em .lenses-work/hydro/inventory.json e candidates.json. O agente revisa os quadros, escolhe os melhores e cria selections.json com nomes dos arquivos de previews escolhidos:

    {"files":["arquivo-1.webp","arquivo-2.webp"]}

Somente com aprovação da seleção, executar:

    node scripts/case-media.mjs stage hydro --approved

Esse comando apenas COPIA thumbnails selecionadas para assets/cases/hydro, sem fazer commit.

Vídeo grande: selecionar o caminho EXATO dentro do inventory.json e confirmar espaço/permissão de download:

    node scripts/case-media.mjs encode hydro "https://drive.google.com/drive/folders/ID" "PASTA/VIDEO_GERAL_FULL.mp4" --confirm-large

A versão atual prepara MP4 H.264/AAC com faststart e um poster WebP, na pasta privada .lenses-work/hydro/optimized/. O Antigravity pode primeiro benchmarkar encoder por GPU e VP9/WebM separadamente, mas não precisa impor WebM. A versão otimizada NÃO é publicada ou hospedada automaticamente; não existe VPS. O agente solicita aprovação de um destino para o vídeo grande, como YouTube não listado ou outra hospedagem, antes de fazer upload.

Depois o agente preenche data/cases/hydro.json em draft, gera HTML, executa QA e verifica a prévia local. Só passa a published e envia arquivos ao GitHub após aprovação expressa. GitHub Actions (build-cases.yml) é **somente QA manual opcional**, não baixa mídias e não faz mais commits automáticos.

Importante: a ferramenta local é um primeiro utilitário operacional e precisa de um teste real na máquina (acesso rclone, FFmpeg, espaço e qualidade dos frames) antes de ser considerada pronta para produção em massa.


## Outubro 2026: operação em DUAS skills independentes (fluxo oficial)

O antigo /novocase monolítico foi aposentado. A produção agora é deliberadamente dividida:

### Comando 1: /organizar-novocase-lenses

Apenas lê a pasta do Google Drive, extrai o briefing de documentos, cataloga mídias, escolhe quadros, otimiza imagens WebP, prepara MP4 e WebM quando necessário e monta a pasta de trabalho privada do cliente.

**SAÍDA OBRIGATÓRIA:** .lenses-work/SLUG/handoff.json, além de inventory.json, documents/, previews/, optimized/ e README-ORGANIZACAO.md. O handoff registra sourceDrivePath, localPath, tipo, quantidade, textos, dúvidas e aprovações pendentes. Não criar data/cases/SLUG.json nem casev2/SLUG durante essa fase. Não fazer push nem upload público.

Inicialize a estrutura local:

    node scripts/case-handoff.mjs init SLUG "https://drive.google.com/drive/folders/ID"

Depois de preparar o conteúdo, preencha os campos do handoff e valide:

    node scripts/case-handoff.mjs status SLUG
    node scripts/case-handoff.mjs validate SLUG

Se o vídeo grande ainda não foi otimizado devido a falta de espaço ou download não autorizado, registrar pendência e terminar a organização honestamente. Não executar a segunda fase de forma automática.

### Comando 2: /postar-novocase-lenses

Usa o handoff JÁ EXISTENTE, cria JSON do cliente, copia thumbs selecionadas para assets/cases/SLUG apenas localmente, constrói casev2/SLUG/index.html em draft, testa e mostra prévia no navegador. Itera ajustes e só pede autorização de publicar quando a página estiver pronta.

**PONTO DE APROVAÇÃO:** "Posso publicar esse case da [CLIENTE] com essas fotos, textos e métricas?" Somente depois do "sim" explícito: confirmação de direitos, status published, QA final, commit seletivo, push e URL. Draft/noindex no GitHub Pages continua público: não fazer push de prévias com conteúdo sensível.

### Aliases e comandos seguros

- Comandos exclusivos LENSES: /organizar-novocase-lenses, /postar-novocase-lenses e /publicar-novocase-lenses.
- Utilizar somente os comandos canônicos com o sufixo -novocase-lenses para evitar conflitos entre projetos.
- /publicar-novocase-lenses e /publicar-novocase-lenses executam exatamente a fase /postar; nunca pulam revisão ou aprovação.
- A skill genérica /novocase foi removida para não misturar projetos.

As definições oficiais estão em .agents/skills/organizar-novocase-lenses/SKILL.md e .agents/skills/postar-novocase-lenses/SKILL.md. A diretiva de publicação só é ativada na FASE 2. Nenhuma máquina GitHub Actions fará downloads ou conversões.
