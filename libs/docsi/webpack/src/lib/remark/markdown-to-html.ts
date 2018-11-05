const unified = require('unified');
const markdown = require('remark-parse');
const html = require('remark-html');
const remarkHighlightJs = require('remark-highlight.js');
const remarkSlug = require('remark-slug')
const remarkAutolinkHeadings = require('@rigor789/remark-autolink-headings');
const remarkAttr = require('remark-attr')

import * as plugins from './plugins';

plugins.registerMultilineBlockHtmlTokenizer();

export interface MarkdownToHtmlOptions {
  highlight?: 'highlightjs' | 'prismjs';
  extraPlugins?: any[];
}

//tslint:disable-next-line:no-empty-interface
export interface MarkdownToHtmlRuntimeOptions { };

const customBlockquotesOptions = { mapping: {
  'i>': 'info',
  'I>': 'info icon',
  'w>': 'warn',
  'W>': 'warn icon',
  'e>': 'error',
  'E>': 'error icon',
}};

export class MarkdownToHtml {
  private readonly compiler: any;

  constructor(public readonly options: MarkdownToHtmlOptions) {
    this.compiler = unified()
      .use(markdown, { gfm: true })
      .use(remarkSlug)
      .use(remarkAutolinkHeadings)
      .use(plugins.docsiToc)
      .use(remarkAttr, { scope: 'permissive' })
      .use(plugins.mdSourceCodeRef);

      switch(options.highlight) {
        case 'highlightjs':
          this.compiler = this.compiler.use(remarkHighlightJs);
          break;
        case 'prismjs':
          this.compiler = this.compiler.use(plugins.gatsbyRemarkPrismJs);
          break;
      }

      this.compiler = this.compiler
        .use(plugins.noCurelyBrackets)
        .use(plugins.customBlockquotes, customBlockquotesOptions)
        .use(options.extraPlugins || [])
        .use(html)
        .freeze();
  }

  transform(markdownSource: string, runtimeOptions: MarkdownToHtmlRuntimeOptions): string {
    return this.compiler().data(runtimeOptions).processSync(markdownSource);
  }
}
