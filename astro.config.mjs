import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

// https://astro.build/config
/** @type {import('astro/config').defineConfig} */
export default defineConfig({
  site: 'https://bepyan.me',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    mdx({
      syntaxHighlight: false,
      remarkPlugins: [remarkGfm, remarkBreaks],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['anchor'],
              ariaLabel: 'heading anchor',
            },
          },
        ],
        [
          rehypeExternalLinks,
          {
            properties: {
              class: 'external-link',
            },
            target: '_blank',
            rel: ['noopener noreferrer'],
          },
        ],
        [
          rehypePrettyCode,
          {
            theme: 'css-variables',
          },
        ],
      ],
    }),
  ],
});
