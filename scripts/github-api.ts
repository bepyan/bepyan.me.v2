import { Octokit } from '@octokit/rest';

import {
  GITHUB_ISSUE_NUMBER,
  GITHUB_PULL_REQUEST,
  GITHUB_RECENT_COMMIT_SHA,
  GITHUB_REPOSITORY_NAME,
  GITHUB_REPOSITORY_OWNER,
  GITHUB_TOKEN,
} from './constants';

const owner = GITHUB_REPOSITORY_OWNER;
const repo = GITHUB_REPOSITORY_NAME;

export const api = new Octokit({
  auth: GITHUB_TOKEN,
});

export const createPRComment = (content: string) => {
  return api.rest.issues.createComment({
    owner,
    repo,
    issue_number: GITHUB_ISSUE_NUMBER,
    body: content,
  });
};

export const createCommit = async ({
  treeBlobs,
  message,
}: {
  treeBlobs: any;
  message: string;
}) => {
  const latestCommit = await api.rest.git.getCommit({
    owner,
    repo,
    commit_sha: GITHUB_RECENT_COMMIT_SHA,
  });
  const baseTree = latestCommit.data.tree.sha;

  const newTree = await api.git.createTree({
    owner,
    repo,
    base_tree: baseTree,
    tree: treeBlobs,
  });

  const commit = await api.rest.git.createCommit({
    owner,
    repo,
    message,
    tree: newTree.data.sha,
    parents: [GITHUB_RECENT_COMMIT_SHA],
  });

  await api.git.updateRef({
    owner,
    repo,
    ref: `heads/${GITHUB_PULL_REQUEST.head.ref}`,
    sha: commit.data.sha,
  });
};
