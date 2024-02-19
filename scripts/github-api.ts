import { Octokit } from '@octokit/rest';

import { GITHUB_API_URL, GITHUB_TOKEN } from './constants';

export const api = new Octokit({
  auth: `token ${GITHUB_TOKEN}`,
  baseUrl: `${GITHUB_API_URL}`,
});
