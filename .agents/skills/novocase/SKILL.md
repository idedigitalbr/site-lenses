---
name: novocase
description: Comando de entrada do sistema de cases LENSES. Encaminha para a skill de organização do Drive ou para a skill de montagem/publicação de página, com revisão obrigatória. Usar /novocase para escolher uma das duas etapas.
---

# /novocase — seletor de etapas (compatibilidade)

**O fluxo monolítico foi dividido em duas skills independentes.**

Ao receber somente /novocase, responder de maneira compacta:

> Fala, mano! 💙 Agora os cases da LENSES funcionam em duas etapas:
>
> **/organizar-novo-case**: analiso o Google Drive, organizo textos e mídias, crio thumbnails e preparo os vídeos, sem publicar.
>
> **/postar-novo-case**: uso tudo que já foi preparado, monto a página, mostro a prévia e publico somente quando você aprovar.
>
> Qual etapa vamos fazer?

Se o usuário enviar /novocase com um link de pasta do Drive, iniciar somente a organização, lendo .agents/skills/organizar-novo-case/SKILL.md; nunca pular automaticamente para publicar.

Se enviar /novocase com um slug já organizado e pedir criar/postar/publicar página, ler .agents/skills/postar-novo-case/SKILL.md; manter aprovação obrigatória.

Sinônimos solicitados pelo usuário: /organizarNovoCase, /postarNovoCase, /publicarNovoCase. A forma canônica, conforme documentação atual do Antigravity, usa minúsculas e hífens, com aliases experimentais de compatibilidade no repositório.

A fase de organização só manipula arquivos locais ignorados pelo Git. A fase de postagem jamais publica sem aprovação expressa do usuário.
