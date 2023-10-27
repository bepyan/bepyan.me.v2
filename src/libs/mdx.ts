import { type CollectionEntry, getCollection } from 'astro:content';

import { externalWritings } from '~/content/constants';

/** 최신순 */
export const sortCollectionDateDesc = (
  a: CollectionEntry<'writing' | 'note'>,
  b: CollectionEntry<'writing' | 'note'>,
) => {
  return new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf();
};

export const sortDateDesc = (
  a: { date: string | Date | number },
  b: { date: string | Date | number },
) => {
  return new Date(b.date).valueOf() - new Date(a.date).valueOf();
};

/** 전체 글 정보 */
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

/** table-of-content */
export type TOCSection = TOCSubSection & {
  subSections: TOCSubSection[];
};

export type TOCSubSection = {
  slug: string;
  text: string;
};

export const parseToc = (source: string) => {
  return source
    .split('\n')
    .filter((line) => line.match(/(^#{1,3})\s/))
    .reduce<TOCSection[]>((ac, rawHeading) => {
      const nac = [...ac];
      const removeMdx = rawHeading
        .replace(/^##*\s/, '')
        .replace(/[\*,\~]{2,}/g, '')
        .replace(/(?<=\])\((.*?)\)/g, '')
        .replace(/(?<!\S)((http)(s?):\/\/|www\.).+?(?=\s)/g, '');

      const section = {
        slug: removeMdx
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣 -]/g, '')
          .replace(/\s/g, '-'),
        text: removeMdx,
      };

      const isSubTitle = rawHeading.split('#').length - 1 === 3;

      if (ac.length && isSubTitle) {
        nac.at(-1)?.subSections.push(section);
      } else {
        nac.push({ ...section, subSections: [] });
      }

      return nac;
    }, []);
};
