import { getPostInfoList } from '~/libs/mdx';

export async function GET(origin: any, req: any, res: any) {
  const siteUrl = 'https://bepyan.me/';
  const posts = await getPostInfoList('all');
  `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
<url><loc>${siteUrl}</loc><changefreq>daily</changefreq></url>
${posts
  .map(
    (post) =>
      `<url><loc>${siteUrl}${post.href}</loc><changefreq>daily</changefreq></url>`,
  )
  .join('\n')} 
</urlset>
`.trim();
  return;
}
