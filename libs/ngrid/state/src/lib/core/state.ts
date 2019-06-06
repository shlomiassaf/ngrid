import { PblNgridComponent } from '@pebula/ngrid';
import { PblNgridGlobalState, PblNgridStateOptions, PblNgridStateLoadOptions } from './models/index';
import { stateVisor } from './state-visor';
import * as U from './utils';

export function hasState(grid: PblNgridComponent, options?: PblNgridStateOptions): Promise<boolean> {
  return Promise.resolve()
    .then( () => {
      options = U.normalizeOptions('save', options);
      const id = U.resolveId(grid, options);
      return options.persistenceAdapter.exists(id);
    });
}

export function saveState(grid: PblNgridComponent, options?: PblNgridStateOptions): Promise<void> {
  return Promise.resolve()
    .then( () => {
      options = U.normalizeOptions('save', options);
      const id = U.resolveId(grid, options);
      const state: PblNgridGlobalState = {} as any;
      const context = U.createChunkSectionContext(grid, options);

      for (const [chunkId, chunkConfig] of stateVisor.getRootSections()) {
        const keyPredicate = U.stateKeyPredicateFactory(chunkId, options, true);

        if (!keyPredicate || keyPredicate(chunkId)) {
          const sectionState = chunkConfig.stateMatcher(state);
          const chunkContext = U.createChunkContext(context, chunkConfig, 'serialize');

          const defs = stateVisor.getDefinitionsForSection(chunkId);
          for (const def of defs) {
            U.serialize(def, sectionState, chunkContext);
          }
        }
      }
      return options.persistenceAdapter.save(id, state);
    });
}

export function loadState(grid: PblNgridComponent, options?: PblNgridStateLoadOptions): Promise<PblNgridGlobalState> {
  return Promise.resolve()
    .then( () => {
      options = U.normalizeOptions('load', options);
      const id = U.resolveId(grid, options);
      return options.persistenceAdapter.load(id)
        .then( state => {
          const context = U.createChunkSectionContext(grid, options);

          for (const [chunkId, chunkConfig] of stateVisor.getRootSections()) {
            const keyPredicate = U.stateKeyPredicateFactory(chunkId, options, true);

            if (!keyPredicate || keyPredicate(chunkId)) {
              const sectionState = chunkConfig.stateMatcher(state);
              const chunkContext = U.createChunkContext(context, chunkConfig, 'deserialize');

              const defs = stateVisor.getDefinitionsForSection(chunkId);
              for (const def of defs) {
                U.deserialize(def, sectionState, chunkContext);
              }
            }
          }
          return state;
        });
    });
}

