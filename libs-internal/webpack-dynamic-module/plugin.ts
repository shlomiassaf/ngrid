import { SyncHook } from 'tapable';
import * as webpack from 'webpack';

const VirtualModulesPlugin = require('webpack-virtual-modules');

declare module 'webpack' {
  export namespace compilation {
    export interface CompilerHooks {
      pebulaDynamicModuleUpdater: SyncHook<DynamicModuleUpdater>;
    }
  }
}

export interface DynamicExportedObject { }; //tslint:disable-line

export type DynamicModuleUpdater = <T extends keyof DynamicExportedObject>(key: T, value: DynamicExportedObject[T]) => void;

const pluginName = 'pebula-dynamic-module-webpack-plugin';

export class PebulaDynamicModuleWebpackPlugin implements webpack.Plugin {

  private virtualModules: import('webpack-virtual-modules') = new VirtualModulesPlugin();

  constructor(private readonly writePath: string) {
  }

  apply(compiler: webpack.Compiler): void {
    this.virtualModules.apply(compiler);
    const metadata: DynamicExportedObject = {} as any;
    const updateModule = () => {
      // We add a file to the file system (virtually) that contains the metadata required
      // to load files dynamically at runtime.

      this.virtualModules.writeModule(`node_modules/${this.writePath}`, `module.exports = ${JSON.stringify(metadata, null, 2)};`);
    }

    const notifier = <T extends keyof DynamicExportedObject>(key: T, value: DynamicExportedObject[T]) => {
      metadata[key] = value;
      updateModule();
    }

    if (compiler.hooks.pebulaDynamicModuleUpdater) {
      throw new Error('[PebulaDynamicModuleWebpackPlugin]: Compiler hook "pebulaDynamicModuleUpdater" already in use.');
    }
    compiler.hooks.pebulaDynamicModuleUpdater = new SyncHook(['pebulaDynamicModuleUpdater']);

    compiler.hooks.afterEnvironment.tap(pluginName, () => {
      // The angular CLI will "fake" non watch mode within watch mode when dev-server is running
      // This will trick `VirtualModulesPlugin` to think it's watch mode but it's not so it will error
      // This is the fix
      // See: https://github.com/angular/angular-cli/blob/a7b9497b63f8608e4640f68e24558aa6b20f6f7a/packages/angular_devkit/build_angular/src/webpack/configs/dev-server.ts#L63
      const wfs = compiler['watchFileSystem'];
      if (wfs?.watch && !wfs.watcher ) {
        Object.defineProperty(this.virtualModules, '_watcher', {
          get: () => null,
          set: v => {},
        })
      }

      updateModule();
      compiler.hooks.pebulaDynamicModuleUpdater.call(notifier);
    });

  }
}
