# LENSES | Regras de execução dos agentes

Este repositório contém o site institucional LENSES e um sistema de cases que compartilham o template.

## Duas tarefas separadas (obrigatório)

**Organizar caso**: invocado via /organizar-novocase-lenses, ou a grafia solicitada pelo usuário /organizar-novocase-lenses. Leia .agents/skills/organizar-novocase-lenses/SKILL.md. Só ler o Drive, preparar textos e mídias otimizadas em .lenses-work/SLUG, registrar handoff.json e pendências. Não gerar página nem publicar.

**Postar caso**: invocado via /postar-novocase-lenses ou /publicar-novocase-lenses, ou grafias do usuário /postar-novocase-lenses e /publicar-novocase-lenses. Leia .agents/skills/postar-novocase-lenses/SKILL.md. Recuperar handoff privado, montar a página com o template, testar, mostrar prévia local e esperar aprovação expressa do usuário antes do commit/push.

Os comandos antigos, sem o sufixo LENSES, foram aposentados para evitar conflitos com outros projetos.

## Invariantes

- Nunca publicar, fazer push, upload para serviço externo ou pagar hospedagem sem autorização adequada.
- A publicação de case exige aprovação expressa *após a prévia visual*; a palavra "publicar" no comando não substitui a aprovação.
- O status draft e a tag noindex não tornam o GitHub Pages privado.
- Arquivos brutos, tokens e cache do Drive não entram no Git. Respeitar .gitignore.
- Não repetir download/encode já concluído; trabalho deve ser recuperável pelo handoff.
- Não inventar texto de briefing, métricas, imagens ou serviços.
- Reutilizar template e identidade LENSES; não modificar Bellamazon sem solicitação específica.

Veja docs/CASE-TEMPLATE.md para documentação, scripts de preparação e QA.
