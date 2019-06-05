import { PblNgridComponent, PblNgridExtensionApi } from '@pebula/ngrid';
import * as B from './built-in-handlers/index';

/* ======================= Persistance */

export interface PersistAdapter {
  save(id: string, state: PblNgridGlobalState): Promise<void>;
  load(id: string): Promise<PblNgridGlobalState>;
  exists(id: string): Promise<boolean>;
}

/* ======================= Persistance */

/* ======================= Identification */

export interface PblNgridIdentResolverContext {
  grid: PblNgridComponent;
  extApi: PblNgridExtensionApi;
  options: PblNgridStateOptions | PblNgridStateLoadOptions;
}

export interface PblNgridIdentResolver {
  resolveId(ctx: PblNgridIdentResolverContext): string | undefined;
}

/* ======================= Identification */

/* ======================= State Chunks */

export interface StateChunkItem<TState, TValue, TData = any, TKeyless = never> {
  state: TState;
  value?: TValue;
  data?: TData;
  keyless: TKeyless;
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

export type StateChunkKeyFilter = {
  // [P in keyof StateChunks]?: P extends keyof RootStateChunks ? boolean : Array<keyof StateChunks[P]['state']> | boolean;
  [P in keyof StateChunks]?:
    P extends keyof RootStateChunks
      ? RootStateChunks[P]['keyless'] extends never ? (Array<keyof RootStateChunks[P]['state']> | boolean) : boolean
      : Array<keyof StateChunks[P]['state']> | boolean
    ;
}

export interface PblNgridStateOptions {
  /**
   * The adapter to use for persistance.
   * @default PblNgridLocalStoragePersistAdapter
   */
  persistenceAdapter?: PersistAdapter

/**
   * The resolver used to get the unique id for an instance of the grid.
   * If not set default's to the id property of `PblNgridComponent` which is the id attribute of `<pbl-ngrid>`
   * @default PblNgridIdAttributeIdentResolver
   */
  identResolver?: PblNgridIdentResolver;

  include?: StateChunkKeyFilter;

  exclude?: StateChunkKeyFilter;
}

export interface PblNgridStateLoadOptions extends PblNgridStateOptions {
  /**
   * When set to `overwrite`, state values will run over existing runtime values.
   * When set to `merge`, state values will not run over existing runtime values and only update values that are not set.
   * @default overwrite
   */
  strategy?: 'overwrite' | 'merge';

  /**
   * When set to true the loading process will try to avoid the use of grid methods that force an immediate redrew.
   * Usually, redrawing is not a problem but in some cases it is required, for example, avoiding redraws is useful when
   * we load the state after the columns are initiated but before the grid draws them, in this case some of the data is
   * missing because it depend on updates from the draw process.
   *
   * We use the term `avoid` because the state plugin is extensible so a plugin can also apply state for it's own use.
   * Because of that we can't guarantee that no redraw is performed.
   */
  avoidRedraw?: boolean;
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
