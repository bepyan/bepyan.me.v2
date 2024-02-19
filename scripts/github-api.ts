import { Octokit } from '@octokit/rest';

import {
  GITHUB_ISSUE_NUMBER,
  GITHUB_REPOSITORY_NAME,
  GITHUB_REPOSITORY_OWNER,
  GITHUB_TOKEN,
} from './constants';

export const api = new Octokit({
  auth: `token ${GITHUB_TOKEN}`,
});

export const createPRComment = (content: string) => {
  return api.rest.issues.createComment({
    owner: GITHUB_REPOSITORY_OWNER,
    repo: GITHUB_REPOSITORY_NAME,
    issue_number: GITHUB_ISSUE_NUMBER,
    body: content,
  });
};
