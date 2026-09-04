import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://gethighandfly.com',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          ru: 'ru-RU',
          vi: 'vi-VN',
        },
      },
    }),
  ],
  i18n: {
    locales: ['en', 'ru', 'vi'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
