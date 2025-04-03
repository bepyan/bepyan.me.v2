import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

import { SITE } from '~/consts';
import { useTranslatedPath } from '~/libs/i18n';
import { getPostInfoList } from '~/libs/mdx';

export async function GET(context: APIContext) {
  const posts = await getPostInfoList('all');

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.site,
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
