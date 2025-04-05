import satori, { type SatoriOptions } from 'satori';
import sharp from 'sharp';

async function getFontData(url: string) {
  const fontResponse = await fetch(url);
  return await fontResponse.arrayBuffer();
}

const [AritaBuri, AritaBuriBold] = await Promise.all([
  getFontData('https://cdn.jsdelivr.net/gh/taevel02/typeface-arita/Arita-buriM.woff'),
  getFontData('https://cdn.jsdelivr.net/gh/taevel02/typeface-arita/Arita-buriB.woff'),
]);

const satoriOption: SatoriOptions = {
  width: 1200,
  height: 630,
  fonts: [
    {
      name: 'Arita Buri',
      data: AritaBuri,
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Arita Buri',
      data: AritaBuriBold,
      weight: 700,
      style: 'normal',
    },
  ],
};

export async function generateOgImage({
  title,
  desc,
  noFooter,
}: {
  title: string;
  desc?: string;
  noFooter?: boolean;
}) {
  const svg = await satori(
    <div
      style={{
        // 폰트 설정
        fontFamily: 'Arita Buri',
        // 스타일 설정
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '16px',
        height: '100%',
        width: '100%',
        padding: '80px',
        color: '#000',
        backgroundColor: '#fff',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='199' viewBox='0 0 100 199'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Cpath d='M0 199V0h1v1.99L100 199h-1.12L1 4.22V199H0zM100 2h-.12l-1-2H100v2z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div style={{ fontSize: '64px', fontWeight: 700 }}>{title}</div>
      {desc && <div style={{ marginTop: '20px', fontSize: '32px', color: '#464646' }}>{desc}</div>}
      {!noFooter && (
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '80px',
            fontSize: '32px',
            color: '#464646',
          }}
        >
          bepyan.me
        </div>
      )}
    </div>,
    satoriOption,
  );

  const image = sharp(Buffer.from(svg)).png({
    compressionLevel: 9,
    adaptiveFiltering: true,
    palette: true,
    quality: 80,
  });
  return await image.toBuffer();
}
