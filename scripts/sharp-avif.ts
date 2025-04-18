import { readFile, unlink, writeFile } from 'node:fs/promises';

import { Glob } from 'bun';
import sharp from 'sharp';

const config = {
  imageGlobPattern: 'public/img/**/*.png',
  ignoreList: ['og1.png', 'og2.png'],
};

async function updateMdx(oldName: string, newName: string) {
  const mdxGlob = new Glob('src/content/post/**/*.mdx');
  const files = await Array.fromAsync(mdxGlob.scan('.'));

  await Promise.all(
    files.map(async (mdxPath) => {
      try {
        const content = await readFile(mdxPath, 'utf-8');
        const updatedContent = content.replaceAll(oldName, newName);

        if (content !== updatedContent) {
          await writeFile(mdxPath, updatedContent, 'utf-8');
          console.log(`✦ Updated references in ${mdxPath}`);
        }
      } catch (e) {
        console.error(`Error updating MDX file ${mdxPath}:`, e);
      }
    }),
  );
}

async function convertImages() {
  const glob = new Glob(config.imageGlobPattern);
  const files = await Array.fromAsync(glob.scan('.'));

  await Promise.all(
    files.map(async (filePath) => {
      const filename = filePath.split('/').pop()!;

      if (config.ignoreList.includes(filename)) {
        return;
      }

      try {
        await sharp(filePath)
          .toFormat('avif')
          .avif()
          .toFile(filePath.replace('.png', '.avif'));

        await updateMdx(filename, filename.replace('.png', '.avif'));
        await unlink(filePath);

        console.log(`✦ ${filePath} converted to AVIF`);
      } catch (e) {
        console.error(e);
        console.log(`✧ ${filePath} error`);
      }
    }),
  );
}

convertImages().catch(console.error);
