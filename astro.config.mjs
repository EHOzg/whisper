// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://whisper-eho.netlify.app/',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: true
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), mdx()]
});