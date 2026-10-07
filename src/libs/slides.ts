import { sortDateDesc } from './mdx';

export type SlideMeta = {
  title: string;
  date: Date;
  /** 발표 행사명 */
  event?: string;
  description?: string;
};

export type SlideInfo = SlideMeta & {
  slug: string;
  href: string;
};

// 발표 자료마다 src/pages/slides/<slug>/_meta.ts 에서 default export
const metaModules = import.meta.glob<{ default: SlideMeta }>(
  '/src/pages/slides/*/_meta.ts',
  { eager: true },
);

const toSlideInfo = ([path, module]: [
  string,
  { default: SlideMeta },
]): SlideInfo => {
  const slug = path.split('/').at(-2)!;
  const meta = module.default;

  if (!meta?.title || !(meta.date instanceof Date)) {
    throw new Error(`[slides] ${path}: title, date 필드가 필요합니다.`);
  }

  return { ...meta, slug, href: `/slides/${slug}` };
};

export const getSlideList = (): SlideInfo[] =>
  Object.entries(metaModules).map(toSlideInfo).sort(sortDateDesc);
