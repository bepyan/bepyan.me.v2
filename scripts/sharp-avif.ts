// import { unlink } from 'node:fs/promises';

import { Glob } from 'bun';
import sharp from 'sharp';

(async () => {
  const glob = new Glob(`public/img/**/*.png`);

  for await (const filePath of glob.scan('.')) {
    const filename = filePath.split('/').pop()!;

    await sharp(filePath)
      .toFormat('avif')
      .avif()
      .toFile(filename + '.avif');

    // await unlink(filePath);
  }
})();
