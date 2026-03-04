import { readFile } from 'node:fs/promises';

import { Glob } from 'bun';

const BLOG_URL = 'https://bepyan.me/post';
const MAX_POSTS = 4;
const PROFILE_REPO = 'bepyan/bepyan';
const MARKER_START = '<!-- BLOG-POSTS:START -->';
const MARKER_END = '<!-- BLOG-POSTS:END -->';

interface Post {
  title: string;
  date: Date;
  slug: string;
}

function parseFrontmatter(content: string): {
  title: string;
  date: string;
  draft: boolean;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error('No frontmatter found');

  const fields: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line
      .slice(idx + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');
    fields[key] = value;
  }

  return {
    title: fields.title ?? '',
    date: fields.date ?? '',
    draft: fields.draft === 'true',
  };
}

function getSlugFromPath(filePath: string): string {
  return filePath
    .split('/')
    .pop()!
    .replace(/\.mdx?$/, '');
}

function formatDate(date: Date): string {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}.${mm}.${dd}`;
}

function formatPostHtml(post: Post): string {
  return `    <a href="${BLOG_URL}/${post.slug}">${post.title}</a> <sub>${formatDate(post.date)}</sub> <br>`;
}

function buildSection(label: string, posts: Post[]): string {
  return [
    '<div>',
    '  <samp>',
    `    <p>${label}</p>`,
    ...posts.map(formatPostHtml),
    '  </samp>',
    '</div>',
  ].join('\n');
}

function replaceMarkerContent(readme: string, newContent: string): string {
  const startIdx = readme.indexOf(MARKER_START);
  const endIdx = readme.indexOf(MARKER_END);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error('BLOG-POSTS markers not found in README');
  }

  return (
    readme.slice(0, startIdx + MARKER_START.length) +
    '\n' +
    newContent +
    '\n' +
    readme.slice(endIdx)
  );
}

async function scanPosts(pattern: string): Promise<Post[]> {
  const glob = new Glob(pattern);
  const files = await Array.fromAsync(glob.scan('.'));
  const posts: Post[] = [];

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf-8');
    const fm = parseFrontmatter(content);
    if (fm.draft) continue;

    posts.push({
      title: fm.title,
      date: new Date(fm.date),
      slug: getSlugFromPath(filePath),
    });
  }

  return posts
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, MAX_POSTS);
}

// ----------------------------------------------------------------------------
// API
// ----------------------------------------------------------------------------

async function getReadme(
  token: string,
): Promise<{ content: string; sha: string }> {
  const res = await fetch(
    `https://api.github.com/repos/${PROFILE_REPO}/contents/README.md`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to get README: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { content: string; sha: string };
  return {
    content: Buffer.from(data.content, 'base64').toString('utf-8'),
    sha: data.sha,
  };
}

async function updateReadme(
  token: string,
  content: string,
  sha: string,
): Promise<void> {
  const res = await fetch(
    `https://api.github.com/repos/${PROFILE_REPO}/contents/README.md`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        message: 'chore: update blog posts',
        content: Buffer.from(content).toString('base64'),
        sha,
      }),
    },
  );

  if (!res.ok) {
    throw new Error(
      `Failed to update README: ${res.status} ${await res.text()}`,
    );
  }
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is not set');

  const [writingPosts, notePosts] = await Promise.all([
    scanPosts('src/content/post/ko/writing/*.mdx'),
    scanPosts('src/content/post/ko/note/*.mdx'),
  ]);

  const writingSection = buildSection('Recent Writing', writingPosts);
  const noteSection = buildSection('Recent Note', notePosts);
  const newContent = `<br><br>\n${writingSection}\n<br><br>\n${noteSection}`;

  console.log(newContent);

  const { content: readme, sha } = await getReadme(token);
  const updatedReadme = replaceMarkerContent(readme, newContent);

  if (readme === updatedReadme) {
    console.log('\n✦ No changes detected, skipping update');
    return;
  }

  await updateReadme(token, updatedReadme, sha);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
