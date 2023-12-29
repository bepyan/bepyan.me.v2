import { defaultLang, type Language, ui } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Language;
  return defaultLang;
}

export function useTranslations(lang: Language) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: Language) {
  return function translatePath(path: string, l: string = lang) {
    return l === defaultLang ? path : `/${l}${path}`;
  };
}

export function useI18n(url: URL) {
  const lang = getLangFromUrl(url);
  const p = useTranslatedPath(lang);
  const t = useTranslations(lang);
  return { lang, p, t };
}

export function getCurrentPathname(url: URL) {
  const [, lang, ...pathname] = url.pathname.split('/');
  if (lang in ui) return `/${pathname.join('/')}`;
  return url.pathname;
}
