import { PblNgridComponent, PblNgridPluginController, PblNgridExtensionApi } from '@pebula/ngrid';
import {
  RootStateChunks,
  StateChunks,
  PblNgridStateChunkSectionContext,
  PblNgridStateChunkContext,
  PblNgridStateOptions,
  PblNgridStateLoadOptions,
} from './models/index';
import { PblNgridStateChunkHandlerDefinition } from './handling/base';
import { stateVisor, PblNgridStateChunkSectionConfig } from './state-visor';
import { PblNgridLocalStoragePersistAdapter } from './persistance/local-storage';
import { PblNgridIdAttributeIdentResolver } from './identification/index';

/**
 * Pick Partial No Partial
 * Like Pick but some are partial some are not partial
 */
export type PickPNP<T, P extends keyof T, NP extends keyof T> = Partial<Pick<T, P>> & Pick<T, NP>

export function resolveId(grid: PblNgridComponent, options?: PblNgridStateOptions): string {
  const id = options.identResolver.resolveId(createChunkSectionContext(grid, options));
  if (!id) {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      throw new Error('Could not resolve a unique id for an ngrid instance, state is disabled');
    }
  }
  return id;
}

export function serialize(def: PblNgridStateChunkHandlerDefinition<any>, state: any, ctx: PblNgridStateChunkContext<any>): void {
  const keyPredicate = stateKeyPredicateFactory(def.chunkId, ctx.options);
  for (const key of def.keys) {
    if (!keyPredicate || def.rKeys.indexOf(key) > -1 || keyPredicate(key as string)) {
      state[key] = def.serialize(key, ctx);
    }
  }
}

export function deserialize(def: PblNgridStateChunkHandlerDefinition<any>, state: any, ctx: PblNgridStateChunkContext<any>): void {
  const keyPredicate = stateKeyPredicateFactory(def.chunkId, ctx.options);
  for (const key of def.keys) {
    if (key in state) {
      if (!keyPredicate || def.rKeys.indexOf(key) > -1 || keyPredicate(key as string)) {
        def.deserialize(key, state[key], ctx);
      }
    }
  }
}

export function normalizeOptions(mode: 'save', options?: PblNgridStateOptions): PblNgridStateOptions;
export function normalizeOptions(mode: 'load', options?: PblNgridStateLoadOptions): PblNgridStateLoadOptions;
export function normalizeOptions(mode: 'save' | 'load', options?: PblNgridStateOptions | PblNgridStateLoadOptions): PblNgridStateOptions | PblNgridStateLoadOptions {
  if (!options) {
    options = {} as any;
  }

  if (!options.persistenceAdapter) {
    options.persistenceAdapter = new PblNgridLocalStoragePersistAdapter();
  }
  if (!options.identResolver) {
    options.identResolver = new PblNgridIdAttributeIdentResolver();
  }

  if (mode === 'load') {
    const opt: PblNgridStateLoadOptions = options;
    if (!opt.strategy) {
      opt.strategy = 'overwrite'
    }
  }

  return options;
}

export function getExtApi(grid: PblNgridComponent): PblNgridExtensionApi {
  const controller = PblNgridPluginController.find(grid);
  if (controller) {
    return controller.extApi;
  }
}

export function createChunkSectionContext(grid: PblNgridComponent,
                                          options: PblNgridStateOptions | PblNgridStateLoadOptions): PblNgridStateChunkSectionContext {
  return { grid, extApi: getExtApi(grid), options };
}

export function createChunkContext<T extends keyof RootStateChunks>(sectionContext: PblNgridStateChunkSectionContext,
                                                                   chunkConfig: PblNgridStateChunkSectionConfig<T>,
                                                                   mode: 'serialize' | 'deserialize'): PblNgridStateChunkContext<T> {
  return {
    ...sectionContext,
    source: chunkConfig.sourceMatcher(sectionContext),
    runChildChunk<TChild extends keyof StateChunks>(childChunkId: TChild, state: StateChunks[TChild]['state'], source: StateChunks[TChild]['value'], data?: StateChunks[TChild]['data']) {
      const childContext = { ...sectionContext, source, data };
      const defs = stateVisor.getDefinitionsForSection(childChunkId);

      const action = mode === 'serialize' ? serialize : deserialize;
      for (const def of defs) {
        action(def, state, childContext);
      }
    }
  }
}

export function stateKeyPredicateFactory(chunkId: keyof StateChunks, options: PblNgridStateOptions, rootPredicate = false): ((key: string) => boolean) | undefined {
  // TODO: chunkId ans options include/exclude combination does not change
  // we need to cache it... e.g. each column def will create a new predicate if we don't cache.
  const filter = options.include || options.exclude;
  if (filter) {
    // -1: Exclude, 1: Include
    const mode: -1 | 1 = filter === options.include ? 1 : -1;
    const chunkFilter: boolean | string[] = filter[chunkId];
    if (typeof chunkFilter === 'boolean') {
      return mode === 1
        ? (key: string) => chunkFilter
        : (key: string) => !chunkFilter
      ;
    } else if (Array.isArray(chunkFilter)) {
      if (rootPredicate) {
        // root predicate is for RootStateChunks and when set to true
        // the key itself has no impact on the predicate. If the filter is boolean nothing changes
        // but if it's an array, the array is ignored and considered as true ignoring the key because a key does not existing when checking the root
        return k => true;
      } else {
        return mode === 1
          ? (key: string) => chunkFilter.indexOf(key) > -1
          : (key: string) => chunkFilter.indexOf(key) === -1
        ;
      }
    } else if (mode === 1) {
      return (key: string) => false
    }
  }
}

