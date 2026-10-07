import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';

import { parse } from '@astrojs/compiler-rs';
import { z } from 'astro/zod';
import * as prettier from 'prettier';
import type { Plugin } from 'vite';

const ENDPOINT = '/__slides/edit';
const MAX_BODY_BYTES = 64 * 1024;

const payloadSchema = z.object({
  page: z.string().regex(/^[a-z0-9-]+$/),
  total: z.number().int().positive(),
  slide: z.number().int().nonnegative(),
  path: z.array(z.number().int().nonnegative()),
  prev: z.array(z.string()),
  next: z.array(z.string()),
  dryRun: z.boolean().optional(),
});

type Payload = z.infer<typeof payloadSchema>;

interface AstNode {
  type: string;
  start: number;
  end: number;
  raw?: string;
  children?: AstNode[];
  openingElement?: {
    name: { type: string; name?: string };
    attributes: {
      type: string;
      name?: { name: string; namespace?: { name: string } };
      value?: { type: string; value?: unknown } | null;
    }[];
  };
}

class EditError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const getTagName = (node: AstNode) => {
  const name = node.openingElement?.name;
  return name?.type === 'JSXIdentifier' ? name.name : undefined;
};

const getAttributeName = (
  attr: NonNullable<AstNode['openingElement']>['attributes'][number],
) =>
  attr.name?.namespace
    ? `${attr.name.namespace.name}:${attr.name.name}`
    : attr.name?.name;

const isPlainElement = (node: AstNode) => {
  if (node.type !== 'JSXElement') return false;
  const tag = getTagName(node);
  if (!tag || !/^[a-z][a-z0-9-]*$/.test(tag)) return false;
  if (tag === 'script' || tag === 'style') return false;
  return !node.openingElement!.attributes.some((attr) => {
    const name = getAttributeName(attr);
    return (
      attr.type !== 'JSXAttribute' || name === 'set:html' || name === 'set:text'
    );
  });
};

const isBlankText = (node: AstNode) =>
  node.type === 'JSXText' && !node.raw!.trim();

const hasSlideClass = (node: AstNode) =>
  node.openingElement?.attributes.some(
    (attr) =>
      attr.type === 'JSXAttribute' &&
      getAttributeName(attr) === 'class' &&
      attr.value?.type === 'Literal' &&
      typeof attr.value.value === 'string' &&
      attr.value.value.split(/\s+/).includes('slide'),
  ) ?? false;

const collectSlides = (nodes: AstNode[], found: AstNode[] = []) => {
  for (const node of nodes) {
    if (node.type !== 'JSXElement') continue;
    if (hasSlideClass(node)) found.push(node);
    else collectSlides(node.children ?? [], found);
  }
  return found;
};

const elementChildren = (node: AstNode) => {
  const children = (node.children ?? []).filter(
    (child) => child.type !== 'AstroComment' && child.type !== 'JSXText',
  );
  if (!children.every(isPlainElement)) {
    throw new EditError(
      409,
      '표현식이나 컴포넌트 옆에 있는 글자라 고칠 수 없습니다.',
    );
  }
  return children;
};

const collectTextRuns = (node: AstNode, runs: AstNode[] = []) => {
  for (const child of node.children ?? []) {
    if (child.type === 'AstroComment' || isBlankText(child)) continue;
    if (child.type === 'JSXText') runs.push(child);
    else if (isPlainElement(child)) collectTextRuns(child, runs);
    else
      throw new EditError(
        409,
        '표현식이나 컴포넌트로 만든 글자라 고칠 수 없습니다.',
      );
  }
  return runs;
};

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

const decodeEntities = (text: string) =>
  text.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] !== '#') return NAMED_ENTITIES[entity] ?? match;
    const isHex = entity[1].toLowerCase() === 'x';
    return String.fromCodePoint(
      parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10),
    );
  });

const normalizeText = (text: string) => text.replace(/\s+/g, ' ').trim();

const escapeText = (text: string) =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');

const replaceCore = (raw: string, next: string) => {
  const leading = raw.match(/^\s*/)![0];
  const trailing = raw.slice(leading.length).match(/\s*$/)![0];
  return leading + escapeText(next) + trailing;
};

const countErrors = (diagnostics: { severity?: string }[]) =>
  diagnostics.filter((d) => d.severity === 'error').length;

