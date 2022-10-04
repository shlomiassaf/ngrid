import { SyncBailHook } from 'tapable';
import * as webpack from 'webpack';

const pluginName = 'pebula-no-clean-if-any-webpack-plugin';
const compilerHooksMap = new WeakMap<webpack.Compiler, PebulaNoCleanIfAnyWebpackPluginCompilerHooks>();

export interface PebulaNoCleanIfAnyWebpackPluginCompilerHooks {
  keep: SyncBailHook<string, boolean>;
}

export class PebulaNoCleanIfAnyWebpackPlugin {
  static getCompilationHooks(compiler: webpack.Compiler): PebulaNoCleanIfAnyWebpackPluginCompilerHooks {
    if (!(compiler instanceof webpack.Compiler)) {
      throw new TypeError("The 'compiler' argument must be an instance of Compiler");
    }
    let hooks = compilerHooksMap.get(compiler);
    if (hooks === undefined) {
      hooks = {
        keep: new SyncBailHook(['keep']),
      };
      compilerHooksMap.set(compiler, hooks);
    }
    return hooks;
  }

  apply(compiler: webpack.Compiler & { watchMode?: boolean }): void {
    PebulaNoCleanIfAnyWebpackPlugin.getCompilationHooks(compiler).keep.intercept({
      register: (tapInfo) => {
        var fn = tapInfo.fn;
        tapInfo.fn = (...args: any[]) => {
          var result = fn(...args);
          if (result === true) return true;
          return undefined;
        };
        return tapInfo;
      },
    });

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      webpack.CleanPlugin.getCompilationHooks(compilation).keep.tap(pluginName, (asset) => PebulaNoCleanIfAnyWebpackPlugin.getCompilationHooks(compiler).keep.call(asset));
    });
  }
}
