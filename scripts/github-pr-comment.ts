import { api } from './github-api';
import githubEvent from './github-event';

export const createComment = async (body: string) => {
  const event = await githubEvent();
  const owner = event.repository.owner.login;
  const repo = event.repository.name;
  const number = event.number;
  const issue_number = event.issue.number;

  return api.issues.createComment({
    issue_number,
    owner,
    repo,
    number,
    body,
  });
};
