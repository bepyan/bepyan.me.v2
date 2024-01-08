import rss from '@astrojs/rss';

import { SITE } from '~/consts';
import { getPostInfoList } from '~/libs/mdx';

export async function GET(context: any) {
  const posts = await getPostInfoList('all');

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      ...post,
      pubDate: new Date(post.date),
      link: post.href,
    })),
  });
}
