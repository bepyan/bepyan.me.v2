import { useEffect, useState } from 'react';

import { changeGiscusTheme } from '~/components/giscus';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import { DotIcon, MoonIcon, SunIcon } from './ui/icons';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>();

  const changeTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      changeGiscusTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      changeGiscusTheme('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const listenDarkMode = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handle = (query: { matches: boolean }) => {
      changeTheme(query.matches ? 'dark' : 'light');
    };

    const hasEventListener = !!mediaQuery.addEventListener;

    hasEventListener
      ? mediaQuery.addEventListener('change', handle)
      : mediaQuery.addListener(handle);
    handle(mediaQuery);

    return () => {
      hasEventListener && mediaQuery.removeEventListener('change', handle);
    };
  };

  useEffect(() => {
    setTheme(localStorage.getItem('theme') ?? 'system');
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      changeTheme('light');
      localStorage.setItem('theme', theme);
    } else if (theme === 'dark') {
      changeTheme('dark');
      localStorage.setItem('theme', theme);
    } else if (theme === 'system') {
      localStorage.removeItem('theme');
      return listenDarkMode();
    }
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="justify-between"
          onClick={() => setTheme('light')}
        >
          Light
          {theme === 'light' && <DotIcon />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="justify-between"
          onClick={() => setTheme('dark')}
        >
          Dark
          {theme === 'dark' && <DotIcon />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="justify-between"
          onClick={() => setTheme('system')}
        >
          System
          {theme === 'system' && <DotIcon />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
