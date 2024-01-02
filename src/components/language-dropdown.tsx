import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { defaultLang, type Language, languages } from '~/i18n/ui';
import { getDefaultPathname, useI18n } from '~/i18n/utils';

import { DotIcon, HeroiconsLanguage } from './ui/icons';

export default function LanguageDropdown({ url }: { url: URL }) {
  const { lang, p } = useI18n(url);

  const pathname = getDefaultPathname(url);

  const resolvePath = (language: Language) => {
    if (language !== defaultLang && pathname.startsWith('/post/')) {
      const [...slug] = pathname.split('/post/');
      return `/post/${language}/${slug.join('')}`;
    }

    return p(pathname, language);
  };

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
            <a href={resolvePath(language as Language)}>
              {label}
              {language === lang && <DotIcon />}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
