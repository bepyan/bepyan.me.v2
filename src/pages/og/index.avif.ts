import { SITE } from '~/consts';
import { generateOgImage } from '~/libs/og-image';

export async function GET() {
  const ogImage = await generateOgImage({
    title: SITE.title,
    desc: SITE.description,
    noFooter: true,
  });

  return new Response(ogImage, {
    status: 200,
    headers: {
      'Content-Type': 'image/avif',
    },
  });
}
