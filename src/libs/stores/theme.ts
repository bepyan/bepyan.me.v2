// import { changeGiscusTheme } from '~/components/giscus';
import { persistentAtom } from '@nanostores/persistent';
import { atom } from 'nanostores';

import { changeGiscusTheme } from '~/components/giscus';

/**
 * 웹사이트에 적용되는 Theme
 */
export type Theme = 'light' | 'dark';

export const $theme = atom<Theme>('light');

export const initThemeSubscribe = () => {
  return $theme.subscribe((theme) => {
    if (theme === 'dark') {
      changeGiscusTheme('dark');
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      changeGiscusTheme('light');
      document.documentElement.classList.remove('dark');
    }
  });
};

/**
 * 사용자가 선택하는 Theme
 */
export type UserTheme = 'light' | 'dark' | 'system';

export const USER_THEME_STORAGE_KEY = 'user_theme' as const;

export const $userTheme = persistentAtom<UserTheme>(
  USER_THEME_STORAGE_KEY,
  'system',
);

export const initUserThemeSubscribe = () => {
  $userTheme.subscribe((userTheme) => {
    const setTheme = $theme.set;

    if (userTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const hasEventListener = !!mediaQuery.addEventListener;

      const handle = (query: { matches: boolean }) => {
        setTheme(query.matches ? 'dark' : 'light');
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
    } else {
      setTheme(userTheme);
    }
  });
};
