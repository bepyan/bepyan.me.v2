import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

import { SITE } from '~/consts';

export async function GET(context: any) {
  const [writings, notes] = await Promise.all([
    getCollection('writing'),
    getCollection('note'),
  ]);
  const posts = [...writings, ...notes];

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      pubDate: post.data.date,
      link: `/post/${post.slug}`,
    })),
  });
}
