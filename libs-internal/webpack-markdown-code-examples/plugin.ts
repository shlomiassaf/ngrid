import * as Path from 'path';
import * as FS from 'fs';
import * as globby from 'globby';
import * as webpack from 'webpack';

const remarkPrismJs = require('gatsby-remark-prismjs');

const { util: { createHash } } = webpack as any;

import { DynamicModuleUpdater, PebulaDynamicModuleWebpackPlugin } from '@pebula-internal/webpack-dynamic-module';
import { ParsedExampleMetadata, ExampleFileAsset } from './models';
import { createInitialExampleFileAssets, parseExampleTsFile } from './utils';

declare module '@pebula-internal/webpack-dynamic-module/plugin' {
  interface DynamicExportedObject {
    markdownCodeExamples: string;
  }
}

const pluginName = 'markdown-code-examples-webpack-plugin';

export interface MarkdownCodeExamplesWebpackPluginOptions {
  docsPath: string | string[];
}

export class MarkdownCodeExamplesWebpackPlugin implements webpack.Plugin {

  startTime = Date.now();
  prevTimestamps = new Map<string, number>();

  private options: MarkdownCodeExamplesWebpackPluginOptions;
  private cache = new Map<string, ParsedExampleMetadata>();
  private firstRun = true;
  private compiler: webpack.Compiler;

  constructor(private dynamicModulePlugin: PebulaDynamicModuleWebpackPlugin, options: MarkdownCodeExamplesWebpackPluginOptions) {
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
          for (const fullPath of Array.from(obj.pathAssets.keys())) {
            compilation.fileDependencies.add(fullPath);
          }
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

    const renderPage = (obj: ParsedExampleMetadata) => {
      if (obj.postRenderMetadata) {
        delete compilation.assets[obj.postRenderMetadata.outputAssetPath];
      }

      let outputAssetPath: string;
      const source = JSON.stringify(obj.assets)
      const hash = createHash(hashFunction);
      hash.update(source);
      outputAssetPath = `${obj.selector}-${hash.digest(hashDigest).substring(0, hashDigestLength)}.json`;

      compilation.assets[outputAssetPath] = {
        source: () => source,
        size: () => source.length
      };

      obj.postRenderMetadata = {
        outputAssetPath,
      }
    }

    const navMetadata: { [selector: string]: string  } = {};

    for (let obj of Array.from(this.cache.values())) {

      if (obj.forceRender || !obj.postRenderMetadata || !changedFiles) {
        obj.forceRender = false;
        renderPage(obj);
      } else if (changedFiles) {
        for (const fullPath of Array.from(obj.pathAssets.keys())) {
          if (changedFiles.has(fullPath)) {
            obj = this.processFile(obj.cacheId);
            obj.forceRender = false;
            renderPage(obj);
            break;
          }
        }
      }

      if (obj.postRenderMetadata.outputAssetPath) {
        navMetadata[obj.selector] = obj.postRenderMetadata.outputAssetPath;
      }
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
    notifier('markdownCodeExamples', navEntriesAssetPath);

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
    const root = Path.dirname(fullPath);
    const primary = parseExampleTsFile(fullPath, source);

    if (primary) {
      const assets = createInitialExampleFileAssets(fullPath, primary);
      const pathAssets = new Map<string, ExampleFileAsset>();
      for (const asset of assets) {
        if (asset.parent === primary.component && asset.lang === 'typescript') {
          asset.source = source;
          pathAssets.set(fullPath, asset);
        } else {
          const secondaryFullPath = Path.join(root, asset.file);
          asset.source = FS.readFileSync(secondaryFullPath, { encoding: 'utf-8' });
          pathAssets.set(secondaryFullPath, asset);
        }
        const markdownAST = {
          lang: asset.lang,
          value: asset.source,
          type: 'code',
        };
        remarkPrismJs({ markdownAST });
        asset.contents = markdownAST.value;
      }


      const parsedExample: ParsedExampleMetadata = {
        cacheId: file,
        selector: primary.selector,
        root,
        assets,
        pathAssets,
        forceRender: true,
      };

      this.cache.set(file, parsedExample);
      return parsedExample;
    }
  }
}
