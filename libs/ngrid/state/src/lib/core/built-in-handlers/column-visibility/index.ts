import { PblColumn } from '@pebula/ngrid';
import { createStateChunkHandler } from '../../handling';
import { stateVisor } from '../../state-visor';
import { PblNgridStateLoadOptions } from '../../models/index';

export function registerColumnVisibilityHandlers() {
  stateVisor.registerRootChunkSection(
    'columnVisibility',
    {
      sourceMatcher: ctx => ctx.grid.columnApi,
      stateMatcher: state => {
        if (!state.columnVisibility) {
          state.columnVisibility = [];
        }
        return state;
      }
    }
  );

  createStateChunkHandler('columnVisibility')
    .handleKeys('columnVisibility')
    .serialize( (key, ctx) => ctx.source.hiddenColumnIds )
    .deserialize( (key, columnVisibility, ctx) => {
      ctx.extApi.columnStore.updateColumnVisibility(columnVisibility);
    })
    .register();
  }
