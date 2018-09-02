import * as webpack from 'webpack';

import { NS } from '../../unique-symbol';

declare module 'webpack' {
  export class Dependency extends webpack.compilation.Dependency { }
  export class Module extends webpack.compilation.Module {
    constructor(type: any, context: any);
  }

  export namespace compilation {
    export interface Module {
      buildInfo: any;
      buildMeta: any;
      context: any;

      addDependency(dep: any);
      updateHash(hash);
      identifier(): any;
    }
    export interface ChunkTemplate {
      hooks: any;
    }
    export interface MainTemplate {
      hooks: any;
    }
    export interface RuntimeTemplate {
      requestShortener: any;
    }
    export interface CompilationHooks {
      contentHash: any;
    }
  }
}

export class SourceCodeRefDependency extends webpack.Dependency {
  identifier: string;
  resourcePath: string;
  identifierIndex: number;
  content: string;
  context: any;

  constructor({ identifier, content }, resourcePath: string, context: string, identifierIndex: number) {
    super();
    this.identifier = identifier;
    this.resourcePath = resourcePath;
    this.identifierIndex = identifierIndex;
    this.content = content;
    this.context = context;
  }

  getResourceIdentifier() {
    return `ExtractedCodeModule-${this.identifier}-${this.identifierIndex}`;
  }
}

export class SourceCodeRefDependencyTemplate {
  apply() {}
}

export class SourceCodeRefModule extends webpack.Module {
  _identifier: string;
  _identifierIndex: number;
  resourcePath: string;
  content: string;
  context: any;

  hash: string;

  constructor(dependency: SourceCodeRefDependency) {
    super(NS, dependency.context);
    this._identifier = dependency.identifier;
    this._identifierIndex = dependency.identifierIndex;
    this.content = dependency.content;
    this.resourcePath = dependency.resourcePath;
  }

  // no source() so webpack doesn't do add stuff to the bundle

  size() {
    return this.content.length;
  }

  identifier() {
    return `ExtractedCode ${this._identifier} ${this._identifierIndex}`;
  }

  readableIdentifier(requestShortener) {
    return `ExtractedCode ${requestShortener.shorten(this._identifier)}${this._identifierIndex ? ` (${this._identifierIndex})` : ''}`;
  }

  nameForCondition() {
    const resource = this._identifier.split('!').pop();
    const idx = resource.indexOf('?');
    if (idx >= 0) return resource.substring(0, idx);
    return resource;
  }

  updateCacheModule(module) {
    this.content = module.content;
  }

  needRebuild() {
    return true;
  }

  build(options, compilation, resolver, fileSystem, callback) {
    this.buildInfo = {};
    this.buildMeta = {};
    callback();
  }

  updateHash(hash) {
    super.updateHash(hash);
    hash.update(this.content);
  }
}

export class SourceCodeRefModuleFactory {
  private cache = new Map<string, SourceCodeRefModule>();

  /**
   * Creates a new `ExtractedCodeModule` from the first dependency in `metadata.dependencies`.
   * If the depenceny has a module it will return it instead of creating a new one.
   */
  create(metadata: { dependencies: SourceCodeRefDependency[] }, callback?: (err, extractedCodeModule: SourceCodeRefModule) => void): SourceCodeRefModule {
    const dependency = metadata.dependencies[0];
    let extractedCodeModule = this.cache.get(dependency.identifier);
    if (!extractedCodeModule) {
      extractedCodeModule = new SourceCodeRefModule(dependency);
      this.cache.set(dependency.identifier, extractedCodeModule);
    }
    if (callback) {
      callback(null, extractedCodeModule);
    }
    return extractedCodeModule;
  }

  /**
   * Removes, if exists, the ExtractedCodeModule for the provided ExtractedCodeDependency
   */
  invalidate(dependency: SourceCodeRefDependency): boolean {
    return this.cache.delete(dependency.identifier);
  }
}
