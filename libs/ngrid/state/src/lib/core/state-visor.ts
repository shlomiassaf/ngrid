import { PblNgridGlobalState, StateChunks, RootStateChunks, PblNgridStateChunkSectionContext } from './state-model';
import { PblNgridStateChunkHandlerDefinition } from './handling';

export interface PblNgridStateChunkSectionConfig<T extends keyof RootStateChunks = keyof RootStateChunks> {
  stateMatcher: (state: PblNgridGlobalState) => RootStateChunks[T]['state'];
  sourceMatcher: (context: PblNgridStateChunkSectionContext) => RootStateChunks[T]['value'];
}

export class StateVisor<T extends keyof StateChunks = keyof StateChunks> {
  private rootChunkSections = new Map<keyof RootStateChunks, PblNgridStateChunkSectionConfig<keyof RootStateChunks>>();
  private chunkHandlers = new Map<T, PblNgridStateChunkHandlerDefinition<T>[]>();

  private constructor() { }

  static get(): StateVisor { return stateVisor || new StateVisor(); }

  registerRootChunkSection<Z extends keyof RootStateChunks>(chunkId: Z, config: PblNgridStateChunkSectionConfig<Z>): void {
    if (!this.rootChunkSections.has(chunkId)) {
      this.rootChunkSections.set(chunkId, config);
    }
  }

  registerChunkHandlerDefinition<Z extends T>(chunkHandlerDefs: PblNgridStateChunkHandlerDefinition<Z>): void {
    const { chunkId } = chunkHandlerDefs;
    const handlersForGroup = this.chunkHandlers.get(chunkId) || [];
    handlersForGroup.push(chunkHandlerDefs);
    this.chunkHandlers.set(chunkId, handlersForGroup);
  }

  getRootSections(): Array<[keyof RootStateChunks, PblNgridStateChunkSectionConfig<keyof RootStateChunks>]> {
    return Array.from(this.rootChunkSections.entries());
  }

  getDefinitionsForSection(chunkId: T): PblNgridStateChunkHandlerDefinition<T>[] {
    return this.chunkHandlers.get(chunkId) || [];
  }
}

export const stateVisor: StateVisor = StateVisor.get();
