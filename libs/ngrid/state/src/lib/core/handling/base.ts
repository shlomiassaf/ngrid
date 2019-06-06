import { StateChunks, PblNgridStateChunkContext } from '../models/index';
import { stateVisor } from '../state-visor';

export class PblNgridStateChunkHandlerHost<T extends keyof StateChunks, Z extends keyof StateChunks[T]['state'] = keyof StateChunks[T]['state']> {
  private keys = new Set<Z>();
  private sFn: Parameters<PblNgridStateChunkHandlerHost<T, Z>['serialize']>[0];
  private dFn: Parameters<PblNgridStateChunkHandlerHost<T, Z>['deserialize']>[0];

  constructor(private chunkId: T) { }

  handleKeys(...keys: Array<Z>): this {
    for (const k of keys) { this.keys.add(k) }
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
      throw new Error('Invalid state chunk handler, no keys defined.');
    }
    if (!this.sFn) {
      throw new Error('Invalid state chunk handler, missing serialize handler.');
    }
    if (!this.dFn) {
      throw new Error('Invalid state chunk handler, missing deserialize handler.');
    }

    stateVisor.registerChunkHandlerDefinition({
      chunkId: this.chunkId,
      keys: Array.from(this.keys.values()),
      serialize: this.sFn,
      deserialize: this.dFn,
    })
  }
}

export interface PblNgridStateChunkHandlerDefinition<T extends keyof StateChunks, Z extends keyof StateChunks[T]['state'] = keyof StateChunks[T]['state']>{
  chunkId: T;
  keys: Array<Z>;
  serialize: Parameters<PblNgridStateChunkHandlerHost<T, Z>['serialize']>[0];
  deserialize: Parameters<PblNgridStateChunkHandlerHost<T, Z>['deserialize']>[0];
}

export function createStateChunkHandler<T extends keyof StateChunks>(section: T) {
  return new PblNgridStateChunkHandlerHost(section);
}
