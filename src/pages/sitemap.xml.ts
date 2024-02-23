import { getPostInfoList } from '~/libs/mdx';

export async function GET() {
  const siteUrl = import.meta.env.SITE;
  const posts = await getPostInfoList('all');

  const renderUrl = (slug: string, hasEn = true) => {
    let result = `<url><loc>${siteUrl}${slug}</loc></url>`;

    if (hasEn) {
      result += `<url><loc>${siteUrl}/en${slug}</loc></url>`;
    }

    return result;
  };

  const result = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${renderUrl('/')}
    ${renderUrl('/writing')}
    ${renderUrl('/note')} 
    ${renderUrl('/craft')}
    ${posts
      .map((post) => {
        const langPrefix = post.lang === 'ko' ? '' : `/${post.lang}`;
        const lastMod = (post.updatedDate ?? post.date).toISOString();
        const slug = `${langPrefix}${post.href}`;
        return `<url><loc>${siteUrl}${slug}/</loc><lastmod>${lastMod}</lastmod></url>`;
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
