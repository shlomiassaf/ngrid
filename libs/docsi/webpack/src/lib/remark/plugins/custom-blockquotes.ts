import * as visit from 'unist-util-visit';

// https://github.com/swimlane/DocSPA/blob/master/projects/swimlane/docspa-remark-preset/src/plugins/remark-custom-blockquotes.ts
export function customBlockquotes({ mapping }) {
  return function transformer(tree) {
    visit(tree, 'paragraph', visitor);

    function visitor(node) {
      const { children } = node;
      const textNode = children[0].value;

      if (!textNode) {
        return;
      }

      const substr = textNode.substr(0, 2);
      const className = mapping[substr];

      if (className) {
        node.type = 'blockquote';
        node.data = {
          hName: 'blockquote',
          hProperties: {
            className
          }
        };

        const r = new RegExp(`^${substr}\\s`, 'gm');

        visit(node, 'text', function (cld) {
          cld.value = cld.value.replace(r, ' ');
        });
      }
    }
  };
}

