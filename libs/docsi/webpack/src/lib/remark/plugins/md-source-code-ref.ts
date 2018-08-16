import * as visit from 'unist-util-visit';

import { SourceCodeRefMetadata } from '../../source-code-ref';
import { MarkdownToHtmlRuntimeOptions } from '../markdown-to-html';

declare module '../markdown-to-html' {
  interface MarkdownToHtmlRuntimeOptions {
    mdSourceCodeRef?: {
      resourcePath: string;
      onMatch(event: CodeNodeMatchEvent): void;
    };
  }
}

export interface CodeNodeMatchEvent {
  resourcePath: string;
  node: CodeNode;
  instructions: SourceCodeRefMetadata[];
}

export interface CodeNode {
  type: 'code';
  value: string;
  lang: string;
}

const JSON_PARSE_ERROR_REGEXP = /SyntaxError: Unexpected token (.) in JSON at position (\d+)/;

export function mdSourceCodeRef(staticOptions?: MarkdownToHtmlRuntimeOptions['mdSourceCodeRef']) {
  return (ast) => {
    const options: MarkdownToHtmlRuntimeOptions['mdSourceCodeRef']
      = Object.assign({}, staticOptions || {},  this.data('mdSourceCodeRef') || {});

    const { resourcePath, onMatch } = options;

    if (!resourcePath) {
      throw new Error('[mdSourceCodeRef Plugin]: Invalid configuration, "resourcePath" is not defined.');
    }
    if (!onMatch) {
      throw new Error('[mdSourceCodeRef Plugin]: Invalid configuration, "onMatch" is not defined.');
    }

    return visit(ast, 'code', visitor);

    function visitor (node: CodeNode, index: number, parent: any) {
      if (node.lang === 'json sacCode') {
        try {
          const codeExtractions: SourceCodeRefMetadata[] = JSON.parse(node.value);
          onMatch({ resourcePath, node, instructions: codeExtractions });
        } catch (err) {
          const match = JSON_PARSE_ERROR_REGEXP.exec(err.toString());
          if (match) {
            // match[1] is token
            // match[2] is char pos
            throw err;
          } else {
            throw err;
          }
        }

        parent.children.splice(index, 1);
        return index - 1;
      }
    }
  }
}
