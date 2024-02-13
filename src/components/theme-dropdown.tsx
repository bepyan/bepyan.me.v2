import { useStore } from '@nanostores/react';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { THEME_MAP, theme$ } from '~/libs/stores/theme';

import { DotIcon, MoonIcon, SunIcon } from './ui/icons';

export default function ThemeDropdown() {
  const theme = useStore(theme$);

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
          onClick={() => theme$.set(THEME_MAP.light)}
        >
          Light
          {theme === THEME_MAP.light && <DotIcon />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="justify-between"
          onClick={() => theme$.set(THEME_MAP.dark)}
        >
          Dark
          {theme === THEME_MAP.dark && <DotIcon />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="justify-between"
          onClick={() => theme$.set(THEME_MAP.system)}
        >
          System
          {theme === THEME_MAP.system && <DotIcon />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
