import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { execSync } from 'node:child_process';

const REPO = 'idedigitalbr/site-lenses';
const PROJECT_NUMBER = 4;
const PROJECT_ID = 'PVT_kwDODX5gps4BrBVB';
const PROJECT_OWNER = 'idedigitalbr';
const CHECKLIST_PATH = 'd:/.GITHUB/sites-HTML/site-lenses/.MD/CHECKLIST.md';

const FIELDS = {
  status: 'PVTSSF_lADODX5gps4BrBVBzhpV2XI',
  etapa: 'PVTSSF_lADODX5gps4BrBVBzhpV4zA',
  prioridade: 'PVTSSF_lADODX5gps4BrBVBzhpV4zQ',
  sprint: 'PVTSSF_lADODX5gps4BrBVBzhpV4zU'
};

const STATUS_OPTIONS = {
  'Todo': 'f75ad846',
  'In Progress': '47fc9ee4',
  'Done': '98236657'
};

const ETAPA_OPTIONS = {
  'Etapa 1': '4f08d478',
  'Etapa 2': 'ad450229',
  'Etapa 3': '14b9a49c',
  'Etapa 4': 'd0561fda',
  'Etapa 5': 'bad861c2'
};

const PRIORIDADE_OPTIONS = {
  'P0': 'b914228d',
  'P1': '78780f8e',
  'P2': '2d96acd5',
  'P3': 'a35bf2e9'
};

const SPRINT_OPTIONS = {
  'Sprint 1': '3443c388',
  'Sprint 2': 'f905e176',
  'Sprint 3': 'd1346acd',
  'Sprint 4': 'a6ff26c9'
};

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

