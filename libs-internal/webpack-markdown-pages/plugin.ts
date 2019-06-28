import * as Path from 'path';
import * as FS from 'fs';
import * as globby from 'globby';
import * as matter from 'gray-matter';
import * as webpack from 'webpack';

const { util: { createHash } } = webpack as any;

import { DynamicModuleUpdater, PebulaDynamicModuleWebpackPlugin } from '@pebula-internal/webpack-dynamic-module';
import { ParsedPage, PageNavigationMetadata } from './models';
import { createPageFileAsset } from './utils';

declare module '@pebula-internal/webpack-dynamic-module/plugin' {
  interface DynamicExportedObject {
    markdownPages: string;
  }
}

const pluginName = 'markdown-pages-webpack-plugin';

export interface MarkdownPagesWebpackPluginOptions {
  docsPath: string | string[];
  remarkPlugins: any[];
}

export class MarkdownPagesWebpackPlugin implements webpack.Plugin {

  startTime = Date.now();
  prevTimestamps = new Map<string, number>();

  private options: MarkdownPagesWebpackPluginOptions;
  private cache = new Map<string, ParsedPage>();
  private firstRun = true;
  private compiler: webpack.Compiler;
  private get remarkCompiler() {
    if (!this.__remarkCompiler) {
      const unified = require('unified');
      const markdown = require('remark-parse');
      const html = require('remark-html');

      this.__remarkCompiler =  unified()
        .use(markdown, { gfm: true })
        .use(this.options.remarkPlugins)
        .use(html)
        .freeze();
    }

    return this.__remarkCompiler;
  }
  private __remarkCompiler: any;

  constructor(private dynamicModulePlugin: PebulaDynamicModuleWebpackPlugin, options: MarkdownPagesWebpackPluginOptions) {
    this.options = { ...options };
  }

  apply(compiler: webpack.Compiler): void {
    this.compiler = compiler;
    compiler.hooks.pebulaDynamicModuleUpdater.tap(pluginName, notifier => {
      compiler.hooks.run.tapPromise(pluginName, async () => { await this.run(compiler); });
      compiler.hooks.watchRun.tapPromise(pluginName, async () => { await this.run(compiler); });
      compiler.hooks.compilation.tap(pluginName, compilation => { this.emit(compilation, notifier) });
      compiler.hooks.afterCompile.tapPromise(pluginName, async compilation => {
        for (let obj of Array.from(this.cache.values())) {
          compilation.fileDependencies.add(obj.fullPath);
        }
        this.prevTimestamps = compilation.fileTimestamps;
      });

    });
  }

  private emit(compilation: webpack.compilation.Compilation, notifier: DynamicModuleUpdater) {
    let changedFiles: Set<string>;

    if (!this.firstRun && this.compiler.options.watch) {
      changedFiles = new Set<string>();
      for (const watchFile of Array.from(compilation.fileTimestamps.keys())) {
        if ( (this.prevTimestamps.get(watchFile) || this.startTime) < (compilation.fileTimestamps.get(watchFile) || Infinity) ) {
          changedFiles.add(watchFile);
        }
      }
    }

    const { hashFunction, hashDigest, hashDigestLength } = compilation.outputOptions;

    const renderPage = (obj: ParsedPage) => {
      if (obj.postRenderMetadata) {
        delete compilation.assets[obj.postRenderMetadata.outputAssetPath];
      }

      let outputAssetPath: string;
      if (!obj.attr.empty) {
        const source = createPageFileAsset(obj);
        const hash = createHash(hashFunction);
        hash.update(source);
        outputAssetPath = Path.join(Path.dirname(obj.file), `${hash.digest(hashDigest).substring(0, hashDigestLength)}.json`);

        compilation.assets[outputAssetPath] = {
          source: () => source,
          size: () => source.length
        };
      }

      obj.postRenderMetadata = {
        navEntry: {
          title: obj.attr.title,
          path: obj.attr.path,
        },
        outputAssetPath,
      }
      if (obj.attr.tooltip) {
        obj.postRenderMetadata.navEntry.tooltip = obj.attr.tooltip;
      }
    }

    const navMetadata: PageNavigationMetadata = {
      entries: {
      },
      entryData: {},
    };
    const children: ParsedPage[] = [];

    for (let obj of Array.from(this.cache.values())) {

      if (obj.forceRender || !obj.postRenderMetadata || !changedFiles || changedFiles.has(obj.fullPath)) {
        if (changedFiles && changedFiles.has(obj.fullPath)) {
          obj = this.processFile(obj.file);
        }
        obj.forceRender = false;
        renderPage(obj);
      }

      delete obj.postRenderMetadata.navEntry.children;

      if (!obj.attr.parent) {
        const entryGroupKey = obj.attr.path;
        navMetadata.entries[entryGroupKey] = obj.postRenderMetadata.navEntry;
      } else {
        children.push(obj);
      }
      if (obj.postRenderMetadata.outputAssetPath) {
        navMetadata.entryData[obj.attr.path] = obj.postRenderMetadata.outputAssetPath;
      }
    }

    let len: number;
    while (children.length !== len) {
      len = children.length;
      for (let i=0; i < len; i++) {
        const o = children[i];
        if (o) {
          const parent = Array.from(this.cache.values()).find( p => p.attr.path === o.attr.parent);
          if (parent) {
            children.splice(i, 1);
            i--;
            if (!parent.postRenderMetadata.navEntry.children) {
              parent.postRenderMetadata.navEntry.children= [];
            }
            parent.postRenderMetadata.navEntry.children.push(o.postRenderMetadata.navEntry);
          }
        }
      }
    }

    if (children.length) {
      compilation.errors.push(new Error(`Could not find a parent/child relationship in ${children.map(c => c.file).join(', ')}`));
    }

    const navEntriesSource = JSON.stringify(navMetadata);
    const hash = createHash(hashFunction);
    hash.update(navEntriesSource);
    const navEntriesAssetPath = `${hash.digest(hashDigest).substring(0, hashDigestLength)}.json`;

    // TODO: Remove previous asset
    compilation.assets[navEntriesAssetPath] = {
      source: () => navEntriesSource,
      size: () => navEntriesSource.length
    };
    notifier('markdownPages', navEntriesAssetPath);

    this.firstRun = false;
  }

  private async run(compiler: webpack.Compiler) {
    const paths = await globby(this.options.docsPath, {
      cwd: compiler.options.context
    });

    for (const p of paths) {
      if (this.firstRun || !this.cache.has(p)) {
        this.processFile(p);
      }
    }
  }

  private processFile(file: string) {
    const fullPath = Path.join(this.compiler.options.context, file);
    const source = FS.readFileSync(fullPath, { encoding: 'utf-8' });
    const parsedAttr = matter(source);
    const contents = this.remarkCompiler().processSync(parsedAttr.content).contents;

    const parsedPage = {
      file,
      fullPath,
      source,
      contents,
      attr: parsedAttr.data as any,
      forceRender: true,
    };
    this.cache.set(file, parsedPage);
    return parsedPage;
  }
}
