import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://gethighandfly.com',
  i18n: {
    locales: ['en', 'ru', 'vi'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
