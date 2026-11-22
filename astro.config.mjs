import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// GitHub Pages project site: https://contractorarsenal.github.io/a-e/
// Override SITE_URL / BASE_PATH at build time for a custom domain (BASE_PATH="" for a domain root).
const site = process.env.SITE_URL || 'https://contractorarsenal.github.io';
const base = process.env.BASE_PATH ?? '/a-e';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
