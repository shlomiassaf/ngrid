import { PblColumn } from '@pebula/ngrid';
import { createStateChunkHandler } from '../../handling';
import { stateVisor } from '../../state-visor';

stateVisor.registerRootChunkSection(
  'visibleColumnIds',
  {
    sourceMatcher: ctx => ctx.grid.columnApi,
    stateMatcher: state => {
      if (!state.visibleColumnIds) {
        state.visibleColumnIds = [];
      }
      return state;
    }
  }
);

createStateChunkHandler('visibleColumnIds')
  .handleKeys('visibleColumnIds')
  .serialize( (key, ctx) => ctx.source[key].slice() )
  .deserialize( (key, visibleColumnIds, ctx) => {
    const { extApi, grid } = ctx;
    let lastMove: [PblColumn, PblColumn];

    if (visibleColumnIds && visibleColumnIds.length === grid.columnApi.visibleColumnIds.length) {
      for (let i = 0, len = visibleColumnIds.length; i < len; i++) {
        if (visibleColumnIds[i] !== grid.columnApi.visibleColumnIds[i]) {
          const column = grid.columnApi.findColumn(visibleColumnIds[i]);
          if (!column) {
            return;
          }
          const anchor = grid.columnApi.findColumn(grid.columnApi.visibleColumnIds[i]);
          lastMove = [column, anchor];
          grid.columnApi.moveColumn(column, anchor, true);
          extApi.columnStore.updateGroups();
        }
      }
    }
    // With this revert/redo of the last move we just trigger a redraw.
    if (lastMove) {
      grid.columnApi.moveColumn(lastMove[1], lastMove[0], true);
      grid.columnApi.moveColumn(lastMove[0], lastMove[1]);
    }
  })
  .register();
