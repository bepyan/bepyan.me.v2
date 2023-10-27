import { UndoIcon } from '~/components/ui/icons';
import { cn } from '~/libs/utils';

import { Button } from './ui/button';

type Props = {
  href: string;
  children?: React.ReactNode;
};

export default function BaseNav({ href, children }: Props) {
  const onNavigate = (href: string) => {
    window.location.href = href;
  };

  return (
    <nav
      className={cn('sticky top-page flex flex-col', 'md:relative md:top-0')}
    >
      <div className="flex items-center">
        <Button onClick={() => onNavigate(href)} variant="ghost" size="icon">
          <UndoIcon className="h-5 w-5" />
        </Button>
      </div>
      {children}
    </nav>
  );
}
