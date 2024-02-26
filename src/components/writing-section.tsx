import { format } from 'date-fns';
import { useMemo } from 'react';

import type { Language } from '~/i18n/ui';
import { useTranslatedPath } from '~/i18n/utils';
import { type PostInfo, sortDateDesc } from '~/libs/mdx';

import { BxLinkExternal } from './ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export default function WritingSection({
  lang,
  posts,
}: {
  lang: Language;
  posts: PostInfo[];
}) {
  const p = useTranslatedPath(lang);

  const yearList = useMemo(() => {
    return Object.entries(
      posts
        .filter((post) => post.lang === lang)
        .reduce<{ [year: string]: PostInfo[] }>((ac, post) => {
          const year = new Date(post.date).getFullYear();
          if (!ac[year]) ac[year] = [];
          ac[year].push(post);
          return ac;
        }, {}),
    ).sort((a, b) => +b[0] - +a[0]);
  }, [posts]);

  return (
    <TooltipProvider delayDuration={300}>
      <section data-animate className="group my-14">
        {yearList.map(([year, postList], index) => {
          return (
            <div
              key={`year-${year}`}
              className=" group/year relative z-0 border-t last-of-type:border-b"
            >
              <h3 className="absolute top-5 -z-10 -mx-1.5 -my-0.5 rounded-md px-1.5 py-0.5 text-sm text-second transition group-hover/year:bg-selection group-hover/year:text-heading">
                {year}
              </h3>
              <ul data-animate>
                {postList.sort(sortDateDesc).map((post) => {
                  return (
                    <li
                      key={post.href}
                      style={{ '--lv-wait': index } as React.CSSProperties}
                    >
                      <Tooltip>
                        <a
                          href={p(post.href)}
                          className="group/item flex transition-opacity hover:!opacity-100 group-hover:opacity-40"
                          target={post.isExternal ? '_blank' : '_self'}
                        >
                          <TooltipTrigger asChild>
                            <div className="ml-[15%] flex flex-1 items-start border-t py-4 group-first-of-type/item:border-t-0">
                              <div className="flex items-center gap-0.5 text-heading">
                                <span className="mx-1 rounded-md px-1 transition group-hover/item:bg-selection">
                                  {post.title}
                                </span>
                              </div>
                              <div className="ml-auto mt-1 flex flex-shrink-0 items-center gap-1 rounded-md px-1 py-0.5 text-sm text-second transition group-hover/item:bg-selection group-hover/item:text-heading">
                                {post.isExternal && (
                                  <BxLinkExternal className="text-disabled" />
                                )}
                                <span>
                                  {format(new Date(post.date), 'MM. dd.')}
                                </span>
                              </div>
                            </div>
                          </TooltipTrigger>
                        </a>
                        {post.description && (
                          <TooltipPortal>
                            <TooltipContent
                              align="start"
                              side="bottom"
                              sideOffset={-12}
                              className="max-w-md text-second shadow-none"
                            >
                              {post.description}
                            </TooltipContent>
                          </TooltipPortal>
                        )}
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>
    </TooltipProvider>
  );
}
