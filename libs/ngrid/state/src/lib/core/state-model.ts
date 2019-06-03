import { PblNgridComponent, PblNgridExtensionApi } from '@pebula/ngrid';
import * as B from './built-in-handlers/index';

/* ======================= Persistance */

export interface PersistAdapter {
  save(id: string, state: PblNgridGlobalState): Promise<void>;
  load(id: string): Promise<PblNgridGlobalState>;
  exists(id: string): Promise<boolean>;
}

/* ======================= Persistance */

/* ======================= State Chunks */

export interface StateChunkItem<TState, TValue, TData = any> {
  state: TState;
  value?: TValue;
  data?: TData;
}

export interface RootStateChunks extends B.BuiltInRootStateChunks { }

export interface StateChunks extends RootStateChunks, B.BuiltInStateChunks{ }

export interface PblNgridStateChunkSectionContext {
  grid: PblNgridComponent;
  extApi: PblNgridExtensionApi;
  options: PblNgridStateOptions | PblNgridStateLoadOptions;
}

export interface PblNgridStateChunkContext<T extends keyof StateChunks> extends PblNgridStateChunkSectionContext {
  source: StateChunks[T]['value'];
  data?: StateChunks[T]['data']
  runChildChunk?<TChild extends keyof StateChunks>(childChunkId: TChild, state: StateChunks[TChild]['state'], source: StateChunks[TChild]['value'], data?: StateChunks[TChild]['data']);
}

/* ======================= State Chunks */

/* ======================= User Input (options) */

export interface PblNgridStateOptions {
  /**
   * The adapter to use for persistance.
   * @default PblNgridLocalStoragePersistAdapter
   */
  adapter?: PersistAdapter
  excludeKeys?: string[];
}

export interface PblNgridStateLoadOptions extends PblNgridStateOptions {
  /**
   * When set to `overwrite`, state values will run over existing runtime values.
   * When set to `merge`, state values will not run over existing runtime values and only update values that are not set.
   * @default overwrite
   */
  strategy?: 'overwrite' | 'merge';
}

/* ======================= User Input (options) */

/* ======================= Global State Object */

export interface PblNgridStateMetadata {
  updatedAt: string;
}

export interface PblNgridGlobalState extends B.PblNgridBuiltInGlobalState {
  __metadata__: PblNgridStateMetadata;
}

/* ======================= Global State Object */
