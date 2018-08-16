import * as visit from 'unist-util-visit';

/**
 * Add a `docsi-toc` attribute to all headings.
 * This enable TOC using the angular TocModule
 */
export function docsiToc() {
  function visitor (node) {
    const data: any = node.data || (node.data = {});
    if (!data.hProperties) {
      data.hProperties = {};
    }

    data.hProperties['docsi-toc'] = '';
  }
  return ast => visit(ast, 'heading', visitor);
}
