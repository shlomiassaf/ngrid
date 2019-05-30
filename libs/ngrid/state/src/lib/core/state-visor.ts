import { PblNgridGlobalState, StateChunks } from './state-model';
import { PblNgridStateChunkSectionContext } from './handling/base';
import { PblNgridStateChunkHandlerDefinition } from './handling';

export interface PblNgridStateChunkSectionConfig<T extends keyof StateChunks = keyof StateChunks> {
  stateMatcher: (state: PblNgridGlobalState) => StateChunks[T]['state'];
  sourceMatcher: (context: PblNgridStateChunkSectionContext) => StateChunks[T]['value'];
}

export class StateVisor<T extends keyof StateChunks = keyof StateChunks> {
  private chunkSections = new Map<keyof StateChunks, PblNgridStateChunkSectionConfig<keyof StateChunks>>();
  private chunkHandlers = new Map<T, PblNgridStateChunkHandlerDefinition<T>[]>();

  private constructor() {
    this.registerChunkSection('grid', { sourceMatcher: ctx => ctx.grid, stateMatcher: state => state.grid || (state.grid = {} as any) });
  }

  static get(): StateVisor { return stateVisor || new StateVisor(); }

  registerChunkSection<Z extends keyof StateChunks>(chunkId: Z, config: PblNgridStateChunkSectionConfig<Z>): void {
    if (!this.chunkSections.has(chunkId)) {
      this.chunkSections.set(chunkId, config);
    }
  }

  registerChunkHandlerDefinition<Z extends T>(chunkHandlerDefs: PblNgridStateChunkHandlerDefinition<Z>): void {
    const { chunkId } = chunkHandlerDefs;
    if (!this.chunkSections.has(chunkId)) {
      throw new Error(`Invalid state chunk handler, chunk section ${chunkId} is not recognized.`);
    }
    const handlersForGroup = this.chunkHandlers.get(chunkId) || [];
    handlersForGroup.push(chunkHandlerDefs);
    this.chunkHandlers.set(chunkId, handlersForGroup);
  }

  getSections(): Array<[keyof StateChunks, PblNgridStateChunkSectionConfig<keyof StateChunks>]> {
    return Array.from(this.chunkSections.entries());
  }

  getDefinitionsForSection(chunkId: T): PblNgridStateChunkHandlerDefinition<T>[] {
    return this.chunkHandlers.get(chunkId) || [];
  }

}

export const stateVisor: StateVisor = StateVisor.get();
