import { unlink } from 'node:fs/promises';

import Bun, { Glob } from 'bun';
import sharp from 'sharp';

(async () => {
  console.log('🚀 start sharp images');
  const glob = new Glob('public/img/**/*.png');

  for await (const filePath of glob.scan('.')) {
    try {
      console.log('✧', filePath);

      const sharpedFilePath = filePath.replace('.png', '.sharp.png');
      await sharp(filePath).png().toFile(sharpedFilePath);
      const sharpedFile = Bun.file(sharpedFilePath);
      await Bun.write(filePath, sharpedFile);
      await unlink(sharpedFilePath);
    } catch (e) {
      console.error(e);
    }
  }

  const webpGlob = new Glob('public/img/**/*.webp');

  for await (const filePath of webpGlob.scan('.')) {
    try {
      console.log('✧', filePath);

      const sharpedFilePath = filePath.replace('.webp', '.sharp.webp');
      await sharp(filePath).webp().toFile(sharpedFilePath);
      const sharpedFile = Bun.file(sharpedFilePath);
      await Bun.write(filePath, sharpedFile);
      await unlink(sharpedFilePath);
    } catch (e) {
      console.error(e);
    }
  }
})();
