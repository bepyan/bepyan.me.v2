import { createPRComment } from './github-api';

(async () => {
  try {
    await createPRComment('test comment');
  } catch (e) {
    console.log(e);
  }
})();
