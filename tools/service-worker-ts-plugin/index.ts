// tslint:disable:no-var-requires
import { Stats, Compiler, Watching, compilation as Compilation } from 'webpack';
import * as webpack from 'webpack';
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ServiceWorkerWebpackPlugin: ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

export interface WebpackError {
  module?: any;
  file?: string;
  message: string;
  location?: { line: number, character: number };
  loaderSource: string;
}

interface ForkTsCheckerWebpackPlugin {
  new (opt: ForkTsCheckerWebpackPluginOptions): { apply(compiler: Compiler); };
}

interface ServiceWorkerWebpackPlugin {
  new (opt: ServiceWorkerWebpackPluginOptions): {
    handleMake(compilation, compiler);
    handleEmit(compilation, compiler, callback);
    apply(compiler: Compiler);
  };
}

/**
 * See https://github.com/oliviertassinari/serviceworker-webpack-plugin for docs
 */
export interface ServiceWorkerTemplateOptions {
  assets: string[];
  jsonStats: Stats.ToJsonOptionsObject;
}
/**
 * See https://github.com/oliviertassinari/serviceworker-webpack-plugin for docs
 */
export interface ServiceWorkerRuntimeOptions {
  assets: string[];
  [key: string]: any;
}
/**
 * See https://github.com/oliviertassinari/serviceworker-webpack-plugin for docs
 */
export interface ServiceWorkerWebpackPluginOptions {
  publicPath?: string;
  excludes?: string[];
  includes?: string[];
  entry: string;
  filename?: string;
  template?: (serviceWorkerOption: ServiceWorkerTemplateOptions) => Promise<string>;
  transformOptions?: (serviceWorkerOption: ServiceWorkerRuntimeOptions) => any;
}

/**
 * See https://github.com/Realytics/fork-ts-checker-webpack-plugin for docs
 */
export interface ForkTsCheckerWebpackPluginOptions {
  tsconfig?: string;
  tslint?: string | true;
  watch?: string | string[];
  async?: boolean;
  ignoreDiagnostics?: number[];
  ignoreLints?: string[];
  colors?: boolean;
  logger?: Console;
  formatter?: 'default' | 'codeframe' | ( (message: NormalizedMessage, useColors: boolean) => string );
  formatterOptions?: any;
  silent?: boolean;
  checkSyntacticErrors?: boolean;
  memoryLimit?: number;
  workers?: number;
  vue?: boolean;
}

type ErrorType = 'diagnostic' | 'lint';
type Severity = 'error' | 'warning';
interface NormalizedMessage {
  type: ErrorType;
  code: string | number;
  severity: Severity;
  content: string;
  file: string;
  line: number;
  character: number;
}

const PLUGIN_NAME = 'ServiceWorkerTsPlugin';

/**
 * A Plugin that does what ServiceWorkerWebpackPlugin but with type checking using ForkTsCheckerWebpackPlugin.
 * The plugin wraps ServiceWorkerWebpackPlugin so it can control the flow of errors from it and display them (without this errors are hidden).
 */
export class ServiceWorkerTsPlugin extends ServiceWorkerWebpackPlugin {
  private forkTsChecker: ForkTsCheckerWebpackPlugin;
  private logger: Console;
  private compilation: any;
  private pending: NormalizedMessage[] = [];

  private watching = false;
  private running = true;
  private firstRun = true;

  private errorGuard: (err?: any) => void;

  private constructor(tsPluginOptions: ForkTsCheckerWebpackPluginOptions,
                      swPluginOptions: ServiceWorkerWebpackPluginOptions) {
    super(swPluginOptions);

    tsPluginOptions.logger = this.logger = Object.create(console);
    this.logger.warn = this.logger.error = () => { }; // tslint:disable-line:no-empty

    tsPluginOptions.formatter = (message: NormalizedMessage, useColors: boolean) => {
      if (this.running) {
        if (!this.firstRun && this.compilation) {
          this.postLog(message);
        } else {
          this.pending.push(message);
        }
      }
      return '';
    };

    this.forkTsChecker = new ForkTsCheckerWebpackPlugin(tsPluginOptions);
  }

