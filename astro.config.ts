import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import { transformerTwoslash } from '@shikijs/twoslash';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';

import { transformerFragment } from './plugins/transformer-fragment';
import { SITE } from './src/consts';

export default defineConfig({
  site: SITE.site,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    svelte(),
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: 'css-variables',
        transformers: [
          transformerTwoslash({
            explicitTrigger: true,
          }),
          transformerNotationHighlight(),
          transformerNotationDiff(),
          transformerNotationFocus(),
          transformerNotationErrorLevel(),
          transformerMetaHighlight(),
          transformerMetaWordHighlight(),
          transformerFragment(),
        ],
      },
      remarkPlugins: [remarkBreaks],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['anchor'],
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
      ],
    }),
  ],
});
