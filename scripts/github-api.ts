import { Octokit, type RestEndpointMethodTypes } from '@octokit/rest';

import type { ProcessedResult } from './sharp-api';

export type GitTreeBlobs =
  RestEndpointMethodTypes['git']['createTree']['parameters']['tree'];

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
  const bytes = new Uint8Array(buffer);

  let binary = '';
  for (var i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const convertToTreeBlobs = async (images: ProcessedResult[]) => {
  const imageBlobs: GitTreeBlobs = [];

  for await (const image of images) {
    const encodedImage = await imageToBase64(image.path);

    const blob = await api.rest.git.createBlob({
      owner,
      repo,
      content: encodedImage,
      encoding: 'base64',
    });

    imageBlobs.push({
      path: image.name,
      mode: '100644',
      type: 'blob',
      sha: blob.data.sha,
    });
  }

  return imageBlobs;
};

export const createCommit = async ({
  message,
  treeBlobs,
}: {
  message: string;
  treeBlobs: GitTreeBlobs;
}) => {
  const recentCommitSHA = GITHUB_PULL_REQUEST.head.sha;

  const latestCommit = await api.rest.git.getCommit({
    owner,
    repo,
    commit_sha: recentCommitSHA,
  });
  const baseTree = latestCommit.data.tree.sha;

  const newTree = await api.rest.git.createTree({
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
    parents: [recentCommitSHA],
  });

  await api.rest.git.updateRef({
    owner,
    repo,
    ref: `heads/${GITHUB_PULL_REQUEST.head.ref}`,
    sha: commit.data.sha,
  });

  return commit.data;
};