  apply(compiler: Compiler) {
    compiler.hooks.done.tap(PLUGIN_NAME, () => {
      if (this.firstRun) {
        this.flush();
        this.firstRun = false;
      }
      if (!this.watching) {
        this.running = false;
      }
    });

    compiler.hooks.watchRun.tapAsync(PLUGIN_NAME, (c: Compiler, callback: () => void) => {
      this.watching = true;
      compiler.hooks.watchClose.tap(PLUGIN_NAME, () => {
        this.flush();
        this.running = false;
      });
      callback();
    });

    // we create a DO-NOTHING compilation just to get a callback for later.
    // we use the callback to emit an error later, if such occures on the child compilation of the serviceworker plugin compilation child
    // couldn't find another way to do so, as the underlaying ServiceWorkerWebpackPlugin plugin silence all error's from it's internal handleMake() implementation.
    // see handleMake() for more details.
    compiler.hooks.make.tapAsync(PLUGIN_NAME, (c: Compilation.Compilation, callback: () => void) => this.errorGuard = callback );
    super.apply(compiler);
  }

  handleMake(compilation: Compilation.Compilation, compiler: Compiler) {
    this.compilation = compilation;

    // This is a placeholder for errors caused in the compilation process done for the service worker (by the parent class).
    // we set this to the errors array of the compilation of the child compiler.
    // The parent class will create all of the above, we just listen to the childCompiler event of the CURRENT compilation
    // and once fired, we listen to the compilation event of it (this will be the last of: compiler => compilation => childCompiler => compilation)
    // we save the ref for that compilation so if the compilation has errors we will know about them.
    let childCompilation: Compilation.Compilation;

    // Assign the ngtools webpack plugin instance from the parent compilation to all compilation created by a child
    // compiler of the parent compilation.
    // We need this so imports from the server bundle to outside of it will work (they go to the ngtools webpack plugin)
    let syncAotPluginBetweenCompilations = (childCompiler: Compiler, compilerName: string, compilerIndex: number) => {
      if (syncAotPluginBetweenCompilations) {
        childCompiler.hooks.compilation.tap(PLUGIN_NAME, compilation2 => {
          (<any> compilation2)._ngToolsWebpackPluginInstance = (<any> compilation)._ngToolsWebpackPluginInstance;
          childCompilation = compilation2;
        });
        syncAotPluginBetweenCompilations = undefined;
      }
    };
    compilation.hooks.childCompiler.tap(PLUGIN_NAME, syncAotPluginBetweenCompilations);

    return super.handleMake(compilation, compiler)
      .then( () => this.errorGuard(childCompilation.errors[0]) )
      .catch( err => {
        this.errorGuard(err);
        throw err;
      });
  }

  handleEmit(compilation: Compilation.Compilation, compiler: Compiler, callback: any) {
    /*
    Overriding handleEmit() is required for serveral reasons:
      1) The base method is not 100% safe, if error is thrown webpack will freeze (callback never invoked)
      2) When the base method does find errors it will push them to `compilation.errors` which does not bubble up to webpack.
         To make webpack aware of the error we need to pass it to the callback.
      3) The base methods try's to access `webpack.optimize.UglifyJsPlugin` which will throw an error in webpack 4+.
         A workaround is implemented to avoid the error.
         remove when https://github.com/oliviertassinari/serviceworker-webpack-plugin/issues/73 is fixed.
    */

    /* 3 */ const oldOptimize = webpack.optimize;
    (<any> webpack).optimize = Object.create(oldOptimize, {
      UglifyJsPlugin: {
        // this is a specific fix for the parent class issue
        // When minimize is true, it will return the first plugin's constructor so the `instanceof` expression is true.
        // otherwise it will return an ad-hoc class which will never resolve to true.
        get: function() {
          return compiler.options.optimization && compiler.options.optimization.minimize
            ? compiler.options.plugins[0].constructor
            : class {}
          ;
        }
      }
    }); /* 3 */

    const cb = (err?: any) => {
      /* 3 */  (<any> webpack).optimize = oldOptimize; /* 3 */
      /* 2 */ callback(err || compilation.errors[0]); /* 2 */
    };

    /* 1 */ try {
      super.handleEmit(compilation, compiler, cb);
    } catch (err) {
      compilation.errors.push(err);
      cb();
    } /* 1 */
  }

  private flush(): void {
    while (this.pending.length) {
      this.postLog(this.pending.shift());
    }
  }

  private postLog(message: NormalizedMessage) {
    if (message.type === 'diagnostic') {
      const log: WebpackError = {
        // module: ''
        file: message.file,
        message: message.content,
        location: { line: message.line, character: message.character },
        loaderSource: ''
      };
      if (message.severity === 'error') {
        this.compilation.errors.push(log);
      } else {
        this.compilation.warnings.push(log);
      }
    }
  }

  static create(tsPluginOptions: ForkTsCheckerWebpackPluginOptions,
                swPluginOptions: ServiceWorkerWebpackPluginOptions) {
    const sw = new ServiceWorkerTsPlugin(tsPluginOptions, swPluginOptions);
    return [sw.forkTsChecker, sw];
  }
}
