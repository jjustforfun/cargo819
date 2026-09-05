import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://cargo819.ru',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  // i18n: default is Russian at "/", English at "/en"
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false
    }
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ru',
        locales: {
          ru: 'ru',
          en: 'en'
        }
      },
      filter: (page) => !page.includes('/api/')
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  },
  image: {
    service: { entrypoint: 'astro/assets' }
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  }
});
