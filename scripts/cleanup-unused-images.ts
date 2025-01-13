import { readFile, unlink } from 'node:fs/promises';

import { Glob } from 'bun';

async function readContent(path: string) {
  try {
    const imgGlob = new Glob(`src/content/post/ko/**/${path}.mdx`);

    for await (const filePath of imgGlob.scan('.')) {
      const content = await readFile(filePath, 'utf-8');
      return content;
    }
  } catch (e) {
    console.log(e);
  }
  return '';
}

async function cleanupUnusedImages() {
  const imgGlob = new Glob('public/img/**/*');
  const filesToProcess = [];

  // 먼저 모든 파일 경로를 수집
  for await (const filePath of imgGlob.scan('.')) {
    const fileList = filePath.split('/');
    const imgFilename = fileList.pop()!;
    const mdxFilename = fileList.pop()!;

    if (mdxFilename !== 'img') {
      filesToProcess.push({ filePath, imgFilename, mdxFilename });
    }
  }

  // 병렬로 파일 처리
  let removedFiles = 0;
  await Promise.all(
    filesToProcess.map(async ({ filePath, imgFilename, mdxFilename }) => {
      const content = await readContent(mdxFilename);
      if (!content.includes(imgFilename)) {
        await unlink(filePath);
        removedFiles += 1;
        console.log(`✦ ${filePath} removed`);
      }
    }),
  );

  const metrics = {
    totalFiles: filesToProcess.length,
    removedFiles,
  };

  console.log('✧ cleanup metrics');
  console.log(metrics);
}

cleanupUnusedImages().catch(console.error);
