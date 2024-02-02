// import { changeGiscusTheme } from '~/components/giscus';
import { persistentAtom } from '@nanostores/persistent';

import { changeGiscusTheme } from '~/components/giscus';

export const THEME_MAP = {
  light: 'light',
  dark: 'dark',
  system: undefined,
} as const;

export type ThemeKey = keyof typeof THEME_MAP;
export type Theme = (typeof THEME_MAP)[ThemeKey];

export const STORAGE_THEME_KEY = 'theme' as const;
export const $theme = persistentAtom<Theme>(
  STORAGE_THEME_KEY,
  THEME_MAP.system,
);

export const initThemeSubscribe = () => {
  const applyTheme = (theme: Theme) => {
    if (theme === THEME_MAP.dark) {
      changeGiscusTheme('dark');
      document.documentElement.classList.add('dark');
    } else if (theme === THEME_MAP.light) {
      changeGiscusTheme('light');
      document.documentElement.classList.remove('dark');
    }
  };

  return $theme.subscribe((theme) => {
    if (theme !== THEME_MAP.system) {
      applyTheme(theme);
    } else {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const hasEventListener = !!mediaQuery.addEventListener;

      const handle = (query: { matches: boolean }) => {
        applyTheme(query.matches ? 'dark' : 'light');
      };

      hasEventListener
        ? mediaQuery.addEventListener('change', handle)
        : mediaQuery.addListener(handle);
      handle(mediaQuery);

      return () => {
        hasEventListener
          ? mediaQuery.removeEventListener('change', handle)
          : mediaQuery.removeListener(handle);
      };
    }
  });
};
