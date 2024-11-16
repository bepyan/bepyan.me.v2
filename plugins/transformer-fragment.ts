import type { Element } from 'node_modules/@astrojs/markdown-remark/node_modules/remark-rehype/node_modules/@types/hast/index';
import { addClassToHast, type ShikiTransformer } from 'shiki';

const ignoreLangList = ['', 'plaintext'];

export function transformerFragment(): ShikiTransformer {
  return {
    name: '@shikijs/transformers:fragment',
    root(root) {
      const metaString = this.options.meta?.__raw || '';
      const title = metaString.match(/title="([^"]+)"/)?.[1];
      const caption = metaString.match(/caption="([^"]+)"/)?.[1];

      const preElement = root.children[0] as Element;
      const codeElement = preElement.children[0] as Element;

      const isShowLineNumbers = metaString.includes('line-numbers');
      if (isShowLineNumbers) {
        addClassToHast(preElement, 'has-line-numbers');
        preElement.children.push(createLineNumbersElement(codeElement));
      }

      const lang = this.options.lang;
      const isShowLang = !ignoreLangList.includes(lang);
      if (isShowLang) {
        preElement.children.push(createLanguageElement(lang));
      }

      const isShowCopy = !metaString.includes('noCopy');
      if (isShowCopy) {
        preElement.children.push(createCopyElement());
      }

      root.children = [
        createFragmentElement(
          title && createTitleElement(title),
          preElement,
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
  } satisfies Element;
}

function createLineNumbersElement(codeElement: Element): Element {
  const lineNumbers = codeElement.children
    .filter((child) => child.type === 'text')
    .map((_, i) => {
      return {
        type: 'element',
        tagName: 'span',
        properties: { class: 'line-number' },
        children: [{ type: 'text', value: `${i + 1}` }],
      } satisfies Element;
    });

  return {
    type: 'element',
    tagName: 'div',
    properties: {
      class: 'line-numbers',
    },
    children: [...lineNumbers],
  };
}
