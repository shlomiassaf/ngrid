import { PblColumn } from '@pebula/ngrid';
import { createStateChunkHandler } from '../../handling';
import { stateVisor } from '../../state-visor';
import { PblNgridStateLoadOptions } from '../../models/index';

stateVisor.registerRootChunkSection(
  'columnOrder',
  {
    sourceMatcher: ctx => ctx.grid.columnApi,
    stateMatcher: state => {
      if (!state.columnOrder) {
        state.columnOrder = [];
      }
      return state;
    }
  }
);

createStateChunkHandler('columnOrder')
  .handleKeys('columnOrder')
  .serialize( (key, ctx) => ctx.source.visibleColumnIds.slice() )
  .deserialize( (key, columnOrder, ctx) => {
    const { extApi, grid } = ctx;
    let lastMove: [PblColumn, PblColumn];

    const { visibleColumnIds } = grid.columnApi;
    if (columnOrder && columnOrder.length === visibleColumnIds.length) {
      for (let i = 0, len = columnOrder.length; i < len; i++) {
        if (columnOrder[i] !== visibleColumnIds[i]) {
          const column = grid.columnApi.findColumn(columnOrder[i]);
          if (!column) {
            return;
          }
          const anchor = grid.columnApi.findColumn(visibleColumnIds[i]);
          lastMove = [column, anchor];
          grid.columnApi.moveColumn(column, anchor, true);
          extApi.columnStore.updateGroups();
        }
      }
    }
    // With this revert/redo of the last move we just trigger a redraw.
    if (lastMove) {
      grid.columnApi.moveColumn(lastMove[1], lastMove[0], true);
      grid.columnApi.moveColumn(lastMove[0], lastMove[1], (ctx.options as PblNgridStateLoadOptions).avoidRedraw);
    }
  })
  .register();
