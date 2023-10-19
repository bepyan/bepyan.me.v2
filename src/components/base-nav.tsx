import { UndoIcon } from '~/components/ui/icons';
import { cn } from '~/libs/utils';

import { Button } from './ui/button';

type Props = {
  href: string;
};

export default function BaseNav({ href }: Props) {
  const onClick = () => {
    window.location.href = href;
  };

  return (
    <nav
      className={cn(
        'sticky top-page flex items-center font-serif leading-7',
        'md:relative md:top-0',
      )}
    >
      <Button onClick={onClick} variant="ghost" size="icon">
        <UndoIcon className="h-5 w-5" />
      </Button>
      <slot />
    </nav>
  );
}
