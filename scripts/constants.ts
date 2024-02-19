export const GITHUB_TOKEN = process.env['GITHUB_TOKEN'];
export const GITHUB_REPOSITORY = process.env['GITHUB_REPOSITORY']!;
export const [GITHUB_REPOSITORY_OWNER, GITHUB_REPOSITORY_NAME] =
  GITHUB_REPOSITORY.split('/');

export const GITHUB_PULL_REQUEST = JSON.parse(
  process.env['GITHUB_PULL_REQUEST']!,
);
export const GITHUB_ISSUE_NUMBER = GITHUB_PULL_REQUEST.number;
export const GITHUB_RECENT_COMMIT_SHA = GITHUB_PULL_REQUEST.head.sha;

if (!GITHUB_TOKEN) {
  console.log('::error:: There is no GITHUB_TOKEN environment variable');
  process.exit(1);
}
