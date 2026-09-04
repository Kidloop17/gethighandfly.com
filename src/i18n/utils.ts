export type Lang = 'en' | 'ru' | 'vi';

export const LANGS: Lang[] = ['en', 'ru', 'vi'];

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'ru' || lang === 'vi') return lang;
  return 'en';
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    // TODO: load from JSON at runtime (dev) or build-time import
    return key;
  };
}
