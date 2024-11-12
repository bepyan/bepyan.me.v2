import rss from '@astrojs/rss';

import { SITE } from '~/consts';
import { useTranslatedPath } from '~/libs/i18n';
import { getPostInfoList } from '~/libs/mdx';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(context: any) {
  const posts = await getPostInfoList('all');

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => {
      const t = useTranslatedPath(post.lang);
      return {
        ...post,
        pubDate: new Date(post.date),
        link: t(post.href),
      };
    }),
  });
}
