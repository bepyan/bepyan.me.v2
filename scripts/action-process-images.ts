import { createComment, createCommit, imageToTreeBlob } from './github-api';
import { sharpImages } from './sharp-api';

const formatByte = (byte: number) => {
  let num = +byte;
  if (num < 1024) return `${num} B`;

  num = +(byte / 1024).toFixed();
  if (num < 1024) return `${num} KB`;

  num = +(num / 1024).toFixed();
  return `${num} MB`;
};

const formatImages = (num: number) => {
  return `${num} ${num > 1 ? 'images' : 'image'}`;
};

(async () => {
  console.log('\n::✧:: Optimize images…');
  const { sharpedImageList, metrics } = await sharpImages();
  if (!sharpedImageList.length) {
    console.log('\n::✧:: No images to optimize.');
    return;
  }

  console.log('\n::✧:: Generating Blobs…');
  const imageBlobs = await Promise.all(sharpedImageList.map(imageToTreeBlob));

  console.log('\n::✧:: Committing files…');
  const commit = await createCommit({
    message: '::✧:: process images',
    treeBlobs: imageBlobs,
  });

  console.log('\n::✧:: Writing comment on PR…');
  // prettier-ignore
  const markdown = `
Optimize Image with Sharp ${commit.sha}

Detected **${formatImages(metrics.totalFiles)}**, Optimized **${formatImages(metrics.sharpFiles)}**, Reduced **${metrics.savedPercent}%**, Saved **${formatByte(metrics.savedBytes)}**.

${sharpedImageList.map((image) =>`
| Filename | Before | After | Improvement |
| -------- | ------ | ----- | ----------- |
| <code>${image.name}</code> | ${formatByte(image.beforeSize)} | ${formatByte(image.afterSize)} | -${image.percentChange}% |
`.trim()).join('')}
`.trim();
  await createComment(markdown);
})();
