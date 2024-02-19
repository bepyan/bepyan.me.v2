export const GITHUB_TOKEN = process.env['GITHUB_TOKEN'];
export const GITHUB_REPOSITORY = process.env['GITHUB_REPOSITORY']!;
export const GITHUB_REPOSITORY_OWNER = process.env['GITHUB_REPOSITORY_OWNER']!;
export const GITHUB_ISSUE_NUMBER = +process.env['GITHUB_ISSUE_NUMBER']!;

if (!GITHUB_TOKEN) {
  console.log('::error:: There is no GITHUB_TOKEN environment variable');
  process.exit(1);
}
