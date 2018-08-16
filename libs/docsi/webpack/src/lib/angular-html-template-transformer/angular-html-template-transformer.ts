import * as fs from 'fs';
import * as path from 'path';
import { loader } from 'webpack';
import { highlightAuto } from 'highlight.js';

import { NS } from '../unique-symbol';
import { Instruction, SourceCodeRef, ParsedInstructionCache, SourceCodeRefMetadata } from '../source-code-ref';
import { MarkdownToHtml } from '../remark';

import { DocsiAngularHtmlProcessor } from './html-processor';
import { DocsiAngularHtmlProcessorElementVisitor } from './html-processor-element-visitor';

export class DocsiAngularTemplateTransformer {
  private dirname: string;
  private cache: ParsedInstructionCache;
  private codeParts: SourceCodeRef[] = [];
  private get rootResourcePath(): string { return this.loaderContext.resourcePath; };

  private currentResourcePath: string;
  private resourcePathStack: string[] = [];

  constructor(private loaderContext: loader.LoaderContext, private source: string, private markdownToHtml: MarkdownToHtml) {
    this.dirname = path.dirname(this.rootResourcePath);
    this.cache = new ParsedInstructionCache(this.dirname);
  }

  run(): string {
    let source: string = this.source;

    this.pushResourcePath(this.rootResourcePath);
    if (this.currentResourcePath.endsWith('.html')) {
      const byNameElementVisitors = new DocsiAngularHtmlProcessorElementVisitor();
      const htmlProcessor = new DocsiAngularHtmlProcessor(source, { byNameElementVisitors });
      if (byNameElementVisitors.results.length > 0) {
        source = this.processHtml(htmlProcessor, byNameElementVisitors.results);
      }
    } else {
      source = this.processMarkdown(source);
    }
    this.popResourcePath();

    if (this.codeParts.length > 0) {
      const partsFilename = this.loaderContext[NS]([ { content: JSON.stringify(this.codeParts) } ] );
      return renderCode(partsFilename, source);
    } else {
      return source;
    }
  }

  private onMatch(event) {
    const { resourcePath, instructions } = event;
    if (resourcePath === this.currentResourcePath || this.resourcePathStack.indexOf(resourcePath) > -1) {
      this.createHighlightCode( this.compileInstructions(instructions) );
    }
  }

  private processMarkdown(source: string): string {
    const data = {
      mdSourceCodeRef: {
        resourcePath: this.currentResourcePath,
        onMatch: this.onMatch.bind(this),
      }
    };
    return this.markdownToHtml.transform(source, data);
  }

  private processHtml(htmlProcessor: DocsiAngularHtmlProcessor,
                      results: DocsiAngularHtmlProcessorElementVisitor['results']): string | undefined {
    for (const match of results) {
      if (match.type === 'markdown') {
        const newHtml: string[] = [];
        if (match.src) {
          const src = match.src.value;
          const fullPath = path.join(path.dirname(this.currentResourcePath), src);
          if (!fs.existsSync(fullPath)) {
            throw new Error(`[docsi/webpack]: Can't resolve '${src}' in '${this.currentResourcePath}' `);
          }
          this.pushResourcePath(fullPath);
          newHtml.push(
            this.processMarkdown(fs.readFileSync(fullPath, { encoding: 'utf-8' }))
          );
          // the call to `processMarkdown` will add this file to the dep's list only when it has source code ref's.
          // when not it will not be added, this is done through the subscription in run().
          // this will make sure it's added.
          this.addDependency(fullPath);
          this.popResourcePath();
        }
        if (match.ast.children.length) {
          newHtml.push(
            this.processMarkdown(htmlProcessor.innerHtml(match.ast))
          );
        }
        htmlProcessor.outerHtml(match.ast, newHtml.join('\n'));
      } else if (match.type === 'codeRef') {
        this.createHighlightCode( this.compileInstructions([ match.instructionMeta ]) );
        htmlProcessor.outerHtml(match.ast, '');
      }
    }
    return htmlProcessor.toString();
  }

  private compileInstructions(codeExtractions: SourceCodeRefMetadata[]): Instruction[] {
    const instructions: Instruction[] = [];

    for (const instructionMeta of codeExtractions) {
      if (!instructionMeta.file) {
        instructionMeta.file = this.currentResourcePath;
      }
      if (Array.isArray(instructionMeta.section)) {
        for (const s of instructionMeta.section) {
          instructions.push( this.cache.createInstruction(Object.assign({}, instructionMeta, { section: s })) );
        }
      } else {
        instructions.push( this.cache.createInstruction(instructionMeta) );
      }
    }

    return instructions;
  }

  private createHighlightCode(instructions: Instruction[]): void {
    for (const instruction of instructions) {
      this.addDependency(instruction.fullPath);
      const extracted = instruction.toExtractedCode();
      extracted.code = highlightAuto(extracted.code, [extracted.lang]).value;
      this.codeParts.push(extracted);
    }
  }

  private addDependency(fullPath: string): void {
    if (this.rootResourcePath !== fullPath) {
      this.loaderContext.addDependency(fullPath);
    }
  }

  private pushResourcePath(value: string): void {
    this.resourcePathStack.push(this.currentResourcePath = value);
  }

  private popResourcePath(): string {
    const removed = this.resourcePathStack.pop();
    this.currentResourcePath = this.resourcePathStack[this.resourcePathStack.length - 1];
    return removed;
  }
}

function renderCode(id: string, htmlCode: string): string {
  return `<docsi-example-code-container extractId="${id}">${htmlCode}</docsi-example-code-container>`;
}
