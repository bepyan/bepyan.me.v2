import type { Element } from 'hast';
import type { ShikiTransformer } from 'shiki';

export function transformerFragment(): ShikiTransformer {
  return {
    name: '@shikijs/transformers:fragment',
    root(root) {
      const metaString = this.options.meta?.__raw || '';
      const title = metaString.match(/title="([^"]+)"/)?.[1];
      const caption = metaString.match(/caption="([^"]+)"/)?.[1];

      root.children = [
        // @ts-expect-error hast type conflict internally
        createFragmentElement(
          title && createTitleElement(title),
          root.children[0],
          caption && createCaptionElement(caption),
        ),
      ];
      return root;
    },
  };
}

function createTitleElement(title: string): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      'data-code-title': '',
    },
    children: [{ type: 'text', value: title }],
  };
}

function createCaptionElement(caption: string): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      'data-code-caption': '',
    },
    children: [{ type: 'text', value: caption }],
  };
}

function createFragmentElement(...children: unknown[]): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      'data-code-fragment': '',
    },
    children: (children as Element[]).filter(Boolean),
  };
}
