import { Attribute, Element } from '@angular/compiler';
import { SourceCodeRefMetadata } from '../source-code-ref';

export interface BtCompileMarkdownMatch {
  type: 'markdown';
  ast: Element;
  src: Attribute;
}

export interface BtSourceCodeRefMatch {
  type: 'codeRef';
  ast: Element;
  instructionMeta: SourceCodeRefMetadata;
}

export class DocsiAngularHtmlProcessorElementVisitor<T = any> {

  results: Array<BtCompileMarkdownMatch | BtSourceCodeRefMatch> = [];

  hasVisitorFor(elementName: string): boolean {
    switch (elementName) {
      case 'docsi-bt-compile-markdown':
      case 'docsi-bt-source-code-ref':
        return true;
      default:
        return false;
    }
  }

  runVisitorFor(ast: Element, context: T): any {
    switch (ast.name) {
      case 'docsi-bt-compile-markdown':
        return this.visitBtCompileMarkdown(ast);
      case 'docsi-bt-source-code-ref':
      return this.visitBtSourceCodeRef(ast);
      default:
        return false;
    }
  }

  private visitBtCompileMarkdown(ast: Element): any {
    const src = ast.attrs.find( a => a.name === 'src' );
    this.results.unshift({ type: 'markdown', ast, src });
    return true;
  }

  private visitBtSourceCodeRef(ast: Element): any {
    const instructionMeta: SourceCodeRefMetadata = {} as any;
    for (const attr of ast.attrs) {
      const match = /\[(.+)]/.exec(attr.name);
      const name = match ? match[1] : attr.name;
      const value = match ? JSON.parse(attr.value) : attr.value;
      instructionMeta[name] = value;
    }
    this.results.unshift({ type: 'codeRef', ast, instructionMeta });
    return true;
  }
}
