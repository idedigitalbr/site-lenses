import fs from 'node:fs';
import path from 'node:path';

const errors = [];
const read = name => fs.readFileSync(path.join(process.cwd(), name), 'utf8');
const check = (valid, message) => { if (!valid) errors.push(message); };
const pages = ['index.html', 'sobre.html'];
const html = Object.fromEntries(pages.map(p => [p, read(p)]));
const cssFiles = ['assets/tokens.css', 'assets/base.css', 'assets/components.css', 'assets/pages.css', 'assets/typography.css'];
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
// QA específico do case V2 e da experiência editorial publicada.
const bell = read('casev2/bellamazon/index.html');
const bellIDs = Array.from(bell.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi), m=>m[1]);
check(bellIDs.length === new Set(bellIDs).size, 'Bellamazon: IDs duplicados');
for (const id of ['bellamazon-hero','video-projeto','desafio','solucoes','resultados']) {
  check(bellIDs.includes(id), 'Bellamazon: seção ausente #' + id);
}
for (const local of ['assets/bellamazon-mosaic.css','assets/bellamazon-mosaic.js']) {
  check(fs.existsSync(path.join(process.cwd(), local)), 'Bellamazon: asset ausente ' + local);
  check(bell.includes(path.basename(local)), 'Bellamazon: asset não importado ' + local);
}
check(bell.includes('bella-infinite-gallery') && bell.includes('bella-mosaic-track'), 'Bellamazon: mosaico infinito não encontrado');
check(bell.includes('data-mosaic-direction="prev"') && bell.includes('data-mosaic-direction="next"'), 'Bellamazon: setas ausentes');
check(bell.includes('data-mosaic-toggle'), 'Bellamazon: falta controle de pausa');
check(bell.includes('VÍDEO INSTITUCIONAL BELLAMAZON'), 'Bellamazon: crédito de vídeo oficial ausente');
check(bell.includes('embed/WL7-6C7ZyZE'), 'Bellamazon: vídeo incorreto');
check(bell.includes('id="bell-results-title">Dados do Projeto'), 'Bellamazon: título do dashboard fora do padrão');
check(!bell.includes('Exemplo visual · sem dados reais'), 'Bellamazon: selo antigo de exemplo voltou');
check(bell.includes('Indicadores numéricos e distribuições visuais em validação'),
      'Bellamazon: indicadores não confirmados perderam identificação');
for(const asset of ['assets/bellamazon-dashboard.css','assets/bellamazon-dashboard.js']) {
  check(fs.existsSync(path.join(process.cwd(),asset)), 'Bellamazon: arquivo de dashboard ausente '+asset);
  check(bell.includes(path.basename(asset)), 'Bellamazon: dashboard não importa '+asset);
}
check(bell.includes('data-bella-filter="all"') &&
      ['estrategia','branding','embalagem','conteudo'].every(tag=>bell.includes('data-bella-filter="'+tag+'"')),
      'Bellamazon: filtros das soluções ausentes');
check((bell.match(/class="bella-mosaic-panel"/g)||[]).length === 4,
      'Bellamazon: quatro capítulos da galeria não encontrados');
const sectionOfSolutions = bell.indexOf('<section class="bell-s5 bella-reuse-results"');
const solutionsEnd = bell.indexOf('</section>', sectionOfSolutions);
const galleryStart = bell.indexOf('<section class="bella-reuse-presence bella-infinite-gallery"');
const galleryEnd = bell.indexOf('</section>', galleryStart);
const dashboardStart = bell.indexOf('<section class="dash-wrap bell-results"');
check(sectionOfSolutions >= 0 && galleryStart > solutionsEnd &&
      galleryEnd > galleryStart && dashboardStart > galleryEnd,
      'Bellamazon: mosaico deve ser seção irmã dos filtros para o pin não sobrepor os cards');

check((bell.match(/class="bella-mosaic-step/g)||[]).length === 4 &&
      bell.includes('class="bella-mosaic-progress"'),
      'Bellamazon: barra de progresso clicável incompleta');
check(bell.includes('bella-mosaic-info__icon') &&
      bell.includes('bella-mosaic-edge--prev') && bell.includes('bella-mosaic-edge--next'),
      'Bellamazon: cartões editoriais ou setas nas bordas ausentes');
check(!bell.includes('bella-mosaic-caption') && !bell.includes('bella-mosaic-head'),
      'Bellamazon: títulos superior/inferior removidos regressaram');
check(!bell.includes('COMO O TRABALHO GANHA FORMA'), 'Bellamazon: seção antiga não foi removida');
for (const href of Array.from(bell.matchAll(/\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi), m=>m[1])) {
  if (/^(#|https?:|mailto:|tel:|data:)/i.test(href)) continue;
  const cleaned = href.split(/[?#]/)[0];
  if (!cleaned) continue;
  check(fs.existsSync(path.resolve('casev2/bellamazon', decodeURIComponent(cleaned))),
        'Bellamazon: arquivo local inexistente ' + cleaned);
}
const mosaicJS = read('assets/bellamazon-mosaic.js');
check(mosaicJS.includes('pinSpacing:true') && mosaicJS.includes('prefers-reduced-motion: reduce'),
      'Bellamazon: pin ou reduced-motion ausentes');
check(mosaicJS.includes('paused=!paused') && mosaicJS.includes('aria-pressed'),
      'Bellamazon: controle de pausa incompleto');
check(mosaicJS.includes('renderScroll(self.progress)') &&
      mosaicJS.includes('weights = [1.24,1,1,1.34]'),
      'Bellamazon: scroll não reversível ou sem pausas estendidas no início/fim');
check(mosaicJS.includes('bella-mosaic-type-ghost') &&
      mosaicJS.includes('write(parts.detail'),
      'Bellamazon: texto progressivo do scroll ausente');
const mosaicCSS = read('assets/bellamazon-mosaic.css');
check(mosaicCSS.includes('bella-mosaic-past-wash') &&
      bell.includes('class="bella-mosaic-past-wash"'),
      'Bellamazon: tratamento monocromático de passagem ausente');
const homeHTML = read('index.html');
check(homeHTML.includes('class="hero-accessible-title"'), 'Home: H1 acessível ausente');
check(homeHTML.includes('preload="none"') && homeHTML.includes('heroVideo'), 'Home: vídeo com preload antecipado');
check(!homeHTML.includes('class="services-container reveal-on-scroll" style='),
      'Home: altura inline impede responsividade dos serviços');
const componentCSS = read('assets/components.css');
check(componentCSS.includes('height: clamp(260px, 78vw, 360px)'),
      'Home: altura compacta dos cards de serviços no mobile ausente');
check(componentCSS.includes('GIF animado não obedece'),
      'Footer: fallback estático para movimento reduzido ausente');
const mainScript = read('assets/script.js');
check(mainScript.includes('heroInView') && mainScript.includes('serviceVideos'), 'Home: controle de mídia por visibilidade ausente');

if (errors.length) { console.error('QA Lenses reprovado:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log('QA Lenses aprovado: tokens, CSS, preview, menus, rodapés, anchors, URLs e páginas.');
