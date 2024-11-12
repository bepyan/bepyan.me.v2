import { unlink } from 'node:fs/promises';

import Bun, { Glob } from 'bun';
import sharp from 'sharp';

export const SHARP_OPTIONS: {
  png: sharp.PngOptions;
  jpeg: sharp.JpegOptions;
  webp: sharp.WebpOptions;
} = {
  png: {},
  jpeg: {},
  webp: {},
};
export type SharpOptionType = keyof typeof SHARP_OPTIONS;

export const SHARP_OPTIONS_TYPE_MAPPER = {
  png: 'png',
  jpg: 'jpeg',
  jpeg: 'jpeg',
  webp: 'webp',
} as const satisfies { [key: string]: SharpOptionType };
export type SharpFileType = keyof typeof SHARP_OPTIONS_TYPE_MAPPER;

const SHARP_FILE_TYPE_LIST = Object.keys(SHARP_OPTIONS_TYPE_MAPPER);

export type ProcessedResult = {
  name: string;
  path: string;
  beforeSize: number;
  afterSize: number;
  percentChange: number;
};

export const sharpImages = async () => {
  console.log('::✧:: start sharp images');

  const sharpedImageList: ProcessedResult[] = [];
  const unSharpedImageList: ProcessedResult[] = [];

  const glob = new Glob(`public/img/**/*.{${SHARP_FILE_TYPE_LIST.join(',')}}`);

  for await (const filePath of glob.scan('.')) {
    try {
      console.log('✧', filePath);
      const filename = filePath.split('/').pop() ?? '';
      const fileType = filePath.split('.').pop() as SharpFileType;

      const sharpOptionType = SHARP_OPTIONS_TYPE_MAPPER[fileType];
      const sharpOption = SHARP_OPTIONS[sharpOptionType];

      const sharpedFilePath = filePath.replace(
        `.${fileType}`,
        `.sharp.${fileType}`,
      );

      // prettier-ignore
      await sharp(filePath)[sharpOptionType](sharpOption).toFile(sharpedFilePath);

      const file = Bun.file(filePath);
      const sharpedFile = Bun.file(sharpedFilePath);

      const processedResult: ProcessedResult = {
        name: filename,
        path: filePath,
        beforeSize: file.size,
        afterSize: sharpedFile.size,
        percentChange: +((1 - sharpedFile.size / file.size) * 100).toFixed(2),
      };

      if (processedResult.percentChange > 1) {
        await Bun.write(filePath, sharpedFile);

        sharpedImageList.push(processedResult);
      } else {
        unSharpedImageList.push(processedResult);
      }

      await unlink(sharpedFilePath);
    } catch (e) {
      console.log('::error::', e);
    }
  }

  const sharpBeforeSize = sharpedImageList.reduce(
    (ac, v) => ac + v.beforeSize,
    0,
  );
  const sharpAfterSize = sharpedImageList.reduce(
    (ac, v) => ac + v.afterSize,
    0,
  );
  const metrics = {
    totalFiles: sharpedImageList.length + unSharpedImageList.length,
    sharpFiles: sharpedImageList.length,
    sharpBeforeSize,
    sharpAfterSize,
    savedBytes: sharpBeforeSize - sharpAfterSize,
    savedPercent:
      sharpBeforeSize > 0
        ? +((1 - sharpAfterSize / sharpBeforeSize) * 100).toFixed(2)
        : 0,
  };

  console.log('✧ sharp metrics');
  console.log(metrics);

  return {
    sharpedImageList,
    unSharpedImageList,
    metrics,
  };
};
