import {defineConfig} from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Isolado na branch experiment/astro-lenses-poc: NUNCA publica no Pages.
// Tailwind 4 via plugin Vite, sem @astrojs/tailwind legado.
export default defineConfig({
  site: 'https://idedigitalbr.github.io',
  base: '/site-lenses',
  trailingSlash: 'always',
  output: 'static',
  // Importantíssimo: não comprimir os espaços do markup migrado.
  compressHTML: false,
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss()] },
});
