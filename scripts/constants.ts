export const GITHUB_TOKEN = process.env['GITHUB_TOKEN'];
export const GITHUB_EVENT_NAME = process.env['GITHUB_EVENT_NAME'];
export const GITHUB_EVENT_PATH = process.env['GITHUB_EVENT_PATH'];
export const GITHUB_SHA = process.env['GITHUB_SHA'];
export const GITHUB_REF = process.env['GITHUB_REF'];
export const GITHUB_REPOSITORY = process.env['GITHUB_REPOSITORY'];
export const GITHUB_API_URL = process.env['GITHUB_API_URL'];
export const GITHUB_WORKSPACE = process.env['GITHUB_WORKSPACE'];

if (!GITHUB_WORKSPACE) {
  console.log('::error:: There is no GITHUB_WORKSPACE environment variable');
  process.exit(1);
}
