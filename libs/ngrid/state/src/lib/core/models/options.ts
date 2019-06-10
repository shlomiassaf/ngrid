import { RootStateChunks, StateChunks, PblNgridGlobalState, PblNgridStateContext } from './state';

/**
 * An interface for datasource specific logical units that can load and save state objects.
 *
 * For example, `PblNgridLocalStoragePersistAdapter` is an adapter that can loan and save the state
 * from the local storage.
 */
export interface PblNgridPersistAdapter {
  save(id: string, state: PblNgridGlobalState): Promise<void>;
  load(id: string): Promise<PblNgridGlobalState>;
  exists(id: string): Promise<boolean>;
}

/**
 * An interface for logical units that can resolve a unique id for a grid.
 *
 * For example, `PblNgridIdAttributeIdentResolver` is a resolver that will resolve an id from the
 * `id` property of the grid (`PblNgridComponent.id`) which is bound to the `id` attribute of the grid (`<pbl-ngrid id="SOME ID"></pbl-ngrid>`).
 */
export interface PblNgridIdentResolver {
  resolveId(ctx: PblNgridIdentResolverContext): string | undefined;
}

/**
 * The context provided when resolving an id (`PblNgridIdentResolver`).
 */
export interface PblNgridIdentResolverContext extends PblNgridStateContext { }


export type StateChunkKeyFilter = {
  [P in keyof StateChunks]?:
    P extends keyof RootStateChunks
      ? RootStateChunks[P]['keyless'] extends never ? (Array<keyof RootStateChunks[P]['state']> | boolean) : boolean
      : Array<keyof StateChunks[P]['state']> | boolean
    ;
}

export interface PblNgridStateSaveOptions {
  /**
   * The adapter to use for persistance.
   * @default PblNgridLocalStoragePersistAdapter
   */
  persistenceAdapter?: PblNgridPersistAdapter

  /**
   * The resolver used to get the unique id for an instance of the grid.
   * If not set default's to the id property of `PblNgridComponent` which is the id attribute of `<pbl-ngrid>`
   * @default PblNgridIdAttributeIdentResolver
   */
  identResolver?: PblNgridIdentResolver;

  /**
   * Instruction of chunk and chunk keys to include when serializing / deserializing.
   * Include is strict, only the included chunks and keys are used, everything else is ignored.
   *
   * If `include` and `exclude` are set, `include` wins.
   *
   * Note that when using include with child chunks you must include the root chunk of the child chunk, if not
   * the root chunk is skipped and so the child.
   *
   * For example, to include the `width` key of the `dataColumn` child chunk we must also include the `columns` root chunk.
   *
   * ```ts
   *   const obj: StateChunkKeyFilter = {
   *     columns: true,
   *     dataColumn: [
   *       'width',
   *     ]
   *   };
   * ```
   *
   * We can also use the wildcard `true` to include all items in a chunk:
   *
   * ```ts
   *   const obj: StateChunkKeyFilter = {
   *     columns: true,
   *     dataColumn: true,
   *   };
   * ```
   *
   * Same specificity rule apply here as well, `columns: true` alone will not include all of it's child chunks so we must add `dataColumn: true`.
   * Vice versa, `dataColumn: true` alone will not get included because it's parent (`columns`) is blocked
   */
  include?: StateChunkKeyFilter;

  /**
   * Instruction of chunk and chunk keys to exclude when serializing / deserializing.
   * Exclude is not strict, all known chunks and keys are used unless they are excluded and so will be ignored
   *
   * If `include` and `exclude` are set, `include` wins.
   *
   */
  exclude?: StateChunkKeyFilter;
}

export interface PblNgridStateLoadOptions extends PblNgridStateSaveOptions {
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

export type PblNgridStateOptions = PblNgridStateLoadOptions | PblNgridStateSaveOptions
