import * as Path from 'path';
import * as FS from 'fs';
import * as globby from 'globby';
import * as matter from 'gray-matter';
import { SyncHook } from 'tapable';
import * as webpack from 'webpack';
import * as unified from 'unified';
import * as markdown from 'remark-parse';
import * as remarkHtml from 'remark-html';

const { util: { createHash } } = webpack as any;

import { PebulaDynamicDictionaryWebpackPlugin } from '@pebula-internal/webpack-dynamic-dictionary';
import { ParsedPage, PageNavigationMetadata, PageAttributes } from './models';
import { createPageFileAsset, sortPageAssetNavEntry } from './utils';

declare module '@pebula-internal/webpack-dynamic-dictionary/plugin' {
  interface DynamicExportedObject {
    markdownPages: string;
  }
}

const pluginName = 'markdown-pages-webpack-plugin';
const compilerHooksMap = new WeakMap<webpack.Compiler, MarkdownPagesWebpackPluginCompilerHooks>();

export interface MarkdownPagesWebpackPluginCompilerHooks {
  markdownPageNavigationMetadataReady: SyncHook<{ navMetadata: PageNavigationMetadata, compilation: webpack.Compilation }>;
  markdownPageParsed: SyncHook<{ parsedPage: ParsedPage, compilation: webpack.Compilation }>;
}

export interface MarkdownPagesWebpackPluginOptions {
  context: string;
  docsPath: string | string[];
  docsRoot?: string;
  outputAssetPathRoot?: string;
  remarkPlugins: any[];
}

export class MarkdownPagesWebpackPlugin {

  static getCompilationHooks(compiler: webpack.Compiler): MarkdownPagesWebpackPluginCompilerHooks {
		if (!(compiler instanceof webpack.Compiler)) {
			throw new TypeError(
				"The 'compiler' argument must be an instance of Compiler"
			);
		}
		let hooks = compilerHooksMap.get(compiler);
		if (hooks === undefined) {
      hooks = {
        markdownPageNavigationMetadataReady: new SyncHook(['markdownPageNavigationMetadataReady']),
        markdownPageParsed: new SyncHook(['markdownPageParsed']),
      }
      compilerHooksMap.set(compiler, hooks);
    }
    return hooks;
  }

  startTime = Date.now();
  prevTimestamps = new Map<string, number>();

  private options: MarkdownPagesWebpackPluginOptions;
  private cache = new Map<string, ParsedPage>();
  private firstRun = true;
  private compiler: webpack.Compiler & { watchMode?: boolean };
  private watchMode?: boolean;

  private get remarkCompiler() {
    if (!this.__remarkCompiler) {
      this.__remarkCompiler =  unified()
        .use(markdown, { gfm: true })
        .use(this.options.remarkPlugins)
        .use(remarkHtml)
        .freeze();
    }

    return this.__remarkCompiler;
  }
  private __remarkCompiler: unified.Processor;
  private root: string;
  private outputAssetPathRoot: string;

  constructor(options: MarkdownPagesWebpackPluginOptions) {
    this.options = { ...options };
  }

