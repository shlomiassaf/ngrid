import * as Path from 'path';
import * as webpack from 'webpack';

import { DocsiTypedocApplication, createApiReferenceMap, ApiReferenceMap } from '../../api-reference';

const pluginName = 'docsi-api-reference-webpack-plugin';

declare module '../metadata-file-emitter/plugin' {
  interface DocsiMetadata {
    apiReference: {
      index: ApiReferenceMap;
    };
  }
}

export interface DocsiApiReferenceWebpackPluginOptions {
  mode: 'single-repo' | 'mono-repo';

  /**
   * A list of absolute path's to the entry points (index.ts, public_api.ts, etc..) of the libraries we want to create the API for.. (or library in single-repo mode).
   *
   * ## NOTE
   * The plugin assumes that the directory that holds the entry point is the top most directory for the entire library exposed by the entry point.
   * When running in dev mode the api will re-generate only when files within the directory changes.
   *
   * To override this behavior use `boundaries`
   */
  entryPoints: string[];

  /**
   * A list of directory names that contain TS code related to the api.
   * By default, the boundaries are automatically set based on the entry points provided.
   * You can extend the default boundaries by added more paths here.
   */
  boundaries?: string[];

  tsconfig?: string;
}

export class DocsiApiReferenceWebpackPlugin implements webpack.Plugin {
  startTime = Date.now();
  prevTimestamps = new Map<string, number>();

  mode: 'monorepo' | 'standalone';
  entryPoints: string[];
  boundaries: string[];
  tsconfig: string;

  constructor(options: DocsiApiReferenceWebpackPluginOptions) {
    const { entryPoints, mode, boundaries } = options;
    if (!entryPoints || entryPoints.length === 0) {
      throw new Error('[DocsiApiReferenceWebpackPlugin]: You must provide at lease one entry point.')
    }
    this.mode = mode === 'mono-repo' ? 'monorepo' : 'standalone';
    this.entryPoints = this.mode === 'standalone' ? entryPoints.slice(0, 1) : entryPoints.slice();
    if (options.tsconfig) {
      this.tsconfig = options.tsconfig;
    }

    const boundariesSet = new Set<string>(this.entryPoints.map( ep => Path.dirname(ep) ));
    if (boundaries) {
      for (const b of boundaries) {
        boundariesSet.add(b);
      }
    }
    this.boundaries = Array.from(boundariesSet.values());
    this.boundaries.sort();
    for (let i = this.boundaries.length - 1; i > 0; i--) {
      if (this.boundaries[i].indexOf(this.boundaries[i-1]) === 0) {
        this.boundaries.splice(i, 1);
      }
    }
  }

  apply(compiler: webpack.Compiler): void {

    compiler.hooks.docsiMetadataNotifier.tap(pluginName, notifier => {
      notifier('apiReference', { index: {} as any });

      compiler.hooks.thisCompilation.tap(pluginName, compilation => {
        try {
          const options: any = {
            module: 'commonjs',
            mode: 'modules',
            experimentalDecorators: true,
            excludeExternals: true,
            ignoreCompilerErrors: 'true',
            libraryType: this.mode,
            enforcePublicApi: this.entryPoints
          };
          if (this.tsconfig) {
            options.tsconfig = this.tsconfig;
          }

          let rebuildDocs = compilation.fileTimestamps.size === 0 && this.prevTimestamps.size === 0;
          if (!rebuildDocs) {
            const fileTimestampsEntries = Array.from(compilation.fileTimestamps.entries());
            for (const [file, timestamp] of fileTimestampsEntries) {
              if (file.endsWith('.ts') && (this.prevTimestamps.get(file) || this.startTime) < (timestamp || Infinity)) {
                if (this.boundaries.some( b => file.indexOf(b) === 0 )) {
                  rebuildDocs = true;
                  break;
                }
              }
            }
          }

          if (rebuildDocs) {
            const ds = new DocsiTypedocApplication(options).generateJsonObject();

            const apiRefMap = createApiReferenceMap(ds);
            notifier('apiReference', { index: apiRefMap });
          }

          this.prevTimestamps = compilation.fileTimestamps;
        } catch (err) {
          throw err;
        }
      });
    });
  }

  toAsset(obj: any): any {
    const source = JSON.stringify(obj);
    return {
      source: function() {
        return source;
      },
      size: function() {
        return source.length;
      }
    };
  }
}
