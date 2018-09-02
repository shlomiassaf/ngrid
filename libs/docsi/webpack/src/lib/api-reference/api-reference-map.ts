//tslint:disable:no-bitwise

import { ReflectionKind, } from 'typedoc';
import { TypeObject } from 'typedoc/dist/lib/serialization';
import { DSProjectReflectionObject, DSContainerReflectionObject, DSDeclarationReflectionObject, DSReflectionObject } from './plugins/json-datasource/src/browser';

const DECORATOR_TYPE_NAMES = [
  'ClassDecorator',
  'PropertyDecorator',
  'MethodDecorator',
  'ParameterDecorator'
];

enum ReflectionSubFlag {
  Decorator
}

export interface ApiReferenceMapSymbol {
  name: string;
  kind: number;
  flags: number;
  subFlags?: number;
  tags?: string[];
  decorators?: string[];
  sources?: Array<[number, number, number]>;
}

export interface ApiReferenceMapModule extends ApiReferenceMapSymbol {
  symbols: ApiReferenceMapSymbol[];
}

export interface ApiReferenceMap {
  scope?: string;
  modules: ApiReferenceMapModule[];
  sources: { [id: string]: string };
  ReflectionKind: { [id: string]: string };
  ReflectionFlag?: { [id: string]: string };
  ReflectionSubFlag?: { [id: string]: string };
}

export function createApiReferenceMap(ds: DSProjectReflectionObject): ApiReferenceMapContext {
  return new ApiReferenceMapContext(ds).toObject();
}

class ApiReferenceMapContext implements ApiReferenceMapContext {
  scope?: string;
  modules: ApiReferenceMapModule[] = [];
  sources: { [id: string]: string } = {};
  decorators?: string[];
  ReflectionKind: { [id: string]: string } = {};
  ReflectionSubFlag: { [id: string]: string } = {};
  ReflectionFlag: { [id: string]: string };

  constructor(private ds: DSProjectReflectionObject) {
    this.ReflectionFlag = ds.TABLES.ReflectionFlag;
    this.init();
  }

  private init(): void {
    const ds = this.ds;
    const modules: DSContainerReflectionObject[] = ds.children
      .map( c => this.getReflection<DSContainerReflectionObject>(c) )
      .filter( symbol => symbol.kind === 1 );

    if (modules.length === 0) {
      const m = Object.assign({}, ds);
      m.kind = 1;
      modules.push(m as any);
    } else {
      this.scope = ds.name;
    }

    for (const module of modules) {
      if (module.children) {
        const m: ApiReferenceMapModule = {
          name: module.name,
          kind: module.kind,
          flags: module.flags,
          symbols: [],
        };
        this.updateKind(m);
        this.addTags(m, module);
        this.addSource(m, module);
        this.modules.push(m);

        for (const cc of module.children) {
          if (this.getReflection<any>(cc)) {
            const symbol = this.getReflection<DSContainerReflectionObject>(cc);
            const obj: ApiReferenceMapSymbol = {
              name: symbol.name,
              kind: symbol.kind,
              flags: symbol.flags,
            };
            this.setDecorators(obj, symbol);
            this.updateKind(obj);
            this.addTags(obj, symbol);
            this.addSource(obj, symbol);
            if (this.isDecorator(symbol)) {
              this.setSubFlag(obj, ReflectionSubFlag.Decorator);
            }
            m.symbols.push(obj);
          }
        }
      }
    }
  }

  private addSource(obj: any, symbol: DSContainerReflectionObject): void {
    if (symbol.sources)  {
      obj.sources = symbol.sources;
      for (const s of symbol.sources) {
        if (!this.sources[s[0]]) {
          this.sources[s[0]] = this.ds.TABLES.sources[s[0]];
        }
      }
    }
  }

  private addTags(obj: any, symbol: DSContainerReflectionObject): void {
    if (symbol.comment && symbol.comment.tags)  {
      obj.tags = symbol.comment.tags.map( t => t.tag );
    }
  }

  private updateKind(obj: { kind: number, flags: number }): void {
    if (!this.ReflectionKind[obj.kind]) {
      this.ReflectionKind[obj.kind] = this.ds.TABLES.ReflectionKind[obj.kind];
    }
  }

  private setDecorators(obj: ApiReferenceMapSymbol, symbol: DSReflectionObject): void {
    if (symbol.decorators && symbol.decorators.length) {
      obj.decorators = symbol.decorators.map( d => d.name );
    }
  }

  private setSubFlag(obj: ApiReferenceMapSymbol, flag: ReflectionSubFlag): void {
    if (! ('subFlags' in obj)) {
      obj.subFlags = flag;
    } else {
      obj.subFlags = obj.subFlags | flag;
    }
    if (!this.ReflectionSubFlag[flag]) {
      this.ReflectionSubFlag[flag] = ReflectionSubFlag[flag];
    }
  }

  private isDecorator(symbol: DSContainerReflectionObject): boolean {
    if (symbol.decorates && symbol.decorates.length > 0) {
      return true;
    }
    if (this.hasTag('decorator', symbol)) {
      return true;
    }
    if (symbol.kind === ReflectionKind.Function) {
      const sigSymbol: DSDeclarationReflectionObject = symbol as any;
      if (sigSymbol.signatures && sigSymbol.signatures.length > 0) {
        for (const sigId of sigSymbol.signatures) {
          const sig = this.getReflection<DSDeclarationReflectionObject>(sigId as any);
          if (sig) {
            if (this.hasTag('decorator', sig)) {
              return true;
            }
            const t = this.getType(sig.type as any);
            if (t && t.type === 'reference' && DECORATOR_TYPE_NAMES.indexOf(t.name) > -1) {
              return true;
            }
          }
        }
        return false;
      }
    }
    return false;
  }

  private hasTag(tag: string, symbol: DSReflectionObject): boolean {
    if (symbol.comment && symbol.comment.tags)  {
      return symbol.comment.tags.some( t => t.tag === tag );
    }
    return false;
  }

  private getReflection<T>(id: number): T {
    return this.ds.TABLES.reflections[id] as any;
  }

  private getType(id: number): TypeObject {
    return this.ds.TABLES.types[id] as any;
  }

  toObject(): ApiReferenceMapContext {
    const obj = Object.assign({}, this);
    delete obj.ds;
    if (Object.keys(obj.ReflectionKind).length === 0) {
      delete obj.ReflectionKind;
    }
    if (Object.keys(obj.ReflectionSubFlag).length === 0) {
      delete obj.ReflectionSubFlag;
    }
    return obj;
  }
}
