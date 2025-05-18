import { throttle } from 'es-toolkit';
import { ChevronDownIcon } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import ProgressCircular from '~/components/ui/progress-circular';
import { cn } from '~/libs/utils';

interface DynamicTocProps {
  title: string;
}

export default function DynamicToc({ title }: DynamicTocProps) {
  const isHidden = useIsHidden();
  const { rootRef, expanded, setExpanded } = useExpanded();
  const { progress } = useArticleScrollProgress();
  const { allSections, activeSectionId } = useActiveSections();

  return (
    <div
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2"
      aria-label="Table of contents"
    >
      <AnimatePresence initial={false} mode="wait">
        {!isHidden && (
          <motion.div
            variants={{
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  delay: 0.1,
                  y: {
                    type: 'spring',
                    bounce: 0.4,
                  },
                  opacity: {
                    duration: 0.2,
                  },
                },
              },
              hidden: {
                y: -68,
                opacity: 0,
                transition: {
                  delay: 0.4,
                  y: {
                    type: 'spring',
                    bounce: 0.4,
                  },
                  opacity: {
                    duration: 0.2,
                  },
                },
              },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              aria-expanded={expanded}
              tabIndex={0}
              ref={rootRef}
              layout
              className="relative max-w-[300px] min-w-[150px] bg-gray-200/70 backdrop-blur-md backdrop-saturate-[1.15] select-none sm:max-w-[400px]"
              style={{
                borderRadius: expanded ? 16 : 300,
                padding: expanded ? '16px 16px' : '8px 12px',
                width: expanded ? '400px' : 'fit-content',
                cursor: expanded ? 'default' : 'pointer',
              }}
              transition={{
                type: 'spring',
                bounce: expanded ? 0.3 : 0.25,
              }}
              whileTap={{
                scale: expanded ? 1 : 0.9,
              }}
              whileHover={{
                scale: expanded ? 1 : 1.1,
              }}
              onClick={() => setExpanded(!expanded)}
            >
              <motion.div layout="position" className="flex">
                <ProgressCircular
                  progress={progress}
                  className="sm:translate-y-[2px]"
                />
                <span className="text-heading ml-1.5 inline-block truncate font-serif text-sm font-bold sm:ml-1">
                  {title}
                </span>
                <ChevronDownIcon
                  className={cn(
                    'ml-0.5 inline-block size-4 cursor-pointer transition-transform duration-300 ease-in-out',
                    expanded
                      ? 'translate-y-[2px]'
                      : 'translate-y-[1px] rotate-180',
                  )}
                />
              </motion.div>
              {expanded && (
                <motion.div
                  layout="size"
                  initial={{
                    opacity: 0,
                    filter: 'blur(2px)',
                  }}
                  animate={{
                    opacity: 1,
                    filter: 'blur(0px)',
                    transition: {
                      delay: 0.15,
                    },
                  }}
                  transition={{
                    type: 'spring',
                    bounce: expanded ? 0.3 : 0.25,
                  }}
                  key={expanded ? 'list' : 'title'}
                >
                  <div className="mt-2 text-xs">
                    {Array.from(allSections).map((section) => (
                      <div
                        key={section.id}
                        className="relative flex items-center pl-3"
                      >
                        <AnimatePresence mode="popLayout">
                          {section.id === activeSectionId && (
                            <motion.div
                              layoutId="active-section-dot"
                              className="absolute left-0"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                type: 'spring',
                                bounce: 0.25,
                              }}
                            >
                              <div className="size-1 shrink-0 rounded-full bg-gray-700" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <a
                          href={`#${section.id}`}
                          onClick={(e) => e.stopPropagation()}
                          aria-current={
                            section.id === activeSectionId ? 'true' : undefined
                          }
                          className={cn(
                            'hover:text-heading text-second inline-block py-1 transition-colors duration-200 ease-in-out',
                            section.id === activeSectionId && 'text-heading',
                          )}
                        >
                          {section.textContent}
                        </a>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function useIsHidden() {
  const [isHidden, setIsHidden] = useState(true);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    headerRef.current = document.querySelector<HTMLDivElement>('main > header');
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsHidden(entry.isIntersecting);
      });
    });

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }
    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  return isHidden;
}

function useExpanded() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (expanded && !rootRef.current?.contains(event.target as Node)) {
        setExpanded(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && expanded) {
        setExpanded(false);
      }
    };

    if (expanded) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    } else {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [expanded]);

  return {
    rootRef,
    expanded,
    setExpanded,
  };
}

function useArticleScrollProgress() {
  const articleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    articleRef.current =
      document.querySelector<HTMLDivElement>('main > article.mdx');
  }, []);

  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return { progress };
}

function useActiveSections() {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const allSections = useMemo(() => document.querySelectorAll('h2'), []);

  useEffect(() => {
    if (allSections.length === 0) return;

    let headings: { id: string; top: number }[];
    let pageTop = 0;

    const onResize = () => {
      headings = Array.from(allSections).map((element) => ({
        id: element.id,
        top: element.offsetTop,
      }));

      // 페이지 상단 여백 계산
      pageTop = parseFloat(
        window
          .getComputedStyle(document.documentElement)
          .getPropertyValue('--page-top')
          .match(/[\d.]+/)?.[0] ?? '0',
      );
    };

    const onScroll = throttle(() => {
      if (!headings) return;

      const top = window.scrollY + pageTop;
      const HEADING_OFFSET = 10;

      // 현재 보이는 섹션 찾기
      let currentId: string | null = null;
      headings.forEach((heading) => {
        if (top >= heading.top - HEADING_OFFSET) {
          currentId = heading.id;
        }
      });
      setActiveSectionId(currentId);
    }, 10);

    onResize();
    onScroll();
    window.addEventListener('scroll', onScroll, { capture: true });
    window.addEventListener('resize', onResize, { capture: true });
    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onResize, { capture: true });
    };
  }, [allSections]);

  return {
    allSections,
    activeSectionId,
  };
}
