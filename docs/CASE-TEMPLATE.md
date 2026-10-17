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

A automação de GitHub Actions regenera quando houver push em data/cases ou no template. Isso depende de Actions habilitado e permissão de escrita no repositório. Sem isso, execute o gerador e commite o HTML resultante manualmente.

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
