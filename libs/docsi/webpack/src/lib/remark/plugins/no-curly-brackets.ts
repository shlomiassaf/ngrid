import * as visit from 'unist-util-visit';

/**
 * Replace all opening curly brackets `{` with `{{ '{' }}`.
 * This will avoid angular errors when the template includes curly brackets that are not part of the template.
 */
export function noCurelyBrackets() {
  function textVisitor (node) {
    if (node.value) {
      node.value = node.value.replace(/\{/g, `{{ '{' }}`);
    }
  }

  function visitor (node) {
    const { data } = node;
    if (data && data.hChildren) {
      for (const child of data.hChildren) {
        if (child.type === 'text') {
          textVisitor(child);
        } else {
          visit(child, 'text', textVisitor);
        }
      }
    }

  }
  return ast => visit(ast, 'code', visitor);
}
