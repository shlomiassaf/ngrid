import { StateChunks, PblNgridStateChunkContext } from '../models/index';
import { stateVisor } from '../state-visor';

export class PblNgridStateChunkHandlerHost<T extends keyof StateChunks, Z extends keyof StateChunks[T]['state'] = keyof StateChunks[T]['state']> {
  private keys = new Set<Z>();
  private rKeys = new Set<Z>();
  private sFn: Parameters<PblNgridStateChunkHandlerHost<T, Z>['serialize']>[0];
  private dFn: Parameters<PblNgridStateChunkHandlerHost<T, Z>['deserialize']>[0];

  constructor(private chunkId: T) { }

  handleKeys(...keys: Array<Z>): this {
    for (const k of keys) { this.keys.add(k) }
    return this;
  }

  /**
   * Required keys are keys that cannot get excluded.
   * Either by adding the to the `exclude` option or by omitting them from the `include` option.
   */
  requiredKeys(...keys: Array<Z>): this {
    for (const k of keys) {
      this.keys.add(k)
      this.rKeys.add(k);
    }
    return this;
  }

  serialize(fn: (key: Z, ctx: PblNgridStateChunkContext<T>) => StateChunks[T]['state'][Z]): this {
    this.sFn = fn;
    return this;
  }

  deserialize(fn: (key: Z, stateValue: StateChunks[T]['state'][Z],  ctx: PblNgridStateChunkContext<T>) => void): this {
    this.dFn = fn;
    return this;
  }

  register(): void {
    if (this.keys.size === 0) {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        throw new Error('Invalid state chunk handler, no keys defined.');
      }
      return;
    }
    if (!this.sFn) {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        throw new Error('Invalid state chunk handler, missing serialize handler.');
      }
      return;
    }
    if (!this.dFn) {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        throw new Error('Invalid state chunk handler, missing deserialize handler.');
      }
      return;
    }

    stateVisor.registerChunkHandlerDefinition({
      chunkId: this.chunkId,
      keys: Array.from(this.keys.values()),
      rKeys: Array.from(this.rKeys.values()),
      serialize: this.sFn,
      deserialize: this.dFn,
    })
  }
}

export interface PblNgridStateChunkHandlerDefinition<T extends keyof StateChunks, Z extends keyof StateChunks[T]['state'] = keyof StateChunks[T]['state']>{
  chunkId: T;
  keys: Array<Z>;
  rKeys: Array<Z>;
  serialize: Parameters<PblNgridStateChunkHandlerHost<T, Z>['serialize']>[0];
  deserialize: Parameters<PblNgridStateChunkHandlerHost<T, Z>['deserialize']>[0];
}

export function createStateChunkHandler<T extends keyof StateChunks>(section: T) {
  return new PblNgridStateChunkHandlerHost(section);
}
