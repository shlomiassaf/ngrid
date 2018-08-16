const loaderUtils = require('loader-utils');

import { loader } from 'webpack';
import { RawSourceMap } from 'source-map';

import { MarkdownToHtml } from './remark';
import { DocsiAngularTemplateTransformer } from './angular-html-template-transformer';

let markdownToHtml: MarkdownToHtml;

export interface DocsiLoaderOptions {
  remarkPlugins?: any[];
}

export function loader (this: loader.LoaderContext, source: string, sourceMap?: RawSourceMap) {
  const options: DocsiLoaderOptions = loaderUtils.getOptions(this);
  if (!markdownToHtml) {
    markdownToHtml = new MarkdownToHtml({
      extraPlugins: options.remarkPlugins || [],
    })
  }
  this.cacheable();
  return new DocsiAngularTemplateTransformer(this, source, markdownToHtml).run();
};

