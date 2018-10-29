import { SyncHook } from 'tapable';
import * as webpack from 'webpack';

const pluginName = 'docsi-metadata-file-emitter-webpack-plugin';

export type DocsiMetadataUpdateNotifier = <T extends keyof DocsiMetadata>(key: T, value: DocsiMetadata[T]) => void;

declare module 'webpack' {
  export namespace compilation {
    export interface CompilerHooks {
      docsiMetadataNotifier: SyncHook<DocsiMetadataUpdateNotifier>;
    }
  }
}

export interface DocsiMetadata { }; //tslint:disable-line

export class DocsiMetadataFileEmitterWebpackPlugin implements webpack.Plugin {

  apply(compiler: webpack.Compiler): void {
    const metadata: DocsiMetadata = {} as any;
    const updateModule = () => {
      (compiler.inputFileSystem as any)._webpackCompilerHost
        .writeFile('/Users/shlomiassaf/Desktop/Code/shlomi/__LIB__/neg/docsi-client-metadata.js', `module.exports = ${JSON.stringify(metadata, null, 2)};`);
    }
    const notifier = <T extends keyof DocsiMetadata>(key: T, value: DocsiMetadata[T]) => {
      metadata[key] = value;
      updateModule();
    }

    if (compiler.hooks.docsiMetadataNotifier) {
      throw new Error('[DocsiMetadataFileEmitterWebpackPlugin]: Compiler hook "docsiMetadataNotifier" already in use.');
    }
    compiler.hooks.docsiMetadataNotifier = new SyncHook(['notifier']);

    compiler.hooks.afterEnvironment.tap(pluginName, () => {
      updateModule();
      compiler.hooks.docsiMetadataNotifier.call(notifier);
    });
  }
}
