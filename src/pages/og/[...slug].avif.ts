import type { APIContext } from 'astro';
import { format } from 'date-fns';

import { getPostCollection } from '~/libs/mdx';
import { generateOgImage } from '~/libs/og-image';

const posts = await getPostCollection();

export function getStaticPaths() {
  return posts.map((post) => ({
    params: { slug: post.slug },
  }));
}

export async function GET(ctx: APIContext) {
  const post = posts.find((post) => post.slug === ctx.params.slug);
  if (!post) return ctx.rewrite('/404');

  const ogImage = await generateOgImage({
    title: post.data.title,
    desc: format(post.data.date, 'MMM dd, yyyy'),
  });

  return new Response(ogImage, {
    status: 200,
    headers: {
      'Content-Type': 'image/avif',
    },
  });
}