const applyEdit = async (root: string, payload: Payload) => {
  const slidesDir = path.resolve(root, 'src/pages/slides');
  const file = path.resolve(slidesDir, payload.page, 'index.astro');
  if (!file.startsWith(slidesDir + path.sep)) {
    throw new EditError(400, '잘못된 발표 자료 경로입니다.');
  }
  if (!existsSync(file))
    throw new EditError(404, '발표 자료 파일을 찾을 수 없습니다.');

  // AST의 start/end는 UTF-8 byte offset이라 Buffer 기준으로 자른다.
  const source = await readFile(file);
  const { ast, diagnostics } = parse(source.toString('utf8'));

  const slides = collectSlides(ast.body);
  if (slides.length !== payload.total) {
    throw new EditError(
      409,
      '소스의 장표 개수가 화면과 달라 고칠 수 없습니다.',
    );
  }
  let target = slides[payload.slide];
  if (!target) throw new EditError(400, '없는 장표입니다.');
  for (const index of payload.path) {
    target = elementChildren(target)[index];
    if (!target) throw new EditError(409, '소스에서 요소를 찾을 수 없습니다.');
  }

  const runs = collectTextRuns(target);
  const sourceTexts = runs.map((run) =>
    normalizeText(
      decodeEntities(source.subarray(run.start, run.end).toString('utf8')),
    ),
  );
  const isSameAsPrev =
    sourceTexts.length === payload.prev.length &&
    sourceTexts.every((text, i) => text === payload.prev[i]);
  if (!isSameAsPrev) {
    throw new EditError(409, '소스의 글자가 화면과 달라 고칠 수 없습니다.');
  }
  if (payload.next.length !== payload.prev.length) {
    throw new EditError(400, '글자 구간 개수가 바뀌었습니다.');
  }
  if (payload.next.some((text) => !text || /[{}]/.test(text))) {
    throw new EditError(400, '빈 글자나 {, }는 넣을 수 없습니다.');
  }
  if (payload.dryRun) return;

  let edited = source;
  for (let i = runs.length - 1; i >= 0; i--) {
    const next = payload.next[i];
    if (next === payload.prev[i]) continue;
    const run = runs[i];
    const raw = edited.subarray(run.start, run.end).toString('utf8');
    edited = Buffer.concat([
      edited.subarray(0, run.start),
      Buffer.from(replaceCore(raw, next)),
      edited.subarray(run.end),
    ]);
  }
  if (edited === source) return;

  const options = await prettier.resolveConfig(file);
  const formatted = await prettier.format(edited.toString('utf8'), {
    ...options,
    filepath: file,
  });
  if (countErrors(parse(formatted).diagnostics) > countErrors(diagnostics)) {
    throw new EditError(422, '고친 결과를 해석할 수 없어 저장하지 않았습니다.');
  }
  await writeFile(file, formatted);
};

const readBody = (req: IncomingMessage) =>
  new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        // 연결을 끊지 않고 나머지 본문을 버려야 413 응답이 전달된다.
        req.removeAllListeners('data');
        req.resume();
        reject(new EditError(413, '요청이 너무 큽니다.'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });

const sendJson = (res: ServerResponse, status: number, body: object) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

export function slideEditor(): Plugin {
  return {
    name: 'slide-editor',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(ENDPOINT, async (req, res) => {
        try {
          if (req.method !== 'POST')
            throw new EditError(405, 'POST만 받습니다.');
          // JSON만 받아 다른 origin의 단순 요청(form 등)을 막는다.
          if (!req.headers['content-type']?.startsWith('application/json')) {
            throw new EditError(415, 'JSON만 받습니다.');
          }
          const parsed = payloadSchema.safeParse(
            JSON.parse(await readBody(req)),
          );
          if (!parsed.success) throw new EditError(400, '잘못된 요청입니다.');
          await applyEdit(server.config.root, parsed.data);
          sendJson(res, 200, { ok: true });
        } catch (error: unknown) {
          if (error instanceof EditError) {
            sendJson(res, error.status, { ok: false, error: error.message });
            return;
          }
          if (error instanceof SyntaxError) {
            sendJson(res, 400, { ok: false, error: '잘못된 JSON입니다.' });
            return;
          }
          server.config.logger.error(`[slide-editor] ${String(error)}`);
          sendJson(res, 500, { ok: false, error: '저장하지 못했습니다.' });
        }
      });
    },
  };
}
