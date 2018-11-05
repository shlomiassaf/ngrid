import * as fs from 'fs';
import * as path from 'path';
import { loader } from 'webpack';
import { highlightAuto } from 'highlight.js';
const remarkPrismJs = require('gatsby-remark-prismjs');

import { NS } from '../unique-symbol';
import { Instruction, SourceCodeRef, ParsedInstructionCache, SourceCodeRefMetadata } from '../source-code-ref';
import { MarkdownToHtml } from '../remark';

import { DocsiAngularHtmlProcessor } from './html-processor';
import { DocsiAngularHtmlProcessorElementVisitor } from './html-processor-element-visitor';

export interface JsonCompileMarkdownMatch {
  type: 'markdown';
  src: string;
}

export interface JsonSourceCodeRefMatch {
  type: 'codeRef';
  instructionMeta: SourceCodeRefMetadata;
}

const readFile = (fullPath: string) => fs.readFileSync(fullPath, { encoding: 'utf-8' });

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
    let hasMarkdown = false;

    this.pushResourcePath(this.rootResourcePath);
    const docsiJsonInstructionsFile = path.join(path.dirname(this.currentResourcePath), './docsi.json');

    if (this.currentResourcePath.endsWith('.html')) {
      const compiledMarkdown = this.processJsonInstructions(docsiJsonInstructionsFile) || '';

      const byNameElementVisitors = new DocsiAngularHtmlProcessorElementVisitor();
      const htmlProcessor = new DocsiAngularHtmlProcessor(source);
      htmlProcessor.visitAll({ byNameElementVisitors });

      if (byNameElementVisitors.results.length > 0) {
        source = compiledMarkdown + this.processAngularHtmlTemplate(htmlProcessor, byNameElementVisitors.results);
      } else if (compiledMarkdown) {
        source = compiledMarkdown;
      }
      hasMarkdown = !!compiledMarkdown;
    } else if (this.currentResourcePath.endsWith('.md')) {
      this.processJsonInstructions(docsiJsonInstructionsFile);
      source = this.processMarkdown(source);
      hasMarkdown = true;
    }
    this.popResourcePath();

    if (this.codeParts.length > 0) {
      const partsFilename = this.loaderContext[NS]([ { content: JSON.stringify(this.codeParts) } ] );
      return renderCode(source, partsFilename);
    } else {
      return hasMarkdown ? renderCode(source) : source;
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

  private processJsonInstructions(possibleJsonFilePath: string): string | undefined {
    if (!fs.existsSync(possibleJsonFilePath)) { return; }

    const results: Array<JsonCompileMarkdownMatch | JsonSourceCodeRefMatch> = [];
    const instructions: { mdTemplate?: string[], codeRef?: SourceCodeRefMetadata[] } = require(possibleJsonFilePath);
    if (instructions.codeRef) {
      for (const codeRef of instructions.codeRef) {
        results.push({ type: 'codeRef', instructionMeta: codeRef });
      }
    }
    if (instructions.mdTemplate) {
      for (const tpl of instructions.mdTemplate) {
        results.push({ type: 'markdown', src: tpl });
      }
    }

    this.loaderContext.addDependency(possibleJsonFilePath);

    const compiledMarkdown: string[] = [];
    for (const match of results) {
      if (match.type === 'markdown') {
        if (match.src) {
          const src = match.src;
          const fullPath = path.join(path.dirname(this.currentResourcePath), src);
          if (!fs.existsSync(fullPath)) {
            throw new Error(`[docsi/webpack]: Can't resolve '${src}' in '${this.currentResourcePath}' `);
          }
          this.pushResourcePath(fullPath);

          compiledMarkdown.push( this.processMarkdown(readFile(fullPath)) );

          // the call to `processMarkdown` will add this file to the dep's list only when it has source code ref's.
          // when not it will not be added, this is done through the subscription in run().
          // this will make sure it's added.
          this.addDependency(fullPath);
          this.popResourcePath();
        }
      } else if (match.type === 'codeRef') {
        this.createHighlightCode( this.compileInstructions([ match.instructionMeta ]) );
      }
    }
    return compiledMarkdown.join('\n');
  }

  private processAngularHtmlTemplate(htmlProcessor: DocsiAngularHtmlProcessor,
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
          newHtml.push( this.processMarkdown(readFile(fullPath)) );
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

      const { highlight } = this.markdownToHtml.options;
      switch (highlight) {
        case 'prismjs':
          const markdownAST = {
            lang: extracted.lang,
            value: extracted.code,
            type: 'code',
          }
          remarkPrismJs({ markdownAST });
          extracted.code = markdownAST.value;
          break;
        case 'highlightjs':
          extracted.code = highlightAuto(extracted.code, [extracted.lang]).value;
          break;
        default:
         extracted.code = `<pre><code>${extracted.code}</code></pre>`;
      }
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

function renderCode(htmlCode: string, id?: string): string {
  const extractIdAttribute = id ? ` extractId="${id}"` : '';
  return `<docsi-example-code-container ${extractIdAttribute}>${htmlCode}</docsi-example-code-container>`;
}
