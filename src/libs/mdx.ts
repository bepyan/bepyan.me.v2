import { type CollectionEntry, getCollection } from 'astro:content';

import { externalWritings } from '~/content/_constants';
import { compareTwoStrings } from '~/libs/dice-coefficient-kr';
import { getLangFromSlug, type Language } from '~/libs/i18n';

import { isDev } from './utils';

// ====================================================
// utils
// ====================================================

export const isDraft = (post: CollectionEntry<'post'>) => {
  return isDev || !post.data.draft;
};

export const isWriting = (post: { slug: string }) => {
  return post.slug.includes('/writing/');
};

export const isNote = (post: { slug: string }) => {
  return post.slug.includes('/note/');
};

export const getPostType = (post: { slug: string }) => {
  if (isWriting(post)) return 'writing';
  if (isNote(post)) return 'note';

  throw new Error('post slug is invalid...');
};

// 최신순
export const sortCollectionDateDesc = (
  a: CollectionEntry<'post'>,
  b: CollectionEntry<'post'>,
) => {
  return new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf();
};

export const sortDateDesc = (
  a: { date: string | Date | number },
  b: { date: string | Date | number },
) => {
  return new Date(b.date).valueOf() - new Date(a.date).valueOf();
};

export const sortCollectionDateAsc = (
  a: CollectionEntry<'post'>,
  b: CollectionEntry<'post'>,
) => {
  return new Date(a.data.date).valueOf() - new Date(b.data.date).valueOf();
};

/**
 * 글 경로 조정
 * @example ko/note/svelte-useEffect -> svelte-useEffect
 * @example en/note/svelte-useEffect -> svelte-useEffect
 */
export const resolveSlug = (slug: string) => {
  const [_lang, _type, ...slugList] = slug.split('/');
  return slugList.join('/');
};

/**
 * 글 Description 자동 파싱
 */
export const contentToDescription = (content: string) => {
  const parsedContent = content
    .replace(/(?<=\])\((.*?)\)/g, '')
    .replace(/(?<!\S)((http)(s?):\/\/|www\.).+?(?=\s)/g, '')
    .replace(/[#*|[\]]|(-{3,})|(`{3})(\S*)(?=\s)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 157);

  return `${parsedContent}...`;
};

// ====================================================
// Post
// ====================================================

/** 전체 글 정보 */
export const getPostCollection = async () => {
  return (await getCollection('post'))
    .filter(isDraft)
    .sort(sortCollectionDateDesc);
};

/** 연관 글 추출 */
export const getRelatedPosts = (
  post: CollectionEntry<'post'>,
  postList: CollectionEntry<'post'>[],
) => {
  return postList
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const tagPoint = post.data.tags
        ? post.data.tags.filter((tag) => p.data.tags?.includes(tag)).length
        : 0;
      const titlePoint = compareTwoStrings(post.data.title, p.data.title);
      return {
        post: p,
        similarity: tagPoint + 3.0 * titlePoint,
      };
    })
    .toSorted((a, b) => b.similarity - a.similarity)
    .map((p) => p.post)
    .slice(0, 4);
};

// ====================================================
// PostInfo
// ====================================================

export type PostInfo = {
  title: string;
  description: string;
  /** /post/example */
  href: string;
  date: Date;
  updatedDate?: Date;
  lang: Language;
  isExternal?: boolean;
  type: 'writing' | 'note';
};

export const getPostInfoList = async (
  type: 'all' | 'writing' | 'note' = 'all',
) => {
  const posts = await getPostCollection();

  return posts
    .filter((post) => {
      if (type === 'writing') return isWriting(post);
      if (type === 'note') return isNote(post);
      return true;
    })
    .map<PostInfo>((post) => ({
      title: post.data.title,
      description: post.data.description,
      href: `/post/${resolveSlug(post.slug)}`,
      date: post.data.date,
      updatedDate: post.data.updatedDate,
      lang: getLangFromSlug(post.slug),
      type: getPostType(post),
    }));
};

export const getWritingPostInfoList = async (
  lang: Language = 'ko',
): Promise<PostInfo[]> => {
  const postList: PostInfo[] = [
    ...(await getPostInfoList('writing')),
    ...externalWritings.map<PostInfo>((post) => ({
      title: post.title,
      description: post.description,
      href: post.link,
      date: new Date(post.date),
      isExternal: true,
      lang: getLangFromSlug(post.link),
      type: 'writing',
    })),
  ];

  return postList.filter((post) => post.lang === lang).sort(sortDateDesc);
};

export const getNotePostInfoList = async (
  lang: Language = 'ko',
): Promise<PostInfo[]> => {
  const postList: PostInfo[] = [...(await getPostInfoList('note'))];

  return postList.filter((post) => post.lang === lang).sort(sortDateDesc);
};
