// @ts-check
// Trigger sync: 2026-04-10T14:59
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://whisper-eho.netlify.app/',
  vite: {
    plugins: [tailwindcss()]
  },

  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  },

  integrations: [
    react(), 
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex]
    }), 
    sitemap()
  ]
});