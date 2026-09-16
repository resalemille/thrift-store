// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://thrift-store.resalemille.online',
  base: process.env.ASTRO_BASE_PATH || '/',

  vite: {
    plugins: [tailwindcss()],
  },
});
