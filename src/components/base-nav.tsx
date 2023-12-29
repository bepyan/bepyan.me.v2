import { UndoIcon } from '~/components/ui/icons';
import { cn } from '~/libs/utils';

import { Button } from './ui/button';

type Props = {
  href: string;
  children?: React.ReactNode;
};

export default function BaseNav({ href, children }: Props) {
  const onNavigate = () => {
    window.location.href = href;
  };

  return (
    <nav
      className={cn(
        'fixed top-page flex max-w-[220px] -translate-x-[230px] flex-col',
        'transition-opacity lg:opacity-0',
        'md:relative md:top-0 md:-ml-2 md:mb-7 md:translate-x-0 md:opacity-100',
      )}
    >
      <div className="flex items-center">
        <Button
          onClick={onNavigate}
          variant="ghost"
          size="icon"
          aria-label="go back"
        >
          <UndoIcon className="h-5 w-5" />
        </Button>
      </div>
      {children}
    </nav>
  );
}
