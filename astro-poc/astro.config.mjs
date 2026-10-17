import { defineConfig } from 'astro/config';

// Prova de conceito isolada. NÃO há deploy automático.
// A base corresponde à URL atual do GitHub Pages.
export default defineConfig({
  site: 'https://idedigitalbr.github.io',
  base: '/site-lenses',
  trailingSlash: 'always',
  output: 'static',
});
