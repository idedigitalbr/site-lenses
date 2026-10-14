import fs from 'node:fs';
import path from 'node:path';

const errors = [];
const read = name => fs.readFileSync(path.join(process.cwd(), name), 'utf8');
const check = (valid, message) => { if (!valid) errors.push(message); };
const pages = ['index.html', 'sobre.html'];
const html = Object.fromEntries(pages.map(p => [p, read(p)]));
const cssFiles = ['assets/tokens.css', 'assets/base.css', 'assets/components.css', 'assets/pages.css'];
const entry = read('assets/styles.css');
check(cssFiles.every(x => entry.includes('@import url("./' + path.basename(x) + '");') || entry.includes('@import url("./' + path.basename(x) + '?v=')), 'CSS sem todos os imports');
const css = cssFiles.map(read).join('\n').replace(/\/\*[\s\S]*?\*\//g,'');
const defined = new Set(Array.from(css.matchAll(/(--[\w-]+)\s*:/g), m => m[1]));
const used = new Set(Array.from(css.matchAll(/var\(\s*(--[\w-]+)/g), m => m[1]));
for (const token of used) check(defined.has(token), 'Token CSS indefinido: ' + token);
const tokens = read('assets/tokens.css');
for (const token of ['--color-brand-space-blue', '--color-brand-saboia', '--font-main', '--radius-full', '--bg-surface-elevated', '--border-subtle']) {
  check(tokens.includes(token + ':'), 'Token essencial ausente: ' + token);
}
check(tokens.startsWith(':root {'), 'Arquivo tokens.css não inicia com :root');
for (const file of cssFiles.slice(1)) check(!/:root\s*\{/.test(read(file)), 'Token root repetido: ' + file);
const preview = read('design-system-preview.html');
check(preview.includes('id="canonicalTokens"') && preview.includes("fetch('assets/tokens.css')"), 'Preview não lê tokens oficiais');
check(preview.includes('id="sobre2-variante"'), 'Preview sem documentação da Sobre 2');

let footerCanonical = null;
for (const [name, source] of Object.entries(html)) {
  const desktop = source.match(/<nav class="nav-actions nav-actions-left"[^>]*>([\s\S]*?)<\/nav>/);
  const mobile = source.match(/<nav class="nav-mobile-links"[^>]*>([\s\S]*?)<\/nav>/);
  check(Boolean(desktop && mobile), name + ': menu ausente');
  if (desktop && mobile) {
    const labels = text => Array.from(text.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g), m => m[1].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim());
    const expected = ['Início','Sobre','Portfólio / Cases'];
    check(expected.every((x,i) => labels(desktop[1])[i] === x), name + ': menu desktop não padronizado');
    check(expected.concat('Nossos Serviços').every((x,i) => labels(mobile[1])[i] === x), name + ': menu mobile não padronizado');
    const target = 'sobre.html';
    check(desktop[1].includes('href="' + target + '"') && mobile[1].includes('href="' + target + '"'), name + ': Sobre com rota incorreta');
  }
  const ids = Array.from(source.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi), m => m[1]);
  check(ids.length === new Set(ids).size, name + ': IDs repetidos');
  for (const anchor of Array.from(source.matchAll(/href=["']#([^"']+)["']/gi), m => m[1])) check(ids.includes(anchor), name + ': âncora ausente #' + anchor);
  const footer = source.match(/<footer class="footer"[\s\S]*?<\/footer>/);
  check(Boolean(footer), name + ': footer ausente');
  if (footer) {
    const norm = footer[0].replace(/\.\.\//g,'').replace(/href="#inicio"/g,'href="index.html"').replace(/\s+/g,' ').trim();
    if (footerCanonical === null) footerCanonical = norm;
    else check(norm === footerCanonical, name + ': rodapé diferente do oficial');
  }
  for (const href of Array.from(source.matchAll(/\b(?:href|src|poster|data-team-img)\s*=\s*["']([^"']+)["']/gi), m => m[1])) {
    if (/^(#|https?:|mailto:|tel:|data:|javascript:)/i.test(href)) continue;
    const local = href.split(/[?#]/)[0];
    if (!local) continue;
    const asset = path.join(process.cwd(), path.normalize(path.join(path.dirname(name), decodeURIComponent(local))));
    check(fs.existsSync(asset), name + ': arquivo inexistente: ' + local);
  }
}
for (const [name, source] of Object.entries(html)) {
  check(!/href=["'][^"']*(?:sobre2|sobre-nos\.html)["']/.test(source), name + ': contém link para rota antiga desativada');
  check(!/>Sobre 2<\/a>/.test(source), name + ': mostra Sobre 2 no menu em vez da página Sobre oficial');
}
// O split é um componente único: o conteúdo vem somente de assets/about-split.js.
// As duas páginas diferem unicamente no estado inicial (Home fechada, Sobre aberta).
const splitSource = read('assets/about-split.js');
check(splitSource.includes('colaboracao-lenses.webp') && splitSource.includes('Onde</span>') && splitSource.includes('150') && splitSource.includes('about2-close-control'), 'Componente Sobre compartilhado incompleto');
for (const [name, initial] of [['index.html', 'idle'], ['sobre.html', 'story']]) {
  const source = html[name];
  check(source.includes('data-lenses-about-split data-initial-state="' + initial + '"'), name + ': estado inicial do painel incorreto');
  check(source.includes('about2-reference-split'), name + ': estilo compartilhado não aplicado');
  check(!source.includes('class="story-content-grid"'), name + ': markup duplicado do componente Sobre');
  const scriptPath = 'assets/about-split.js?v=';
  check(source.includes('src="' + scriptPath), name + ': componente único não carregado');
  check(source.indexOf('about-split.js?v=') < source.indexOf('script.js"></script>'), name + ': componente deve carregar antes do script principal');
}
for (const section of ['about-hero-clean','about-tech-section','about-cta-section']) check(!html['sobre.html'].includes('class="' + section + '"'), 'Sobre reintroduziu ' + section);
for (const section of ['id="sobre"','id="fundamentos"']) check(html['sobre.html'].includes(section), 'Sobre perdeu ' + section);
if (errors.length) { console.error('QA Lenses reprovado:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log('QA Lenses aprovado: tokens, CSS, preview, menus, rodapés, anchors, URLs e páginas.');
