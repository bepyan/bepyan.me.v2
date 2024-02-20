import { createComment } from './github-api';
import { sharpImages } from './sharp-api';

(async () => {
  await sharpImages();
  await createComment('test comment');
})();
