// Because we force JIT in server mode (SEE: ctor of stanga-webpack-server-compiler-plugin.ts) we need to have the reflection API ready right when angular package loads
// So all metadata is registered.
// Remember that we run the server compilation in the same runtime that we bootstrap it (and also the same runtime which we build the browser release)...
import 'reflect-metadata';

import { first } from 'rxjs/operators';
import { readFileSync } from 'fs';

import { ApplicationRef, NgModuleRef, CompilerFactory, ComponentFactory, ComponentRef, Injector, Type, NgModuleFactory, StaticProvider } from '@angular/core';
import { ResourceLoader } from '@angular/compiler';
import { INITIAL_CONFIG, platformDynamicServer } from '@angular/platform-server';

import { StangaDominoAdapter } from './dom-adapter/stanga-domino-adapter';
import { resolveOptions } from './utils';

const COMPILED_NG_MODULE_HOST_PARENT = Symbol('CompiledNgModuleHost Parent');
const COMPILED_NG_MODULE_HOST_CHILDREN = Symbol('CompiledNgModuleHost Children');

class FileLoader implements ResourceLoader {
  get(url: string): string {
    return readFileSync(url, { encoding: 'utf-8' });
  }
}

export interface PlatformOptions {
  document?: string;
  url?: string;
  extraProviders?: StaticProvider[];
}

export interface ComponentCompileOptions {
  injector?: Injector;
  providers?: StaticProvider[];
  /**
   * Projectable nodes to create the component with.
   *
   * NOTE: In addition to DOM elements (`any[][]`) this value can also be a string.
   *
   * This value is passed to the `projectableNodes` input in angular's `ComponentFactory.create` and it is similar but with a twist, it can also
   * be a string value. When a string is provided, before creating the component the library will convert the string to DOM elements.
   *
   * # Why strings?
   *
   * In most cases, creating components will require HTML compilation (string -> DOM) because we work
   * with HTML templates and because the server components function like webpack loaders...
   * We don't want components and parsers to perform "String to DOM" conversion internally because it might lead to incompatible DOM elements.
   * We run on a node environment so the user might choose to use it's own DOM implementation library instead of the one used by `@angular/platform-server`, which will lead
   * to incompatible DOM nodes now known to the DOM implementation library used by `@angular/platform-server`.
   *
   * To prevent this we allow passing string and the library will convert them internally, using the document provided by the DI.
   */
  projectableNodes?: string | any[][];
}

export interface ComponentRenderOptions<T> extends ComponentCompileOptions {
  input?: Partial<T>;
}

export class ComponentRendererRef<T> {

  private readonly instance: T;

  constructor(public readonly cmpRef: ComponentRef<T>) {
    this.instance = cmpRef.instance;
  }

  update(input?: Partial<T>, skipChangeDetection?: boolean): void {
    if (input) {
      Object.assign(this.instance, input);
    }

    if (!skipChangeDetection) {
      this.cmpRef.changeDetectorRef.markForCheck();
      this.cmpRef.changeDetectorRef.detectChanges();
    }
  }

  render(detect: boolean = false): string {
    if (detect) {
      this.update();
    }
    return this.cmpRef.location.nativeElement.innerText;
  }

  destroy(): void {
    this.cmpRef.destroy();
  }
}

export class CompiledNgModuleHost<T = any> {
  appRef: ApplicationRef;
  moduleRef: NgModuleRef<T>;

  get isRoot(): boolean { return !this[COMPILED_NG_MODULE_HOST_PARENT]; }
  get parent(): CompiledNgModuleHost<any> | undefined { return this[COMPILED_NG_MODULE_HOST_PARENT]; }
  get children(): Array<CompiledNgModuleHost<any>> { return (this[COMPILED_NG_MODULE_HOST_CHILDREN] || []).slice(); }

  private [COMPILED_NG_MODULE_HOST_PARENT]?: CompiledNgModuleHost<any>;
  private [COMPILED_NG_MODULE_HOST_CHILDREN]: Array<CompiledNgModuleHost<any>> = [];

  private moduleType: Type<T>;
  private moduleTypeFactory?: NgModuleFactory<T>
  private cmpFactories = new Map<Type<any>, ComponentFactory<any>>();

  static create<T>(moduleTypeOrFactory: Type<T> | NgModuleFactory<T>): CompiledNgModuleHost<T> {
    return new CompiledNgModuleHost<T>(moduleTypeOrFactory);
  }

