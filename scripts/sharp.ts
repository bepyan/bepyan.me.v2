import { sharpImages } from './sharp-api';

(async () => {
  const result = await sharpImages();
  console.log('::✧:: sharp result', result.metrics);
})();
