// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://anmarivanderwesthuizen.com',
  integrations: [mdx(), sitemap()],

  image: {
    domains: ["anmari.trespaul.com"],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});