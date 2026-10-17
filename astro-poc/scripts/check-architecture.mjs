/**
 * Static gates before any Astro+Tailwind build, no dependencies needed.
 * The visual check is separate; this deliberately cannot prove pixel parity.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const proj=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(proj,p),'utf8');
const pkg=JSON.parse(read('package.json'));
const originalTokens=fs.readFileSync(path.join(proj,'..','assets','tokens.css'),'utf8');
const twTheme=read('src/styles/tailwind.css');
const official=new Set([...originalTokens.matchAll(/(--[\w-]+)\s*:/g)].map(m=>m[1]));
const bindings=[...twTheme.matchAll(/:\s*var\((--[\w-]+)\)/g)].map(m=>m[1]);
const checks=[
 ['Todos os aliases Tailwind existem nos tokens oficiais',bindings.length>=15&&bindings.every(v=>official.has(v))],
 ['Astro 7',String(pkg.dependencies.astro).startsWith('^7.')],
 ['Tailwind CSS 4',String(pkg.dependencies.tailwindcss).startsWith('^4.')],
 ['Tailwind Vite 4',String(pkg.dependencies['@tailwindcss/vite']).startsWith('^4.')],
 ['Astro Tailwind plugin',read('astro.config.mjs').includes('tailwindcss()')],
 ['Base path GitHub Pages',read('astro.config.mjs').includes("base: '/site-lenses'")],
 ['Tailwind tokens canônicos',read('src/styles/tailwind.css').includes('var(--color-brand-saboia)')],
 ['Sem Preflight reset',!read('src/styles/tailwind.css').includes('@import "tailwindcss/preflight.css"')],
 ['Sem Swiper',!JSON.stringify(pkg).toLowerCase().includes('swiper')],
 ['Sem Lenis',!JSON.stringify(pkg).toLowerCase().includes('lenis')],
 ['Vitrine usa componentes reais',read('src/pages/design-system/index.astro').includes('StatCard')],
 ['Case usa o mesmo componente',read('src/components/CaseArticle.astro').includes('StatCard')],
 ['Home sem redesenho',read('src/pages/index.astro').includes('LegacyMirror')],
 ['Bellamazon sem redesenho',read('src/pages/casev2/bellamazon/index.astro').includes('LegacyMirror')],
 ['Sem deploy automático',!fs.existsSync(path.join(proj,'.github','workflows','deploy.yml'))],
];
const bad=checks.filter(([,ok])=>!ok);
checks.forEach(([label,ok])=>console.log((ok?'PASS':'FAIL')+' '+label));
if(bad.length)process.exitCode=1;
