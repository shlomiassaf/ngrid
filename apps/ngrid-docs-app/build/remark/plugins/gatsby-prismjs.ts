import * as visit from 'unist-util-visit';
const remarkPrismJs = require('gatsby-remark-prismjs');

export function gatsbyRemarkPrismJs(forAngularTemplate = false) {
  return () => {
    const RE_CODE = /^<div\sclass="gatsby-highlight".+/;
    const RE_SPACE_REMOVE = /(.+)\s(\{.+)$/;

    // For line numbers and highlighting we need to do: ```typescript{1,4-6}{numberLines: true}
    // This will disable IDE support for the language inside markups.
    // so we allow this: ```typescript {1,4-6}{numberLines: true}
    // this will remove the space.
    function fixCodeWithWhitespaceAndAttr (node) {
      if (node.lang) {
        const match = RE_SPACE_REMOVE.exec(node.lang);
        if (match) {
          node.lang = match[1] + match[2];
        }
      }
    }

    return markdownAST => {
      const codeNodes = [];

      // Add support for code sections with attributes and a whitespace between: ``typescript {1,4-6}{numberLines: true}
      visit(markdownAST, 'code', node => {
        fixCodeWithWhitespaceAndAttr(node);
        codeNodes.push(node);
      });

      remarkPrismJs({ markdownAST });

      for (const codeNode of codeNodes) {
        const htmlCode = forAngularTemplate && RE_CODE.test(codeNode.value) ? codeNode.value.replace(/\{/g, `{{ '{' }}`) : codeNode.value;
        codeNode.value = `<div>${htmlCode}</div>`;
      }
    };
  }
}
