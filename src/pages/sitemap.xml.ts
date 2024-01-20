import { getPostInfoList } from '~/libs/mdx';

export async function GET() {
  const siteUrl = import.meta.env.SITE;
  const posts = await getPostInfoList('all');
  const enPosts = posts.filter((post) => post.lang === 'en');

  const renderUrl = (slug: string, hasEn = true) => {
    const hreflang = hasEn
      ? `<xhtml:link rel="alternate" hreflang="ko" href="${siteUrl}${slug}" /><xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en${slug}" />`
      : '';

    return `<url><loc>${siteUrl}</loc>${hreflang}</url>`;
  };

  const result = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${renderUrl('/')}
    ${renderUrl('/writing')}
    ${renderUrl('/note')}
    ${renderUrl('/craft')}
    ${posts
      .filter((post) => post.lang === 'ko')
      .map((post) => {
        const lastMod = (post.updatedDate ?? post.date).toISOString();

        const hasEn = enPosts.some((item) => item.href === post.href);
        const hreflang = hasEn
          ? `<xhtml:link rel="alternate" hreflang="ko" href="https://bepyan.me${post.href}" /><xhtml:link rel="alternate" hreflang="en" href="https://bepyan.me/en${post.href}" />`
          : '';

        return `<url><loc>${siteUrl}${post.href}</loc><lastmod>${lastMod}</lastmod>${hreflang}</url>`;
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
