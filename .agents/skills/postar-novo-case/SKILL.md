---
name: postar-novo-case
description: Monta e revisa a página de um case LENSES a partir do handoff local produzido por organizar-novo-case. Executa o template, prepara prévia local, pede ajustes e só após aprovação explícita publica no GitHub Pages. Invocar por /postar-novo-case ou /publicar-novo-case.
---

# LENSES | Postar / Publicar Novo Case

**Somente FASE 2: montar página, validar, revisar com usuário e publicar se aprovada.** NÃO repetir download em massa nem recriar curadoria se já há handoff organizado. NUNCA publicar automaticamente ao receber o comando.

## Abertura

Sem slug especificado: procurar pastas já preparadas em .lenses-work/ e perguntar qual case o usuário deseja postar, mostrando opções se houver. Se não houver nada preparado, responder:

> Fala, mano! 💙 Vamos montar o case! Ainda não encontrei um pacote organizado. Primeiro me passa o link pelo /organizar-novo-case para preparar textos e mídias.

Com slug já informado, carregar diretamente.

Apresentar plano simples: verificar material organizado → construir usando template LENSES → abrir prévia local → revisar alterações → **pedir sua autorização antes de publicar**.

## Receber o handoff (obrigatório)

- Ler docs/CASE-TEMPLATE.md, scripts/build-case.mjs, scripts/case-handoff.mjs e .lenses-work/SLUG/handoff.json.
- Rodar node scripts/case-handoff.mjs status SLUG e node scripts/case-handoff.mjs validate SLUG.
- Se o pacote não existe, voltar à skill de organização. Se faltam dados, usar material real e pedir somente o que for essencial; não inventar dados.
- Confirmar direitos de imagem/créditos, documentação e números com o pacote. Não marcar validações verdadeiras sem evidência.
- Não executar FFmpeg/rclone de novo salvo correção técnica pontual e justificada.
- Não iniciar upload público de vídeo, YouTube, Drive ou serviço pago sem destino e autorização específicos.

## Construir prévia LOCAL

1. Revisar estrutura do template no repositório e as seções oficiais. Não criar um layout novo ou duplicar CSS. Manter Inter e cores LENSES #5C6CA4.
2. A partir do handoff e data/cases/_modelo.json, gerar data/cases/SLUG.json com status=draft, métricas somente se confirmadas, quatro capítulos editoriais coerentes com entregas reais. O modelo atual exige 4 soluções e 4 KPIs, mas não inventar serviços nem números para preencher: sinalizar bloqueio ou adaptar com revisão consciente.
3. Copiar somente miniaturas selecionadas e otimizadas do espaço privado para assets/cases/SLUG, LOCALMENTE. Não incluir .MOV, brutos, vídeos de gigabytes nem arquivos confidenciais; confirmar que cada arquivo tem autorização e licença. Conservar relação com arquivos originais no manifesto.
4. Atualizar src/alt das mídias no JSON, garantindo que paths sejam relativos ../../assets/cases/SLUG/. Para vídeo institucional grande hospedado fora, integrar somente URL já aprovada/publicada e poster correspondente. Se hospedagem ainda não definida, deixar bloco como pendente na prévia.
5. Rodar:
   node scripts/build-case.mjs data/cases/SLUG.json
   node scripts/test-case-builder.mjs
   node scripts/check-generated-cases.mjs
   node scripts/check-design-system.mjs
6. Conferir a versão por servidor local HTTP e navegador desktop/tablet/mobile: fotos 16:9/9:16, vídeo, mosaico e scroll nos dois sentidos, dashboard, legibilidade, texto, CTAs, performance e reduced motion. Corrigir problemas e repetir testes.
7. Mostrar prévia ao usuário (URL local acessível ou screenshots gerados no computador) e destacar pendências específicas. Nunca alegar que revisou visualmente se não abriu o browser de verdade.

## Rodadas de revisão

Quando o usuário solicitar edição, alterar somente o JSON/mídias deste case ou melhorias globais explicitamente aprovadas. Reconstruir e mostrar novamente. Repetir quantas vezes forem necessárias; **não publicar antes de o usuário responder que aprovou**.

Pergunta de aprovação:

> A página ficou pronta para sua revisão. Quer ajustar alguma coisa ou **aprova publicar este case da [CLIENTE] no site da LENSES**?

## Publicar (somente após aprovação explícita)

1. Verificar autorização de todos os materiais, textos, logo e métricas. Confirmar que dados sensíveis não irão para site público; noindex/draft não é privacidade.
2. Definir status=published no JSON somente após mediaApproved=true e metricsVerified=true fundamentados. Se o briefing não comprova dados, não inventar; pedir revisão editorial ou manter apenas valores verificáveis.
3. Checar URLs de vídeo público, imagens próprias, responsive e QA final; gerar novamente.
4. Git status e git diff; git add seletivo APENAS data/cases/SLUG.json, casev2/SLUG/, assets/cases/SLUG/ aprovados. Nunca git add -A nem incluir .lenses-work, originais brutos, tokens ou senhas.
5. Commit e push na branch adequada seguindo governança do repositório. Se houver branch protegida, PR e confirmação de merge. Relatar SHA e URL /site-lenses/casev2/SLUG/. Verificar a página publicada se navegador disponível.
6. Guardar status e histórico da aprovação no handoff local. Não automatizar publicação posterior sem nova aprovação.

## Regras

- O alias /publicar-novo-case executa exatamente esta skill; publicar NÃO significa pular revisão.
- Respeitar o template Bellamazon como modelo visual, sem misturar conteúdo de clientes.
- Não gerar placeholders de resultados reais sem rótulo de demonstração.
- Falta de dados, licença, vídeo hospedado ou falha de QA mantém em prévia local.
- Esta etapa não reorganiza o Drive: a FASE 1 já fez isso.