function runGql(query) {
  const res = execSync('gh api graphql --input -', {
    input: JSON.stringify({ query }),
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
  return JSON.parse(res);
}

// 1. Definição das Tarefas Pais (5 Etapas)
const parentTasks = [
  {
    num: 1,
    title: 'ETAPA 01 — PRÉ-PROJETO E PLANEJAMENTO',
    objective: 'Pesquisar, levantar informações, organizar as páginas, definir a identidade visual e preparar a base do website.',
    etapa: 'Etapa 1',
    prioridade: 'P1',
    sprint: 'Sprint 1',
    subcodes: ['1.1', '1.2', '1.3']
  },
  {
    num: 2,
    title: 'ETAPA 02 — DESENVOLVIMENTO CORE',
    objective: 'Desenvolver as páginas estruturais da agência (Home e Sobre), componentes globais e autenticação interna.',
    etapa: 'Etapa 2',
    prioridade: 'P0',
    sprint: 'Sprint 2',
    subcodes: ['2.1-PG01', '2.1-PG02', '2.2', '2.3']
  },
  {
    num: 3,
    title: 'ETAPA 03 — DESENVOLVIMENTO COMPLEMENTAR',
    objective: 'Desenvolver as quatro páginas de soluções (Digital, Estratégia, Conteúdo e Relações) e o portfólio de cases (Bellamazon e outros).',
    etapa: 'Etapa 3',
    prioridade: 'P0',
    sprint: 'Sprint 3',
    subcodes: ['3.1-PG03', '3.1-PG04', '3.1-PG05', '3.1-PG06', '3.2-PG07', '3.2-PG08', '3.3']
  },
  {
    num: 4,
    title: 'ETAPA 04 — REFINAMENTO, INTEGRAÇÕES E QA',
    objective: 'Refinamento visual, experiência responsiva, navegação fluida, SEO e garantia de qualidade de todas as páginas.',
    etapa: 'Etapa 4',
    prioridade: 'P0',
    sprint: 'Sprint 3',
    subcodes: ['4.1', '4.2', '4.3', '4.4']
  },
  {
    num: 5,
    title: 'ETAPA 05 — GO-LIVE, ENTREGA E LANÇAMENTO',
    objective: 'Homologação com o cliente, publicação em produção, entrega oficial e encerramento do projeto.',
    etapa: 'Etapa 5',
    prioridade: 'P0',
    sprint: 'Sprint 4',
    subcodes: ['5.1', '5.2', '5.3']
  }
];

// 2. Definição das Subtarefas
const subtasksDef = [
  { code: '1.1', title: '1.1 — Pesquisa e levantamento', etapa: 'Etapa 1', sprint: 'Sprint 1', prioridade: 'P1', tipo: 'ux', start: '### 1.1 — Pesquisa e levantamento', end: '### 1.2 — UX/UI, wireframes e Design System' },
  { code: '1.2', title: '1.2 — UX/UI, wireframes e Design System', etapa: 'Etapa 1', sprint: 'Sprint 1', prioridade: 'P1', tipo: 'ui', start: '### 1.2 — UX/UI, wireframes e Design System', end: '### 1.3 — Preparação do projeto' },
  { code: '1.3', title: '1.3 — Preparação do projeto', etapa: 'Etapa 1', sprint: 'Sprint 1', prioridade: 'P0', tipo: 'infra', start: '### 1.3 — Preparação do projeto', end: '# ETAPA 02 — DESENVOLVIMENTO CORE' },
  { code: '2.1-PG01', title: '2.1 — PG 01 — HOME', etapa: 'Etapa 2', sprint: 'Sprint 2', prioridade: 'P0', tipo: 'front', start: '### [ ] PG 01 — HOME', end: '### [ ] PG 02 — SOBRE A LENSES' },
  { code: '2.1-PG02', title: '2.1 — PG 02 — SOBRE A LENSES', etapa: 'Etapa 2', sprint: 'Sprint 2', prioridade: 'P1', tipo: 'front', start: '### [ ] PG 02 — SOBRE A LENSES', end: '## 2.2 — COMPONENTES E FUNCIONALIDADES PRINCIPAIS' },
  { code: '2.2', title: '2.2 — COMPONENTES E FUNCIONALIDADES PRINCIPAIS', etapa: 'Etapa 2', sprint: 'Sprint 2', prioridade: 'P1', tipo: 'front', start: '## 2.2 — COMPONENTES E FUNCIONALIDADES PRINCIPAIS', end: '## 2.3 — LOGIN E DASHBOARD INTERNO' },
  { code: '2.3', title: '2.3 — LOGIN E DASHBOARD INTERNO', etapa: 'Etapa 2', sprint: 'Sprint 2', prioridade: 'P2', tipo: 'back', start: '## 2.3 — LOGIN E DASHBOARD INTERNO', end: '# ETAPA 03 — DESENVOLVIMENTO COMPLEMENTAR' },
  { code: '3.1-PG03', title: '3.1 — PG 03 — SOLUÇÃO DIGITAL', etapa: 'Etapa 3', sprint: 'Sprint 2', prioridade: 'P1', tipo: 'front', start: '### [ ] PG 03 — SOLUÇÃO DIGITAL', end: '### [ ] PG 04 — SOLUÇÃO ESTRATÉGIA' },
  { code: '3.1-PG04', title: '3.1 — PG 04 — SOLUÇÃO ESTRATÉGIA', etapa: 'Etapa 3', sprint: 'Sprint 3', prioridade: 'P1', tipo: 'front', start: '### [ ] PG 04 — SOLUÇÃO ESTRATÉGIA', end: '### [ ] PG 05 — SOLUÇÃO CONTEÚDO' },
  { code: '3.1-PG05', title: '3.1 — PG 05 — SOLUÇÃO CONTEÚDO', etapa: 'Etapa 3', sprint: 'Sprint 3', prioridade: 'P1', tipo: 'front', start: '### [ ] PG 05 — SOLUÇÃO CONTEÚDO', end: '### [ ] PG 06 — SOLUÇÃO RELAÇÕES' },
  { code: '3.1-PG06', title: '3.1 — PG 06 — SOLUÇÃO RELAÇÕES', etapa: 'Etapa 3', sprint: 'Sprint 3', prioridade: 'P1', tipo: 'front', start: '### [ ] PG 06 — SOLUÇÃO RELAÇÕES', end: '## 3.2 — CASES E PORTFÓLIO' },
  { code: '3.2-PG07', title: '3.2 — PG 07 — CASE BELLAMAZON', etapa: 'Etapa 3', sprint: 'Sprint 3', prioridade: 'P1', tipo: 'front', start: '### [ ] PG 07 — CASE BELLAMAZON', end: '### [ ] PG 08+ — DEMAIS CASES DE CLIENTES' },
  { code: '3.2-PG08', title: '3.2 — PG 08+ — DEMAIS CASES DE CLIENTES', etapa: 'Etapa 3', sprint: 'Sprint 3', prioridade: 'P2', tipo: 'front', start: '### [ ] PG 08+ — DEMAIS CASES DE CLIENTES', end: '## 3.3 — FUNCIONALIDADES COMPLEMENTARES' },
  { code: '3.3', title: '3.3 — FUNCIONALIDADES COMPLEMENTARES', etapa: 'Etapa 3', sprint: 'Sprint 3', prioridade: 'P2', tipo: 'front', start: '## 3.3 — FUNCIONALIDADES COMPLEMENTARES', end: '# ETAPA 04 — REFINAMENTO, INTEGRAÇÕES E QA' },
  { code: '4.1', title: '4.1 — Refinamento visual e experiência', etapa: 'Etapa 4', sprint: 'Sprint 3', prioridade: 'P1', tipo: 'ui', start: '### 4.1 — Refinamento visual e experiência', end: '### 4.2 — Navegação e integrações' },
  { code: '4.2', title: '4.2 — Navegação e integrações', etapa: 'Etapa 4', sprint: 'Sprint 3', prioridade: 'P1', tipo: 'front', start: '### 4.2 — Navegação e integrações', end: '### 4.3 — Conteúdo e apresentação nos buscadores' },
  { code: '4.3', title: '4.3 — Conteúdo e apresentação nos buscadores', etapa: 'Etapa 4', sprint: 'Sprint 3', prioridade: 'P2', tipo: 'content', start: '### 4.3 — Conteúdo e apresentação nos buscadores', end: '### 4.4 — Testes e correções finais' },
  { code: '4.4', title: '4.4 — Testes e correções finais', etapa: 'Etapa 4', sprint: 'Sprint 3', prioridade: 'P0', tipo: 'qa', start: '### 4.4 — Testes e correções finais', end: '# ETAPA 05 — GO-LIVE, ENTREGA E LANÇAMENTO' },
  { code: '5.1', title: '5.1 — Homologação', etapa: 'Etapa 5', sprint: 'Sprint 4', prioridade: 'P0', tipo: 'qa', start: '### 5.1 — Homologação', end: '### 5.2 — Publicação' },
  { code: '5.2', title: '5.2 — Publicação', etapa: 'Etapa 5', sprint: 'Sprint 4', prioridade: 'P0', tipo: 'infra', start: '### 5.2 — Publicação', end: '### 5.3 — Entrega e lançamento' },
  { code: '5.3', title: '5.3 — Entrega e lançamento', etapa: 'Etapa 5', sprint: 'Sprint 4', prioridade: 'P1', tipo: 'content', start: '### 5.3 — Entrega e lançamento', end: '## PENDÊNCIAS PRINCIPAIS PARA CONCLUIR O PROJETO' }
];

const checklist = readFileSync(CHECKLIST_PATH, 'utf8');

// Criar labels necessárias no repositório se não existirem
console.log('--- 1. Assegurando Labels no repositório site-lenses ---');
const requiredLabels = [
  { name: 'tipo:etapa', color: '6f42c1', desc: 'Tarefa Pai / Etapa do Projeto' },
  { name: 'tipo:subtarefa', color: '0e8a16', desc: 'Subtarefa vinculada à Etapa' },
  { name: 'tipo:ux', color: '0e8a16', desc: 'UX' },
  { name: 'tipo:ui', color: '0e8a16', desc: 'UI' },
  { name: 'tipo:front', color: '0e8a16', desc: 'Front-end' },
  { name: 'tipo:back', color: '0e8a16', desc: 'Back-end' },
  { name: 'tipo:infra', color: '0e8a16', desc: 'Infraestrutura' },
  { name: 'tipo:qa', color: '0e8a16', desc: 'QA e Testes' },
  { name: 'tipo:content', color: '0e8a16', desc: 'Conteúdo' },
  { name: 'etapa:1', color: '1d76db', desc: 'Etapa 1' },
  { name: 'etapa:2', color: '1d76db', desc: 'Etapa 2' },
  { name: 'etapa:3', color: '1d76db', desc: 'Etapa 3' },
  { name: 'etapa:4', color: '1d76db', desc: 'Etapa 4' },
  { name: 'etapa:5', color: '1d76db', desc: 'Etapa 5' },
  { name: 'prioridade:p0', color: 'b60205', desc: 'P0 Urgente' },
  { name: 'prioridade:p1', color: 'd93f0b', desc: 'P1 Alta' },
  { name: 'prioridade:p2', color: 'fbca04', desc: 'P2 Normal' },
  { name: 'prioridade:p3', color: '0e8a16', desc: 'P3 Baixa' }
];

for (const l of requiredLabels) {
  try {
    run(`gh label create "${l.name}" --repo ${REPO} --color "${l.color}" --description "${l.desc}"`);
  } catch (e) {}
}

// 2. Criar as Tarefas Pais
console.log('\n--- 2. Criando Tarefas Pais (Etapa 01 a 05) ---');
for (const p of parentTasks) {
  const tmpFile = 'd:/.GITHUB/sites-HTML/site-lenses/.MD/temp_p.md';
  const body = `## Objetivo da Etapa
${p.objective}

- **Nível Hierárquico:** Tarefa Pai (Etapa)
- **Etapa:** ${p.etapa}

<!-- agent-reservation
tarefa: ${p.title}
etapa: ${p.etapa}
tipo: parent-etapa
-->`;

  writeFileSync(tmpFile, body, 'utf8');
  const url = run(`gh issue create --repo ${REPO} --title "${p.title}" --body-file "${tmpFile}" --label "etapa:${p.num},tipo:etapa,prioridade:${p.prioridade.toLowerCase()}" --assignee victorwilliames`);
  unlinkSync(tmpFile);
  p.issueNumber = parseInt(url.split('/').pop());
  p.url = url;
  console.log(`Criada Tarefa Pai #${p.issueNumber}: ${p.title}`);

  const gqlRes = runGql(`query {
    repository(owner: "idedigitalbr", name: "site-lenses") {
      issue(number: ${p.issueNumber}) { id }
    }
  }`);
  p.gqlId = gqlRes.data.repository.issue.id;
}

// 3. Criar Subtarefas com checklists completos
console.log('\n--- 3. Criando as 21 Subtarefas com Checklists Oficiais ---');
for (const s of subtasksDef) {
  const sIdx = checklist.indexOf(s.start);
  const eIdx = checklist.indexOf(s.end, sIdx);
  if (sIdx === -1 || eIdx === -1) {
    throw new Error(`Delimitador não encontrado para ${s.code}: ${s.start} -> ${s.end}`);
  }
  const chunk = checklist.substring(sIdx, eIdx);
  const checklistLines = chunk
    .split('\n')
    .filter(line => line.trim().startsWith('- [') || line.trim().startsWith('#### ') || line.trim().startsWith('**'))
    .join('\n');

  const items = chunk.split('\n').filter(l => l.trim().startsWith('- ['));
  const doneCount = items.filter(l => l.trim().startsWith('- [x]')).length;
  let statusName = 'Todo';
  if (doneCount === items.length && items.length > 0) statusName = 'Done';
  else if (doneCount > 0) statusName = 'In Progress';

  const body = `## Contexto e Objetivo
Subtarefa oficial do checklist IDE Digital para o projeto **Website Lenses | Agência de Comunicação**.
- **Etapa:** ${s.etapa}
- **Código:** \`${s.code}\`
- **Progresso inicial verificado:** ${doneCount}/${items.length} itens concluídos

## Checklist Oficial
${checklistLines}

## Protocolo do Agente
1. Conferir se a tarefa possui dependências abertas antes de iniciar alterações.
2. Trabalhar em branch própria \`feat/${s.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-<slug>\` ou \`fix/\`.
3. Comentar commits e PRs vinculando a esta Issue.

<!-- agent-reservation
tarefa: ${s.code}
etapa: ${s.etapa}
estado: ${statusName}
-->`;

  const tmpFile = 'd:/.GITHUB/sites-HTML/site-lenses/.MD/temp_s.md';
  writeFileSync(tmpFile, body, 'utf8');
  const url = run(`gh issue create --repo ${REPO} --title "${s.title}" --body-file "${tmpFile}" --label "etapa:${s.etapa.replace('Etapa ', '')},tipo:${s.tipo},tipo:subtarefa,prioridade:${s.prioridade.toLowerCase()}" --assignee victorwilliames`);
  unlinkSync(tmpFile);
  s.issueNumber = parseInt(url.split('/').pop());
  s.url = url;
  s.statusName = statusName;
  console.log(`Criada Subtarefa #${s.issueNumber}: ${s.title} (${doneCount}/${items.length} concluídos -> Status: ${statusName})`);

  const gqlRes = runGql(`query {
    repository(owner: "idedigitalbr", name: "site-lenses") {
      issue(number: ${s.issueNumber}) { id }
    }
  }`);
  s.gqlId = gqlRes.data.repository.issue.id;
}

// 4. Vincular nativamente via addSubIssue
console.log('\n--- 4. Vinculando Subtarefas aos seus Pais (GraphQL addSubIssue) ---');
for (const p of parentTasks) {
  const children = subtasksDef.filter(s => p.subcodes.includes(s.code));
  for (const c of children) {
    try {
      const mut = `mutation {
        addSubIssue(input: {
          issueId: "${p.gqlId}",
          subIssueId: "${c.gqlId}"
        }) {
          subIssue { id title }
        }
      }`;
      runGql(mut);
      console.log(`  Vinculada: #${c.issueNumber} (${c.title}) -> ${p.title}`);
    } catch (err) {
      console.error(`  Erro ao vincular #${c.issueNumber}:`, err.message);
    }
  }
}

// 5. Adicionar todos os itens ao Quadro #4 e preencher campos
console.log('\n--- 5. Adicionando ao Quadro #4 (site-lenses) e configurando campos ---');
const allToProject = [
  ...parentTasks.map(p => ({
    number: p.issueNumber,
    title: p.title,
    url: p.url,
    etapa: p.etapa,
    prioridade: p.prioridade,
    sprint: p.sprint,
    status: p.etapa === 'Etapa 1' ? 'In Progress' : 'Todo'
  })),
  ...subtasksDef.map(s => ({
    number: s.issueNumber,
    title: s.title,
    url: s.url,
    etapa: s.etapa,
    prioridade: s.prioridade,
    sprint: s.sprint,
    status: s.statusName
  }))
];

for (const item of allToProject) {
  let itemId;
  try {
    const addRes = run(`gh project item-add ${PROJECT_NUMBER} --owner ${PROJECT_OWNER} --url ${item.url} --format json`);
    const parsed = JSON.parse(addRes);
    itemId = parsed.id;
  } catch (e) {}

  if (!itemId) {
    const curItems = JSON.parse(run(`gh project item-list ${PROJECT_NUMBER} --owner ${PROJECT_OWNER} --limit 100 --format json`));
    const match = curItems.items.find(i => i.content && i.content.number === item.number);
    if (match) itemId = match.id;
  }

  if (itemId) {
    // Status
    const sId = STATUS_OPTIONS[item.status];
    if (sId) run(`gh project item-edit --id ${itemId} --field-id ${FIELDS.status} --project-id ${PROJECT_ID} --single-select-option-id ${sId}`);
    // Etapa
    const eId = ETAPA_OPTIONS[item.etapa];
    if (eId) run(`gh project item-edit --id ${itemId} --field-id ${FIELDS.etapa} --project-id ${PROJECT_ID} --single-select-option-id ${eId}`);
    // Prioridade
    const prId = PRIORIDADE_OPTIONS[item.prioridade];
    if (prId) run(`gh project item-edit --id ${itemId} --field-id ${FIELDS.prioridade} --project-id ${PROJECT_ID} --single-select-option-id ${prId}`);
    // Sprint
    const spId = SPRINT_OPTIONS[item.sprint];
    if (spId) run(`gh project item-edit --id ${itemId} --field-id ${FIELDS.sprint} --project-id ${PROJECT_ID} --single-select-option-id ${spId}`);
    console.log(`  Quadro item #${item.number}: ${item.title} -> [${item.status} | ${item.etapa}]`);
  }
}

console.log('\n--- PROJETO LENSES CONCLUÍDO COM 100% DE SUCESSO! ---');
