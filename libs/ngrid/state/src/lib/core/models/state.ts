import { PblNgridComponent, PblNgridExtensionApi } from '@pebula/ngrid';
import * as B from '../built-in-handlers/index';
import { PblNgridStateOptions } from './options';

/* ======================= State Chunks */

export interface StateChunkItem<TState, TValue, TData = any, TKeyless = never> {
  state: TState;
  value?: TValue;
  data?: TData;
  keyless: TKeyless;
}

export interface RootStateChunks extends B.BuiltInRootStateChunks { }

export interface StateChunks extends RootStateChunks, B.BuiltInStateChunks{ }

export interface PblNgridStateContext {
  grid: PblNgridComponent;
  extApi: PblNgridExtensionApi;
  options: PblNgridStateOptions;
}

export interface PblNgridStateChunkSectionContext extends PblNgridStateContext { }

export interface PblNgridStateChunkContext<T extends keyof StateChunks> extends PblNgridStateChunkSectionContext {
  source: StateChunks[T]['value'];
  data?: StateChunks[T]['data']
  runChildChunk?<TChild extends keyof StateChunks>(childChunkId: TChild, state: StateChunks[TChild]['state'], source: StateChunks[TChild]['value'], data?: StateChunks[TChild]['data']);
}

/* ======================= State Chunks */

/* ======================= Global State Object */

export interface PblNgridStateMetadata {
  updatedAt: string;
}

export interface PblNgridGlobalState extends B.PblNgridBuiltInGlobalState {
  __metadata__: PblNgridStateMetadata;
}

/* ======================= Global State Object */
