import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { type Language, languages } from '~/i18n/ui';
import { useTranslatedPath } from '~/i18n/utils';

import { DotIcon, HeroiconsLanguage } from './ui/icons';

export default function LanguageDropdown({ lang }: { lang: Language }) {
  const translatePath = useTranslatedPath(lang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <HeroiconsLanguage className="h-5 w-5" />
          <span className="sr-only">select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([language, label]) => (
          <DropdownMenuItem key={language} className="justify-between" asChild>
            <a href={translatePath('/', language)}>
              {label}
              {language === lang && <DotIcon />}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
