import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button
      className="rounded-lg bg-gray-700 px-2 py-1 font-sans font-semibold text-gray-50 transition focus:ring focus:ring-gray-400 active:bg-gray-600"
      onClick={() => setCount(count + 1)}
    >
      저를 {count}번 클릭 했습니다
    </button>
  );
}

export function PostPreview({ slug = '', title = '', wordCount = 0 }) {
  return (
    <section className="rounded-md bg-gray-100 px-4 py-2">
      <p className="font-bold">
        <a href={`/post/${slug}`} target="_blank">
          {title}
        </a>
      </p>
      <i>{wordCount} 단어</i>
    </section>
  );
}

const blogList = [
  { slug: '2023-settlement', title: '2023 연말정산', wordCount: 837 },
  {
    slug: 'svelte-compiler-operation',
    title: 'Svelte Compiler는 어떻게 동작할까?',
    wordCount: 1067,
  },
  { slug: 'life-map', title: '삶의 지도 (Maps of Life)', wordCount: 490 },
  {
    slug: 'redesign-blog',
    title: '블로그를 새롭게 설계하면서',
    wordCount: 499,
  },
  {
    slug: 'example',
    title: '글 예시',
    wordCount: 473,
  },
];

export function PostList() {
  return (
    <div className="mb-4 flex h-72 flex-col gap-2 overflow-y-scroll">
      {blogList.map((props, i) => (
        <PostPreview key={i} {...props} />
      ))}
    </div>
  );
}
