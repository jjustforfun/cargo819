import { ui, defaultLang, type Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const path = url.pathname;
  if (path.startsWith('/en')) return 'en';
  return defaultLang;
}

export function translate(lang: Lang, key: string): string {
  // @ts-expect-error dynamic
  return (ui[lang] && ui[lang][key]) || (ui[defaultLang] as any)[key] || key;
}
