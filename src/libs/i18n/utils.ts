import { defaultLang, type Language, languages, ui } from './ui';

export function getLangFromUrl(url: URL) {
  return getLangFromSlug(url.pathname);
}

export function getLangFromSlug(slug: string) {
  for (const lang in languages) {
    if (slug.includes(`/${lang}/`) || slug.startsWith(`${lang}/`)) {
      return lang as Language;
    }
  }

  return defaultLang;
}

export function useTranslatedPath(lang: Language) {
  return function translatePath(path: string, l: string = lang) {
    return l === defaultLang ? path : `/${l}${path}`;
  };
}

export function useTranslations(lang: Language) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useI18n(url: URL) {
  const lang = getLangFromUrl(url);
  const p = useTranslatedPath(lang);
  const t = useTranslations(lang);
  return { lang, p, t };
}

/**
 * @example /post/en/slug -> /post/slug
 * @example /en/writing -> /writing
 */
export function getDefaultPathname(url: string | URL) {
  let result = typeof url === 'string' ? url : url.pathname;

  for (const lang in languages) {
    result = result.replace(`/${lang}/`, '/');
  }

  return result;
}
