import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/consts.ts';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'ignore',

  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
    fallback: { en: 'pt' },
  },

  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },

  integrations: [
    tailwind({ applyBaseStyles: false, nesting: true }),
    mdx({ optimize: true }),
    sitemap({
      i18n: {
        defaultLocale: 'pt',
        locales: { pt: 'pt-BR', en: 'en-US' },
      },
      filter: (page) => !page.includes('/admin') && !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        if (/\/(finance|fitness)\/?$/.test(item.url)) item.priority = 0.9;
        if (/\/(pt|en)\/?$/.test(item.url)) item.priority = 1.0;
        return item;
      },
    }),
  ],

  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
  },

  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
    format: 'directory',
  },

  compressHTML: true,

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
    },
  },

  adapter: cloudflare()
});