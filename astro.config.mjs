import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// Hosted on Cloudflare Pages at the domain root: https://a-e.pages.dev/
// Override SITE_URL (and BASE_PATH only if you ever serve from a sub-path) at build time.
const site = process.env.SITE_URL || 'https://a-e.pages.dev';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
