import { format } from 'date-fns';

import { getPostInfoList, type PostInfo } from '~/libs/mdx';

export async function GET() {
  const siteUrl = import.meta.env.SITE;
  const posts = await getPostInfoList('all');

  const [koPosts, enPosts] = posts.reduce<[PostInfo[], PostInfo[]]>(
    ([ko, en], post) => {
      if (post.lang === 'ko') {
        ko.push(post);
      } else {
        en.push(post);
      }
      return [ko, en];
    },
    [[], []],
  );

  const renderUrl = (
    slug: string,
    {
      hasEn = true,
      lastMod,
    }: {
      hasEn?: boolean;
      lastMod?: string;
    } = {},
  ) => {
    const enSlug = `/en${slug}`;
    let result = '';

    result += '<url>';
    result += `<loc>${siteUrl}${slug}</loc>`;
    if (lastMod) {
      result += `<lastmod>${lastMod}</lastmod>`;
    }
    result += `<xhtml:link rel="alternate" hreflang="ko" href="${siteUrl}${slug}"/>`;
    if (hasEn) {
      result += `<xhtml:link rel="alternate" hreflang="en" href="${siteUrl}${enSlug}"/>`;
    }
    result += `<xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${slug}"/>`;
    result += '</url>';

    if (hasEn) {
      result += '<url>';
      result += `<loc>${siteUrl}${enSlug}</loc>`;
      if (lastMod) {
        result += `<lastmod>${lastMod}</lastmod>`;
      }
      result += `<xhtml:link rel="alternate" hreflang="en" href="${siteUrl}${enSlug}"/>`;
      result += `<xhtml:link rel="alternate" hreflang="ko" href="${siteUrl}${slug}"/>`;
      result += '</url>';
    }

    return result;
  };

  const result = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${renderUrl('/')}
    ${renderUrl('/writing')}
    ${renderUrl('/note')} 
    ${renderUrl('/craft')}
    ${koPosts
      .map((post) => {
        const lastMod = format(post.updatedDate ?? post.date, 'yyyy-MM-dd');
        const hasEn = enPosts.some((p) => p.href === post.href);

        return renderUrl(post.href, { hasEn, lastMod });
      })
      .join('\n')}
  </urlset>
  `.trim();

  return new Response(result, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