  apply(compiler: webpack.Compiler & { watchMode?: boolean }): void {
    const { docsRoot, context } = this.options;
    this.root = context;
    if (docsRoot) {
      if (Path.isAbsolute(docsRoot)) {
        this.root = docsRoot;
      } else {
        this.root = Path.join(this.root, docsRoot);
      }
    }
    this.outputAssetPathRoot = this.options.outputAssetPathRoot || '';

    this.compiler = compiler;

    compiler.hooks.run.tapPromise(pluginName, async () => { await this.run(compiler); });
    compiler.hooks.watchRun.tapPromise(pluginName, async () => { await this.run(compiler); });
    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      this.emit(compilation);
      compilation.hooks.afterSeal.tapPromise(pluginName, async () => {
        for (const obj of Array.from(this.cache.values())) {
          compilation.fileDependencies.add(obj.fullPath);
        }
        this.prevTimestamps = compilation.fileSystemInfo.getDeprecatedFileTimestamps();
      });
    });


  }

  private emit(compilation: webpack.Compilation) {
    let changedFiles: Set<ParsedPage>;

    if (!this.firstRun && this.watchMode) {
      changedFiles = new Set<ParsedPage>();
      for (const obj of Array.from(this.cache.values())) {
        if (obj.forceRender
            || !obj.postRenderMetadata
            || (this.prevTimestamps.get(obj.fullPath) || this.startTime) < (compilation.fileSystemInfo.getDeprecatedFileTimestamps().get(obj.fullPath) || Infinity) ) {
          changedFiles.add(obj);
        }
      }
    } else {
      changedFiles = new Set(this.cache.values());
    }

    if (changedFiles.size === 0) {
      return;
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
        outputAssetPath = this.outputAssetPathRoot + Path.join(Path.dirname(obj.file), `${hash.digest(hashDigest).substring(0, hashDigestLength)}.json`);

        compilation.assets[outputAssetPath] = new webpack.sources.RawSource(source);
      }

      obj.postRenderMetadata = {
        navEntry: {
          title: obj.attr.title,
          path: obj.attr.path,
        },
        outputAssetPath,
      };

      const copyKeys: Array<keyof PageAttributes> = ['type', 'subType', 'tooltip', 'searchGroup'];
      copyKeys.forEach( key => {
        if (obj.attr[key]) {
          obj.postRenderMetadata.navEntry[key] = obj.attr[key];
        }
      });

      if (obj.attr.tags) {
        obj.postRenderMetadata.navEntry.tags = obj.attr.tags.split(',').map( t => t.trim() );
      }
      if (obj.attr.ordinal >= 0) {
        obj.postRenderMetadata.navEntry.ordinal = obj.attr.ordinal;
      }
      if (!obj.attr.empty) {
        MarkdownPagesWebpackPlugin.getCompilationHooks(this.compiler).markdownPageParsed.call({ parsedPage: obj, compilation })
      }
    };

    const navMetadata: PageNavigationMetadata = {
      entries: {
      },
      entryData: {},
    };
    const children: ParsedPage[] = [];

    for (let obj of Array.from(this.cache.values())) {

      if (changedFiles.has(obj)) {
        if (!obj.forceRender && !!obj.postRenderMetadata) {
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

      const now = Date.now();
      compilation.fileSystemInfo.getDeprecatedFileTimestamps().set(obj.fullPath,now);
      this.prevTimestamps.set(obj.fullPath, now);
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
      compilation.errors.push(new webpack.WebpackError(`Could not find a parent/child relationship in ${children.map(c => c.file).join(', ')}`));
    }

    Object.values(navMetadata.entries).forEach(sortPageAssetNavEntry);

    const navEntriesSource = JSON.stringify(navMetadata);
    const hash = createHash(hashFunction);
    hash.update(navEntriesSource);
    const navEntriesAssetPath = `${hash.digest(hashDigest).substring(0, hashDigestLength)}.json`;

    // TODO: Remove previous asset
    compilation.assets[navEntriesAssetPath] = new webpack.sources.RawSource(navEntriesSource);

    MarkdownPagesWebpackPlugin.getCompilationHooks(this.compiler)
      .markdownPageNavigationMetadataReady.call({ navMetadata, compilation });

    PebulaDynamicDictionaryWebpackPlugin.find(this.compiler).update('markdownPages', navEntriesAssetPath);

    this.firstRun = false;
  }

  private async run(compiler: webpack.Compiler & { watchMode?: boolean }) {
    // Store watch mode; assume true if not present (webpack < 4.23.0)
    this.watchMode = compiler.watchMode ?? true;
    const paths = await globby(this.options.docsPath, {
      cwd: this.root,
    });

    for (const p of paths) {
      if (this.firstRun || !this.cache.has(p)) {
        this.processFile(p);
      }
    }
  }

  private processFile(file: string) {
    const fullPath = Path.join(this.root, file);
    const source = FS.readFileSync(fullPath, { encoding: 'utf-8' });
    const parsedAttr = matter(source);
    const contents = this.remarkCompiler().processSync(parsedAttr.content).contents as string;

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
