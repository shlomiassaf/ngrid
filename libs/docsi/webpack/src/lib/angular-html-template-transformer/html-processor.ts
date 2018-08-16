import { HtmlParser, ParseTreeResult, RecursiveVisitor, Visitor, visitAll, Node, Element, Attribute } from '@angular/compiler';

interface DocsiAngularHtmlProcessorVisitorDef<T = any> {
  visit?: (ast: Node, context: T) => any;
  byNameElementVisitors?: {
    hasVisitorFor(elementName: string): boolean;
    runVisitorFor(ast: Element, context: T): any;
  };

}

export class DocsiAngularHtmlProcessor<T = any> extends RecursiveVisitor {
  private parseResult: ParseTreeResult;

  constructor(private source: string, visitorDef: DocsiAngularHtmlProcessorVisitorDef<T>, context?: T) {
    super();
    this.parseResult = new HtmlParser().parse(source, '');

    const { visit, byNameElementVisitors } = visitorDef;
    const hasElementVisitor: (ast: Node) => boolean = byNameElementVisitors
      ? (ast: Node) => DocsiAngularHtmlProcessor.isElement(ast) && byNameElementVisitors.hasVisitorFor(ast.name)
      : (ast: Node) => false
    ;

    (this as Visitor).visit = (ast: Node, ctx: T): any => {
      if (hasElementVisitor(ast)) {
        return byNameElementVisitors.runVisitorFor(ast as Element, ctx);
      }
      if (visit) {
        return visit(ast, ctx);
      }
    }

    visitAll(this, this.parseResult.rootNodes, context);
  }

  static isElement(obj: Node): obj is Element {
    return obj instanceof Element;
  }

  outerHtml(ast: Node): string;
  outerHtml(ast: Node, newValue: string): void;
  outerHtml(ast: Node, newValue?: string): string | void {
    const { start, end } = this.spanOf(ast);
    if (typeof newValue === 'undefined') {
      return this.source.substring(start, end);
    } else {
      this.source = this.source.substring(0, start) + newValue + this.source.substring(end);
    }
  }

  innerHtml(ast: Element): string;
  innerHtml(ast: Element, newValue: string): void;
  innerHtml(ast: Element, newValue?: string): string | void {
    const { start } = this.spanOf(ast.children[0]);
    const { end } = this.spanOf(ast.children[ast.children.length - 1]);
    if (typeof newValue === 'undefined') {
      return ast.children.length === 0 ? '' : this.source.substring(start, end);
    } else {
      this.source = this.source.substring(0, start) + newValue + this.source.substring(end);
    }
  }

  spanOf(ast: Node) {
    const start = ast.sourceSpan.start.offset;
    let end = ast.sourceSpan.end.offset;
    if (ast instanceof Element) {
      if (ast.endSourceSpan) {
        end = ast.endSourceSpan.end.offset;
      } else if (ast.children && ast.children.length) {
        end = this.spanOf(ast.children[ast.children.length - 1]).end;
      }
    }
    return {start, end};
  }

  toString(): string {
    return this.source;
  }
}
