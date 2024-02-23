import { Octokit, type RestEndpointMethodTypes } from '@octokit/rest';

import type { ProcessedResult } from './sharp-api';

export type GitTreeBlob =
  RestEndpointMethodTypes['git']['createTree']['parameters']['tree'][number];

export const GITHUB_TOKEN = process.env['GITHUB_TOKEN'];
export const GITHUB_REPOSITORY = process.env['GITHUB_REPOSITORY']!;
export const [owner, repo] = GITHUB_REPOSITORY.split('/');

// @example https://gist.githubusercontent.com/colbyfayock/1710edb9f47ceda0569844f791403e7e/raw/1e575a3e5b2bb3c6d97d79ae25190e609f1e4f95/github-context.json
export const GITHUB_PULL_REQUEST = JSON.parse(
  process.env['GITHUB_PULL_REQUEST']!,
);

if (!GITHUB_TOKEN) {
  console.log('::error:: There is no GITHUB_TOKEN environment variable');
  process.exit(1);
}

export const api = new Octokit({
  auth: `token ${GITHUB_TOKEN}`,
});

export const createComment = (content: string) => {
  return api.rest.issues.createComment({
    owner: owner,
    repo: repo,
    issue_number: GITHUB_PULL_REQUEST.number,
    body: content,
  });
};

const imageToBase64 = async (path: string) => {
  const imageFile = Bun.file(path);
  const buffer = await imageFile.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return base64;
};

export const imageToTreeBlob = async (image: ProcessedResult) => {
  const encodedImage = await imageToBase64(image.path);

  const blob = await api.rest.git.createBlob({
    owner,
    repo,
    content: encodedImage,
    encoding: 'base64',
  });
  console.log('✧', image.name, blob.data.url);

  return {
    path: image.path,
    mode: '100644',
    type: 'blob',
    sha: blob.data.sha,
  } satisfies GitTreeBlob;
};

export const createCommit = async ({
  message,
  treeBlobs,
}: {
  message: string;
  treeBlobs: GitTreeBlob[];
}) => {
  const recentCommitSHA = GITHUB_PULL_REQUEST.head.sha;

  const latestCommit = await api.rest.git.getCommit({
    owner,
    repo,
    commit_sha: recentCommitSHA,
  });
  const baseTreeSha = latestCommit.data.tree.sha;

  const newTree = await api.rest.git.createTree({
    owner,
    repo,
    base_tree: baseTreeSha,
    tree: treeBlobs,
  });
  console.log('✧ newTree', newTree.data.url);

  const commit = await api.rest.git.createCommit({
    owner,
    repo,
    message,
    tree: newTree.data.sha,
    parents: [recentCommitSHA],
  });
  console.log('✧ created commit', commit.data.url);

  await api.rest.git.updateRef({
    owner,
    repo,
    ref: `heads/${GITHUB_PULL_REQUEST.head.ref}`,
    sha: commit.data.sha,
  });

  return commit.data;
};
