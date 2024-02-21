import { convertToTreeBlobs, createComment, createCommit } from './github-api';
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
  const { sharpedImageList, metrics } = await sharpImages();

  console.log('::✧:: Generating Blobs…');
  const imageBlobs = await convertToTreeBlobs(sharpedImageList);

  console.log('::✧:: Committing files…');
  const commit = await createCommit({
    message: '🔥 optimize image',
    treeBlobs: imageBlobs,
  });

  console.log('::✧:: Generating markdown…');
  // prettier-ignore
  const markdown = `
Optimize Image with Sharp.

Total ${formatImages(metrics.totalFiles)}, Optimized ${formatImages(metrics.sharpFiles)}.
Reduced **${formatByte(metrics.savedPercent)}%**, Saving **${formatByte(metrics.savedBytes)}**.

${sharpedImageList.map((image) =>`
| Filename | Before | After | Improvement |
| -------- | ------ | ----- | ----------- |
| <code>${image.name}</code> | ${formatByte(image.beforeSize)} | ${formatByte(image.afterSize)} | -${image.percentChange}% |
`.trim()).join('')}

commit ${commit.sha}
`.trim();

  console.log('::✧:: Writing comment on PR…');
  await createComment(markdown);
})();
