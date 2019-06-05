import { PblNgridComponent, PblNgridPluginController } from '@pebula/ngrid';
import {
  RootStateChunks,
  StateChunks,
  PblNgridStateChunkSectionContext,
  PblNgridStateChunkContext,
  PblNgridGlobalState,
  PblNgridStateOptions,
  PblNgridStateLoadOptions,
} from './state-model';
import { PblNgridStateChunkHandlerDefinition } from './handling/base';
import { stateVisor, PblNgridStateChunkSectionConfig } from './state-visor';
import { PblNgridLocalStoragePersistAdapter } from './persistance/local-storage';
import { PblNgridIdAttributeIdentResolver } from './identification/index';

function createChunkSectionContext(grid: PblNgridComponent, options: PblNgridStateOptions | PblNgridStateLoadOptions): PblNgridStateChunkSectionContext {
  return { grid, extApi: getExtApi(grid), options };
}

function createChunkContext<T extends keyof RootStateChunks>(sectionContext: PblNgridStateChunkSectionContext,
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

function resolveId(grid: PblNgridComponent, options?: PblNgridStateOptions): string {
  const id = options.identResolver.resolveId(createChunkSectionContext(grid, options));
  if (!id) {
    throw new Error('Could not resolve a unique id for an ngrid instance, state is disabled');
  }
  return id;
}

export function hasState(grid: PblNgridComponent, options?: PblNgridStateOptions): Promise<boolean> {
  return Promise.resolve()
    .then( () => {
      options = normalizeOptions('save', options);
      const id = resolveId(grid, options);
      return options.persistenceAdapter.exists(id);
    });
}

export function saveState(grid: PblNgridComponent, options?: PblNgridStateOptions): Promise<void> {
  return Promise.resolve()
    .then( () => {
      options = normalizeOptions('save', options);
      const id = resolveId(grid, options);
      const state: PblNgridGlobalState = {} as any;
      const context = createChunkSectionContext(grid, options);

      for (const [chunkId, chunkConfig] of stateVisor.getRootSections()) {
        const keyPredicate = stateKeyPredicateFactory(chunkId, options, true);

        if (!keyPredicate || keyPredicate(chunkId)) {
          const sectionState = chunkConfig.stateMatcher(state);
          const chunkContext = createChunkContext(context, chunkConfig, 'serialize');

          const defs = stateVisor.getDefinitionsForSection(chunkId);
          for (const def of defs) {
            serialize(def, sectionState, chunkContext);
          }
        }
      }

      return options.persistenceAdapter.save(id, state);
    });
}

export function loadState(grid: PblNgridComponent, options?: PblNgridStateLoadOptions): Promise<PblNgridGlobalState> {
  return Promise.resolve()
    .then( () => {
      options = normalizeOptions('load', options);
      const id = resolveId(grid, options);
      return options.persistenceAdapter.load(id)
        .then( state => {
          const context = createChunkSectionContext(grid, options);

          for (const [chunkId, chunkConfig] of stateVisor.getRootSections()) {
            const keyPredicate = stateKeyPredicateFactory(chunkId, options, true);

            if (!keyPredicate || keyPredicate(chunkId)) {
              const sectionState = chunkConfig.stateMatcher(state);
              const chunkContext = createChunkContext(context, chunkConfig, 'deserialize');

              const defs = stateVisor.getDefinitionsForSection(chunkId);
              for (const def of defs) {
                deserialize(def, sectionState, chunkContext);
              }
            }
          }

          return state;
        });
    });
}

function stateKeyPredicateFactory(chunkId: keyof StateChunks, options: PblNgridStateOptions, rootPredicate = false): ((key: string) => boolean) | undefined {
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

function serialize(def: PblNgridStateChunkHandlerDefinition<any>, state: any, ctx: PblNgridStateChunkContext<any>): void {
  const keyPredicate = stateKeyPredicateFactory(def.chunkId, ctx.options);
  for (const key of def.keys) {
    if (!keyPredicate || keyPredicate(key as string)) {
      state[key] = def.serialize(key, ctx);
    }
  }
}

function deserialize(def: PblNgridStateChunkHandlerDefinition<any>, state: any, ctx: PblNgridStateChunkContext<any>): void {
  const keyPredicate = stateKeyPredicateFactory(def.chunkId, ctx.options);
  for (const key of def.keys) {
    if (key in state) {
      if (!keyPredicate || keyPredicate(key as string)) {
        def.deserialize(key, state[key], ctx);
      }
    }
  }
}

function normalizeOptions(mode: 'save', options?: PblNgridStateOptions): PblNgridStateOptions;
function normalizeOptions(mode: 'load', options?: PblNgridStateLoadOptions): PblNgridStateLoadOptions;
function normalizeOptions(mode: 'save' | 'load', options?: PblNgridStateOptions | PblNgridStateLoadOptions): PblNgridStateOptions | PblNgridStateLoadOptions {
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

function getExtApi(grid: PblNgridComponent) {
  const controller = PblNgridPluginController.find(grid);
  if (controller) {
    return controller.extApi;
  }
}
