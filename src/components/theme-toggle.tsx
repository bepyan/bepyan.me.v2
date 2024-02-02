import { useStore } from '@nanostores/react';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { $userTheme } from '~/libs/stores/theme';

import { DotIcon, MoonIcon, SunIcon } from './ui/icons';

export default function ThemeToggleStore() {
  const userTheme = useStore($userTheme);

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
          onClick={() => $userTheme.set('light')}
        >
          Light
          {userTheme === 'light' && <DotIcon />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="justify-between"
          onClick={() => $userTheme.set('dark')}
        >
          Dark
          {userTheme === 'dark' && <DotIcon />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="justify-between"
          onClick={() => $userTheme.set('system')}
        >
          System
          {userTheme === 'system' && <DotIcon />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
