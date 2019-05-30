import { PblNgridComponent } from '@pebula/ngrid';
import { PersistAdapter } from './persistance';
import { PblNgridGlobalState } from './state-model';
import { stateVisor } from './state-visor';

export function saveState(grid: PblNgridComponent, adapter: PersistAdapter): Promise<void> {
  const extApi = null;  // TODO: get extApi
  const id = grid.id;
  const state: PblNgridGlobalState = {} as any;

  for (const [chunkId, options] of stateVisor.getSections()) {
    const sectionState = options.stateMatcher(state);
    const context = { grid, extApi, source: options.sourceMatcher({ grid, extApi }) };

    const defs = stateVisor.getDefinitionsForSection(chunkId);
    for (const def of defs) {
      for (const key of def.keys) {
        sectionState[key] = def.serialize(key, context);
      }
    }
  }

  return adapter.save(id, state);
}

export function loadState(grid: PblNgridComponent, adapter: PersistAdapter): Promise<PblNgridGlobalState> {
  const extApi = null;  // TODO: get extApi
  const id = grid.id;

  return adapter.load(id)
    .then( state => {

      for (const [chunkId, options] of stateVisor.getSections()) {
        const sectionState = options.stateMatcher(state);
        const context = { grid, extApi, source: options.sourceMatcher({ grid, extApi }) };

        const defs = stateVisor.getDefinitionsForSection(chunkId);
        for (const def of defs) {
          for (const key of def.keys) {
            def.deserialize(key, sectionState[key], context);
          }
        }
      }

      return state;
    });
}
