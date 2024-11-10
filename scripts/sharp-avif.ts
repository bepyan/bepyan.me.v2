// import { unlink } from 'node:fs/promises';

import { Glob } from 'bun';
import sharp from 'sharp';

const ignoreList = ['og1.png', 'og2.png'];

(async () => {
  const glob = new Glob(`public/img/**/*.png`);

  for await (const filePath of glob.scan('.')) {
    const filename = filePath.split('/').pop()!;

    if (ignoreList.includes(filename)) {
      continue;
    }

    try {
      await sharp(filePath)
        .toFormat('avif')
        .avif()
        .toFile(filePath.replace('.png', '.avif'));

      // await unlink(filePath);
      // 마크다운에서 .png 부분을 .avif로 변경하는 코드 추가 필요

      console.log(`✦ ${filePath} complete`);
    } catch (e) {
      console.error(e);
      console.log(`✧ ${filePath} error`);
    }
  }
})().then(console.error);
