import * as Path from 'path';
import * as FS from 'fs';
import * as globby from 'globby';
import * as webpack from 'webpack';

const remarkPrismJs = require('gatsby-remark-prismjs');

const { util: { createHash } } = webpack as any;

import { PebulaDynamicDictionaryWebpackPlugin } from '@pebula-internal/webpack-dynamic-dictionary';
import { ParsedExampleMetadata, ExampleFileAsset } from './models';
import { createInitialExampleFileAssets, parseExampleTsFile } from './utils';

declare module '@pebula-internal/webpack-dynamic-dictionary/plugin' {
  interface DynamicExportedObject {
    markdownCodeExamples: string;
  }
}

const pluginName = 'markdown-code-examples-webpack-plugin';

export interface MarkdownCodeExamplesWebpackPluginOptions {
  context: string;
  docsPath: string | string[];
}

export class MarkdownCodeExamplesWebpackPlugin {

  startTime = Date.now();
  prevTimestamps = new Map<string, number>();

  private options: MarkdownCodeExamplesWebpackPluginOptions;
  private cache = new Map<string, ParsedExampleMetadata>();
  private firstRun = true;
  private compiler: webpack.Compiler & { watchMode?: boolean };
  private watchMode?: boolean;

  constructor(options: MarkdownCodeExamplesWebpackPluginOptions) {
    this.options = { ...options };
  }

  apply(compiler: webpack.Compiler & { watchMode?: boolean }): void {
    this.compiler = compiler;
    compiler.hooks.run.tapPromise(pluginName, async () => { await this.run(compiler); });
    compiler.hooks.watchRun.tapPromise(pluginName, async () => { await this.run(compiler); });
    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      this.emit(compilation);
      compilation.hooks.afterSeal.tapPromise(pluginName, async () => {
        for (const obj of Array.from(this.cache.values())) {
          for (const fullPath of Array.from(obj.pathAssets.keys())) {
            compilation.fileDependencies.add(fullPath);
          }
        }
        this.prevTimestamps = compilation.fileSystemInfo.getDeprecatedFileTimestamps();
      });
    });
  }

  private emit(compilation: webpack.Compilation) {
    let changedFiles: Set<ParsedExampleMetadata>;

    if (!this.firstRun && this.watchMode) {
      changedFiles = new Set<ParsedExampleMetadata>();
      for (const obj of Array.from(this.cache.values())) {
        if (obj.forceRender || !obj.postRenderMetadata) {
          changedFiles.add(obj);
        } else {
          for (const watchFile of Array.from(obj.pathAssets.keys())) {
            if ( (this.prevTimestamps.get(watchFile) || this.startTime) < (compilation.fileSystemInfo.getDeprecatedFileTimestamps().get(watchFile) || Infinity) ) {
              changedFiles.add(obj);
            }
          }
        }
      }
    } else {
      changedFiles = new Set(this.cache.values());
    }

    if (changedFiles.size === 0) {
      return;
    }

    const { hashFunction, hashDigest, hashDigestLength } = compilation.outputOptions;

    const renderPage = (obj: ParsedExampleMetadata) => {
      if (obj.postRenderMetadata) {
        delete compilation.assets[obj.postRenderMetadata.outputAssetPath];
      }

      let outputAssetPath: string;
      const source = JSON.stringify(obj.assets)
      const hash = createHash(hashFunction);
      hash.update(source);
      outputAssetPath = `${obj.selector}-${hash.digest(hashDigest).substring(0, hashDigestLength)}.json`;

      compilation.assets[outputAssetPath] = new webpack.sources.RawSource(source);

      obj.postRenderMetadata = {
        outputAssetPath,
      }
    }

    const navMetadata: { [selector: string]: string  } = {};

    for (let obj of Array.from(this.cache.values())) {

      if (changedFiles.has(obj)) {
        if (!obj.forceRender && !!obj.postRenderMetadata) {
          obj = this.processFile(obj.cacheId);
        }
        obj.forceRender = false;
        renderPage(obj);
      }

      if (obj.postRenderMetadata.outputAssetPath) {
        navMetadata[obj.selector] = obj.postRenderMetadata.outputAssetPath;
      }

      const now = Date.now();
      for (const watchFile of Array.from(obj.pathAssets.keys())) {
        compilation.fileSystemInfo.getDeprecatedFileTimestamps().set(watchFile, now);
        this.prevTimestamps.set(watchFile, now);
      }

    }

    const navEntriesSource = JSON.stringify(navMetadata);
    const hash = createHash(hashFunction);
    hash.update(navEntriesSource);
    const navEntriesAssetPath = `${hash.digest(hashDigest).substring(0, hashDigestLength)}.json`;

    // TODO: Remove previous asset
    compilation.assets[navEntriesAssetPath] = new webpack.sources.RawSource(navEntriesSource);

    PebulaDynamicDictionaryWebpackPlugin.find(this.compiler).update('markdownCodeExamples', navEntriesAssetPath);

    this.firstRun = false;
  }

  private async run(compiler: webpack.Compiler & { watchMode?: boolean }) {
    // Store watch mode; assume true if not present (webpack < 4.23.0)
    this.watchMode = compiler.watchMode ?? true;
    const paths = await globby(this.options.docsPath, {
      cwd: this.options.context
    });

    for (const p of paths) {
      if (this.firstRun || !this.cache.has(p)) {
        this.processFile(p);
      }
    }
  }

  private processFile(file: string) {
    const fullPath = Path.join(this.options.context, file);
    const source = FS.readFileSync(fullPath, { encoding: 'utf-8' });
    const root = Path.dirname(fullPath);
    const primary = parseExampleTsFile(fullPath, source);

    if (primary) {
      const assets = createInitialExampleFileAssets(fullPath, primary);
      const pathAssets = new Map<string, ExampleFileAsset>();
      for (const asset of assets) {
        if (asset.parent === primary.component && asset.lang === 'typescript') {
          asset.source = source.split('\n').filter( line => !line.startsWith('@Example(') && !(line.startsWith('import') && line.includes(' Example '))).join('\n');
          pathAssets.set(fullPath, asset);
        } else {
          const secondaryFullPath = Path.join(root, asset.file);
          asset.source = FS.readFileSync(secondaryFullPath, { encoding: 'utf-8' });
          if (asset.source) {
            pathAssets.set(secondaryFullPath, asset);
          }
        }
        if (asset.source) {
          const markdownAST = {
            lang: asset.lang,
            value: asset.source,
            type: 'code',
          };
          remarkPrismJs({ markdownAST });
          asset.contents = markdownAST.value;
        }
      }


      const parsedExample: ParsedExampleMetadata = {
        cacheId: file,
        selector: primary.selector,
        root,
        assets: assets.filter( a => !!a.source ),
        pathAssets,
        forceRender: true,
      };

      this.cache.set(file, parsedExample);
      return parsedExample;
    }
  }
}
