import { unlink } from 'node:fs/promises';

import Bun, { Glob } from 'bun';
import sharp from 'sharp';

const SHARP_OPTIONS: {
  png: sharp.PngOptions;
  webp: sharp.WebpOptions;
} = {
  png: {},
  webp: {},
};

type SharpFileType = keyof typeof SHARP_OPTIONS;
const SHARP_FILE_TYPE_LIST = ['png', 'webp'] as const satisfies SharpFileType[];

export type ProcessedImage = {
  name: string;
  path: string;
  beforeStats: number;
  afterStats: number;
  percentChange: number;
};

export const sharpImages = async () => {
  console.log('::✧:: start sharp images');

  const sharpedImageList: ProcessedImage[] = [];
  const unSharpedImageList: ProcessedImage[] = [];

  const glob = new Glob(`public/img/**/*.{${SHARP_FILE_TYPE_LIST.join(',')}}`);

  for await (const filePath of glob.scan('.')) {
    try {
      console.log('✧', filePath);
      const fileType = filePath.split('.').pop() as SharpFileType;

      const sharpedFilePath = filePath.replace(
        `.${fileType}`,
        `.sharp.${fileType}`,
      );

      await sharp(filePath)
        [fileType](SHARP_OPTIONS[fileType])
        .toFile(sharpedFilePath);

      const file = Bun.file(filePath);
      const sharpedFile = Bun.file(sharpedFilePath);

      if (file.size > sharpedFile.size) {
        console.log('✧✧ processing', file.size, '>', sharpedFile.size);
        await Bun.write(filePath, sharpedFile);

        sharpedImageList.push({
          name: filePath,
          path: sharpedFilePath,
          beforeStats: file.size,
          afterStats: sharpedFile.size,
          percentChange: Math.round((1 - sharpedFile.size / file.size) * 100),
        });
      } else {
        unSharpedImageList.push({
          name: filePath,
          path: sharpedFilePath,
          beforeStats: file.size,
          afterStats: sharpedFile.size,
          percentChange: Math.round((1 - sharpedFile.size / file.size) * 100),
        });
      }

      await unlink(sharpedFilePath);
    } catch (e) {
      console.log('::error::', e);
    }
  }

  return {
    sharpedImageList,
    unSharpedImageList,
  };
};
