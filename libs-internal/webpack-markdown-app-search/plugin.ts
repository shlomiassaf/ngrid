import * as webpack from 'webpack';
// import * as domino from 'domino';
import { DynamicModuleUpdater } from '@pebula-internal/webpack-dynamic-module';
import { ParsedPage } from '@pebula-internal/webpack-markdown-pages';
import { SearchableSource } from './models';

const domino = require('domino');
const { util: { createHash } } = webpack as any;

declare module '@pebula-internal/webpack-dynamic-module/plugin' {
  interface DynamicExportedObject {
    searchContent: string;
  }
}

const pluginName = 'markdown-app-search-webpack-plugin';

export interface MarkdownAppSearchWebpackPluginOptions {
}

export class MarkdownAppSearchWebpackPlugin implements webpack.Plugin {

  private options: MarkdownAppSearchWebpackPluginOptions;

  constructor(options: MarkdownAppSearchWebpackPluginOptions) {
    this.options = Object.assign({}, options);
  }

  apply(compiler: webpack.Compiler): void {

    const sources = new Map<string, SearchableSource>();
    let notifier: DynamicModuleUpdater;

    compiler.hooks.pebulaDynamicModuleUpdater.tap(pluginName, _notifier => {
      notifier = _notifier;
    });

    compiler.hooks.markdownPageParsed.tap(pluginName, (context) => {
      const { parsedPage, compilation } = context;
      const searchable = createSearchableSource(parsedPage);
      sources.set(searchable.path, searchable);
    });

    compiler.hooks.markdownPageNavigationMetadataReady.tap(pluginName, (context) => {
      const { compilation } = context;
      const { hashFunction, hashDigest, hashDigestLength } = compilation.outputOptions;

      const searchContent = JSON.stringify(Array.from(sources.values()));
      const hash = createHash(hashFunction);
      hash.update(searchContent);
      const sourceContentPath = `${hash.digest(hashDigest).substring(0, hashDigestLength)}.json`;

      notifier('searchContent', sourceContentPath);

      compilation.assets[sourceContentPath] = {
        source: () => searchContent,
        size: () => searchContent.length
      };
    });
  }

}

function createSearchableSource(parsedPage: ParsedPage): SearchableSource {
  const { navEntry } = parsedPage.postRenderMetadata;
  const doc = domino.createDocument(parsedPage.contents, true)
  const headingWords = new Set<string>();
  doc.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach( item => headingWords.add(item.textContent) );

  const searchable: SearchableSource = {
    path: navEntry.path,
    title: navEntry.title,
    titleWords: tokenize(navEntry.title).join(' '),
    headingWords: Array.from(headingWords.values()).join(' '),
    keywords: (navEntry.tags || []).join(' '),
  };
  return searchable;
}

// If the heading contains a name starting with ng, e.g. "ngController", then add the
// name without the ng to the text, e.g. "controller".
function tokenize(text) {
  const rawTokens = text.split(/[\s\/]+/mg);
  const tokens = [];
  rawTokens.forEach(token => {
    // Strip off unwanted trivial characters
    token = token
        .trim()
        .replace(/^[_\-"'`({[<$*)}\]>.]+/, '')
        .replace(/[_\-"'`({[<$*)}\]>.]+$/, '');
    // Ignore tokens that contain weird characters
    if (/^[\w.\-]+$/.test(token)) {
      tokens.push(token.toLowerCase());
      const ngTokenMatch = /^[nN]g([A-Z]\w*)/.exec(token);
      if (ngTokenMatch) {
        tokens.push(ngTokenMatch[1].toLowerCase());
      }
    }
  });
  return tokens;
}
