import { type CollectionEntry, getCollection } from 'astro:content';

import { externalWritings } from '~/content/constants';

/** 최신순 */
export const sortCollectionDateDesc = (
  a: CollectionEntry<'writing' | 'note'>,
  b: CollectionEntry<'writing' | 'note'>,
) => {
  return new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf();
};

/** 최신순 */
export const sortDateDesc = (
  a: { date: string | Date | number },
  b: { date: string | Date | number },
) => {
  return new Date(b.date).valueOf() - new Date(a.date).valueOf();
};

export type PostInfo = {
  title: string;
  description: string;
  href: string;
  date: string | Date;
  isExternal?: boolean;
};

export const getWritingPostInfoList = async (): Promise<PostInfo[]> => {
  const posts = await getCollection('writing');

  const postList: PostInfo[] = [
    ...posts.map<PostInfo>((post) => ({
      title: post.data.title,
      description: post.data.description,
      href: `/post/${post.slug}`,
      date: post.data.date,
    })),
    ...externalWritings.map<PostInfo>((post) => ({
      title: post.title,
      description: post.description,
      href: post.link,
      date: post.date,
      isExternal: true,
    })),
  ];

  return postList.sort(sortDateDesc);
};
