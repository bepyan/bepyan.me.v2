import { throttle } from 'lodash-es';
import { useEffect, useState } from 'react';

import { type TOCSection } from '~/libs/mdx';
import { cn } from '~/libs/utils';

export default function TableOfContent({
  toc,
  className,
}: {
  toc: TOCSection[];
  className?: string;
}) {
  const { currentSectionSlug } = useTocScroll(toc);

  return (
    <ul className={cn('space-y-2.5 font-sans text-sm', className)}>
      {toc.map((section, i) => (
        <li key={i} className="flex">
          <a
            className={cn(
              'text-second transition-colors hover:text-heading',
              currentSectionSlug === section.slug && 'font-medium text-body',
            )}
            href={`#${section.slug}`}
          >
            {section.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

const useTocScroll = (tableOfContents: TOCSection[]) => {
  const [currentSectionSlug, setCurrentSectionSlug] = useState<string>();

  useEffect(() => {
    if (tableOfContents.length === 0) return;

    let headings: { id: string; top: number }[];
    let pageTop = 0;

    const onResize = () => {
      headings = Array.from(
        document.querySelectorAll<HTMLElement>('.mdx h2'),
      ).map((element) => ({
        id: element.id,
        top: element.offsetTop,
      }));

      pageTop = parseFloat(
        window
          .getComputedStyle(document.documentElement)
          .getPropertyValue('--page-top')
          .match(/[\d.]+/)?.[0] ?? '0',
      );
    };

    const onScroll = throttle(() => {
      if (!headings) return;

      let current: typeof currentSectionSlug = undefined;
      const top = window.scrollY + pageTop;

      for (let i = 0; i < headings.length; i++) {
        if (top >= headings[i].top) {
          current = headings[i].id;
        }
      }

      setCurrentSectionSlug(current);
    }, 300);

    onResize();
    onScroll();
    window.addEventListener('scroll', onScroll, { capture: true });
    window.addEventListener('resize', onResize, { capture: true });
    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onResize, { capture: true });
    };
  }, [tableOfContents]);

  return { currentSectionSlug };
};
