# Agente Antigravity | Migração LENSES

Dentro de astro-poc/, leia MIGRATION.md antes de alterar qualquer arquivo.

O laboratório usa Astro 7 e Tailwind CSS 4 com tokens oficiais da LENSES, em experiment/astro-lenses-poc. O objetivo final é código Astro/Tailwind real, compartilhando layout e componentes, preservando visual e animações byte-a-byte ou pixel-a-pixel quando aplicável.

Nunca instalar Swiper/Lenis, nunca redesenhar o site e nunca publicar na main sem aprovação. Respeitar GSAP/ScrollTrigger, sobretudo o mosaico e cards do Bellamazon.

A P0 LegacyMirror é temporária e não significa migração concluída. Execute npm run build e npm run test:visual antes de converter qualquer seção. Converta aos poucos e exija paridade visual e funcional após cada componente.

A folha de tokens canônica é ../assets/tokens.css. O Tailwind está em src/styles/tailwind.css, importado por src/styles/system.css. O preview de design system deve importar componentes reais usados nas páginas. Não criar outro design system desconectado.
