import { PblColumn } from '@pebula/ngrid';
import { createStateChunkHandler } from '../../handling';
import { stateVisor } from '../../state-visor';
import { PblNgridStateLoadOptions } from '../../models/index';

export function registerColumnOrderHandlers() {
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

      if (columnOrder?.length === grid.columnApi.visibleColumns.length) {
        for (let i = 0, len = columnOrder.length; i < len; i++) {
          const anchor = grid.columnApi.visibleColumns[i];
          if (columnOrder[i] !== anchor.id) {
            const column = grid.columnApi.findColumn(columnOrder[i]);
            if (!column) {
              return;
            }
            lastMove = [column, anchor];
            grid.columnApi.moveColumn(column, anchor);
          }
        }
      }
      // With this revert/redo of the last move we just trigger a redraw.
      if (lastMove) {
        grid.columnApi.moveColumn(lastMove[1], lastMove[0]);
        grid.columnApi.moveColumn(lastMove[0], lastMove[1]);
      }
    })
    .register();
  }
