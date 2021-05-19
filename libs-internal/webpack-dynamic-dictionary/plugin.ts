import * as webpack from 'webpack';
export interface DynamicExportedObject { }; //tslint:disable-line

const pluginName = 'pebula-dynamic-dictionary-webpack-plugin';
const store = new WeakMap<webpack.Compiler, PebulaDynamicDictionaryWebpackPlugin>();

class LazySource {

  private metadata: DynamicExportedObject = {} as any;

  update<T extends keyof DynamicExportedObject>(key: T, value?: DynamicExportedObject[T]): void {
    if (value === undefined) {
      delete this.metadata[key];
    } else {
      this.metadata[key] = value;
    }
  }

  toSource() {
    return new webpack.sources.CachedSource(() => {
      return new webpack.sources.RawSource(JSON.stringify(this.metadata));
    })

  }
}


/**
 * A simple plugin that just allows to expose a dynamic JSON object which can be live edited until main compilation emits.
 */
export class PebulaDynamicDictionaryWebpackPlugin {

  private lazySource = new LazySource();

  constructor(private readonly writePath: string) { }

  static find(compiler: webpack.Compiler): Pick<PebulaDynamicDictionaryWebpackPlugin, 'update'> | undefined {
    return store.get(compiler);
  }

  apply(compiler: webpack.Compiler): void {
    store.set(compiler, this);
    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      compilation.assets[this.writePath] = this.lazySource.toSource();
    });
  }

  update<T extends keyof DynamicExportedObject>(key: T, value?: DynamicExportedObject[T]): void {
    this.lazySource.update(key, value);
  }
}
