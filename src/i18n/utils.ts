import en from './en.json';
import ru from './ru.json';
import vi from './vi.json';

export type Lang = 'en' | 'ru' | 'vi';

export const LANGS: Lang[] = ['en', 'ru', 'vi'];

const translations: Record<Lang, Record<string, string>> = { en, ru, vi };

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'ru' || lang === 'vi') return lang;
  return 'en';
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    return translations[lang][key] ?? translations['en'][key] ?? key;
  };
}
