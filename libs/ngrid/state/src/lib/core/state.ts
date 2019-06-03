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
import { stateVisor, PblNgridStateChunkSectionConfig } from './state-visor';
import { PblNgridLocalStoragePersistAdapter } from './persistance/local-storage';

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

      if (mode === 'serialize') {
        for (const def of defs) {
          for (const key of def.keys) {
            state[key] = def.serialize(key, childContext);
          }
        }
      } else {
        for (const def of defs) {
          for (const key of def.keys) {
            def.deserialize(key, state[key], childContext);
          }
        }
      }
    }
  }
}

export function hasState(grid: PblNgridComponent, options?: PblNgridStateOptions): Promise<boolean> {
  options = normalizeOptions('save', options);
  const id = grid.id;
  return options.adapter.exists(id);
}

export function saveState(grid: PblNgridComponent, options?: PblNgridStateOptions): Promise<void> {
  options = normalizeOptions('save', options);
  const id = grid.id;
  const state: PblNgridGlobalState = {} as any;
  const context = createChunkSectionContext(grid, options);

  for (const [chunkId, chunkConfig] of stateVisor.getRootSections()) {
    const sectionState = chunkConfig.stateMatcher(state);
    const chunkContext = createChunkContext(context, chunkConfig, 'serialize');

    const defs = stateVisor.getDefinitionsForSection(chunkId);
    for (const def of defs) {
      for (const key of def.keys) {
        sectionState[key] = def.serialize(key, chunkContext);
      }
    }
  }

  return options.adapter.save(id, state);
}

export function loadState(grid: PblNgridComponent, options?: PblNgridStateLoadOptions): Promise<PblNgridGlobalState> {
  options = normalizeOptions('load', options);
  const extApi = getExtApi(grid);
  const id = grid.id;

  return options.adapter.load(id)
    .then( state => {
      const context = createChunkSectionContext(grid, options);

      for (const [chunkId, chunkConfig] of stateVisor.getRootSections()) {
        const sectionState = chunkConfig.stateMatcher(state);
        const chunkContext = createChunkContext(context, chunkConfig, 'deserialize');

        const defs = stateVisor.getDefinitionsForSection(chunkId);
        for (const def of defs) {
          for (const key of def.keys) {
            def.deserialize(key, sectionState[key], chunkContext);
          }
        }
      }

      return state;
    });
}

function normalizeOptions(mode: 'save', options?: PblNgridStateOptions): PblNgridStateOptions;
function normalizeOptions(mode: 'load', options?: PblNgridStateLoadOptions): PblNgridStateLoadOptions;
function normalizeOptions(mode: 'save' | 'load', options?: PblNgridStateOptions | PblNgridStateLoadOptions): PblNgridStateOptions | PblNgridStateLoadOptions {
  if (!options) {
    options = {} as any;
  }

  if (!options.adapter) {
    options.adapter = new PblNgridLocalStoragePersistAdapter();
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
