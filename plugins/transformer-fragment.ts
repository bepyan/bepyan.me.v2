import type { Element } from 'hast';
import type { ShikiTransformer } from 'shiki';

const ignoreLangList = ['', 'plaintext'];

export function transformerFragment(): ShikiTransformer {
  return {
    name: '@shikijs/transformers:fragment',
    root(root) {
      const metaString = this.options.meta?.__raw || '';
      const title = metaString.match(/title="([^"]+)"/)?.[1];
      const caption = metaString.match(/caption="([^"]+)"/)?.[1];
      const noCopy = metaString.includes('noCopy');
      const lang = this.options.lang;

      root.children = [
        // @ts-expect-error hast type conflict internally
        createFragmentElement(
          title && createTitleElement(title),
          createCodeWrapperElement(
            !ignoreLangList.includes(lang) && createLanguageElement(lang),
            !noCopy && createCopyElement(),
            root.children[0],
          ),
          caption && createCaptionElement(caption),
        ),
      ];
      return root;
    },
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

function createCodeWrapperElement(...children: unknown[]): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      'data-code-wrapper': '',
    },
    children: (children as Element[]).filter(Boolean),
  };
}

function createLanguageElement(lang: string): Element {
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      class: 'lang',
    },
    children: [{ type: 'text', value: lang }],
  };
}

function createCopyElement() {
  return {
    type: 'element',
    tagName: 'button',
    properties: {
      class: 'copy',
      title: 'Copy Code',
    },
    children: [],
  };
}
