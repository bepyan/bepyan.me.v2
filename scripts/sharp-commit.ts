import { createPRComment } from './github-api';

(async () => {
  await createPRComment('test comment');
})();