  private constructor(moduleTypeOrFactory: Type<T> | NgModuleFactory<T>) {
    if (moduleTypeOrFactory instanceof NgModuleFactory) {
      this.moduleType = moduleTypeOrFactory.moduleType;
      this.moduleTypeFactory = moduleTypeOrFactory;
    } else {
      this.moduleType = moduleTypeOrFactory;
    }
  }

  /**
   * Query and return all styles added to the document.
   * These styles are added by angular, based on the styles hosted by the components.
   *
   * Note that this should be used once all components are rendered, at the end of the compilation process.
   */
  getInlinedStyle(): string[] {
    const doc = this.appRef.components[0].location.nativeElement.ownerDocument;
    return Array.from(doc.querySelectorAll('style'))
      .map( (e: any) => e.textContent );
  }

  async init(options?: PlatformOptions) {
    if (this.moduleRef) {
      return this.moduleRef;
    }


    if (this.isRoot) {
      // In angular the DOM adapter is static, attached to a module and does not exists within the DI
      // It is initially defined through the DI by adding a factory to the multi-provider `PLATFORM_INITIALIZER`
      // Because the internal providers in `platform-server` will register their `PLATFORM_INITIALIZER` first we need another
      // approach, so we call `markCurrent()` which calls `setRootDomAdapter` first which will make `StangaDominoAdapter` the root DOM adapter for life!
      StangaDominoAdapter.makeCurrent();

      const extraProviders = options.extraProviders ? options.extraProviders : [];
      const platform = platformDynamicServer([
        { provide: INITIAL_CONFIG, useValue: { document: options.document, url: options.url} },
        extraProviders,
      ]);

      if (this.moduleTypeFactory) {
        this.moduleRef = await platform.bootstrapModuleFactory(this.moduleTypeFactory, { });
      } else {
        this.moduleRef = await platform.bootstrapModule(this.moduleType, {
          useJit: false,
          providers: [
            { provide: ResourceLoader, useClass: FileLoader },
          ]
        });
      }
    } else {
      const parent = this.parent;
      const compilerFactory: CompilerFactory = parent.moduleRef.injector.get(CompilerFactory);
      const compiler = compilerFactory.createCompiler();
      if (!this.moduleTypeFactory) {
        this.moduleTypeFactory = await compiler.compileModuleAsync(this.moduleType);
      }
      this.moduleRef = this.moduleTypeFactory.create(parent.moduleRef.injector);
    }

    this.appRef = this.moduleRef.injector.get(ApplicationRef);
    await this.appRef.isStable.pipe(first( isStable => isStable )).toPromise();
    return this.moduleRef;
  }

  async initChild<Z>(moduleClass: new(...args: any) => Z): Promise<CompiledNgModuleHost<Z>> {
    const childNgModule = new CompiledNgModuleHost<Z>(moduleClass);
    childNgModule[COMPILED_NG_MODULE_HOST_PARENT] = this;
    this[COMPILED_NG_MODULE_HOST_CHILDREN].push(childNgModule);
    await childNgModule.init();
    return childNgModule;
  }

  getFactory<Z>(component: Type<Z>): ComponentFactory<Z> {
    let factory = this.cmpFactories.get(component);
    if (!factory) {
      factory = this.moduleRef.componentFactoryResolver.resolveComponentFactory(component);
      this.cmpFactories.set(component, factory);
    }
    return factory;
  }

  compile<Z>(component: Type<Z>, options: ComponentCompileOptions = {}): ComponentRendererRef<Z> {
    const { injector, projectableNodes } = resolveOptions(options, this.moduleRef.injector);

    const cmpRef = this.getFactory(component)
      .create(injector, projectableNodes, undefined, this.moduleRef);

    return new ComponentRendererRef<Z>(cmpRef);
  }

  render<Z>(component: new(...args: []) => Z, options: ComponentRenderOptions<Z> = {}): string {
    const cmpRef = this.compile<Z>(component, options);
    cmpRef.update(options.input);
    const renderedContent = cmpRef.render();
    cmpRef.destroy();
    return renderedContent;
  }
}

export function bootstrapModule<T>(moduleTypeOrFactory: Type<T> | NgModuleFactory<T>): CompiledNgModuleHost<T> {
  return CompiledNgModuleHost.create<T>(moduleTypeOrFactory);
}

