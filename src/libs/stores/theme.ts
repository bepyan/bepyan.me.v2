import { persistentAtom } from '@nanostores/persistent';
import { onMount } from 'nanostores';

import { changeGiscusTheme } from '~/components/giscus';

export const THEME_MAP = {
  light: 'light',
  dark: 'dark',
  system: undefined,
} as const;

export type ThemeKey = keyof typeof THEME_MAP;
export type ThemeValue = (typeof THEME_MAP)[ThemeKey];

export const STORAGE_THEME_KEY = 'theme' as const;

export const themeStore = persistentAtom<ThemeValue>(
  STORAGE_THEME_KEY,
  THEME_MAP.system,
);

const initThemeStoreSubscribe = () => {
  const applyTheme = (theme: ThemeValue) => {
    if (theme === THEME_MAP.dark) {
      changeGiscusTheme('dark');
      document.documentElement.classList.add('dark');
    } else if (theme === THEME_MAP.light) {
      changeGiscusTheme('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const handleMediaQuery = (query: { matches: boolean }) => {
    applyTheme(query.matches ? THEME_MAP.dark : THEME_MAP.light);
  };

  themeStore.subscribe((theme) => {
    if (theme !== THEME_MAP.system) {
      applyTheme(theme);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (mediaQuery.addEventListener) {
      mediaQuery.removeEventListener('change', handleMediaQuery);
      mediaQuery.addEventListener('change', handleMediaQuery);
    } else {
      mediaQuery.removeListener(handleMediaQuery);
      mediaQuery.addListener(handleMediaQuery);
    }
    handleMediaQuery(mediaQuery);
  });
};

if (typeof window !== 'undefined') {
  onMount(themeStore, () => {
    initThemeStoreSubscribe();
  });
}
