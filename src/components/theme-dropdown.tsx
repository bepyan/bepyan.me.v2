import { useStore } from '@nanostores/react';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { DotIcon, MoonIcon, SunIcon } from '~/components/ui/icons';
import { THEME_MAP, type ThemeKey, themeStore } from '~/libs/stores/theme';

export default function ThemeDropdown() {
  const theme = useStore(themeStore);

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
        {Object.keys(THEME_MAP).map((key) => {
          const themeKey = key as ThemeKey;
          return (
            <DropdownMenuItem
              key={key}
              className="justify-between capitalize"
              onClick={() => themeStore.set(THEME_MAP[themeKey])}
            >
              {themeKey}
              {theme === THEME_MAP[themeKey] && <DotIcon />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
