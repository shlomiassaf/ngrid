import { PblNgridColumnDefinitionSet, utils } from '@pebula/ngrid';
import { createStateChunkHandler } from '../../handling';
import { stateVisor } from '../../state-visor';
import { StateChunks, PblNgridStateChunkContext } from '../../state-model';
import { PblNgridMetaRowSetState, PblNgridMetaColumnState, PblNgridGroupColumnState, PblNgridColumnDefinitionSetState } from './model';

stateVisor.registerRootChunkSection(
  'columns',
  {
    sourceMatcher: ctx => ctx.grid.columns,
    stateMatcher: state => state.columns || (state.columns = {
      table: {
        cols: [],
      },
      header: [],
      footer: [],
      headerGroup: [],
    })
  }
);

function runChildChunksForRowColumns<TCol, TChild extends keyof StateChunks>(childChunkId: TChild, ctx: PblNgridStateChunkContext<"columns">, columns: TCol[], data?: StateChunks[TChild]['data']) {
  const stateColumns = [];
  for (const col of columns) {
    const c: StateChunks[TChild]['state'] = {} as any;
    ctx.runChildChunk(childChunkId, c, col, data);
    stateColumns.push(c);
  }
  return stateColumns;
}

createStateChunkHandler('columns')
  .handleKeys('table', 'header', 'headerGroup', 'footer')
  .serialize( (key, ctx) => {
    switch (key) {
      case 'table':
        const table: PblNgridColumnDefinitionSet['table'] = { cols: [] };

        if (ctx.source.table.header) {
          table.header = {} as any;
          ctx.runChildChunk('dataMetaRow', table.header, ctx.source.table.header, { kind: 'header' });
        }

        if (ctx.source.table.footer) {
          table.footer = {} as any;
          ctx.runChildChunk('dataMetaRow', table.footer, ctx.source.table.footer, { kind: 'footer' });
        }

        const stateColumns = [];
        for (const col of ctx.source.table.cols) {
          const c = {} as any;
          const data = {
            pblColumn: utils.isPblColumn(col) && col,
            activeColumn: ctx.grid.columnApi.findColumn(col.id || col.prop),
          }

          ctx.runChildChunk('dataColumn', c, col, data);
          stateColumns.push(c);
        }
        table.cols = stateColumns;
        return table;
      case 'header':
      case 'footer':
        if (ctx.source[key] && ctx.source[key].length > 0) {
          const rows = [];
          for (const row of ctx.source[key]) {
            const r: PblNgridMetaRowSetState<PblNgridMetaColumnState> = {} as any;
            ctx.runChildChunk('metaRow', r, row);
            r.cols = runChildChunksForRowColumns('metaColumn', ctx, row.cols);
            rows.push(r);
          }
          return rows;
        }
        break;
      case 'headerGroup':
        if (ctx.source.headerGroup && ctx.source.headerGroup.length > 0) {
          const rows = [];
          for (const row of ctx.source.headerGroup) {
            const r: PblNgridMetaRowSetState<PblNgridGroupColumnState> = {} as any;
            ctx.runChildChunk('metaGroupRow', r, row);
            r.cols = runChildChunksForRowColumns('metaGroupColumn', ctx, row.cols);
            rows.push(r);
          }
          return rows;
        }
        break;
    }
  })
  .deserialize( (key, stateValue, ctx) => {
    switch (key) {
      case 'table':
        const { table } = ctx.source;
        const state = stateValue as PblNgridColumnDefinitionSetState['table'];

        if (state.header) {
          ctx.runChildChunk('dataMetaRow', state.header, table.header, { kind: 'header' });
        }

        if (state.footer) {
          ctx.runChildChunk('dataMetaRow', state.footer, table.footer, { kind: 'footer' });
        }

        for (const col of state.cols) {
          const pblColumn = ctx.grid.columns.table.cols.find( tCol => (utils.isPblColumn(tCol) && tCol.orgProp === col.prop) || (tCol.id === col.id || tCol.prop === col.prop) )
          const data = {
            pblColumn: utils.isPblColumn(pblColumn) && pblColumn,
            activeColumn: ctx.grid.columnApi.findColumn(col.id || col.prop),
          }
          ctx.runChildChunk('dataColumn', col, pblColumn, data);
        }

        break;
      // case 'header':
      // case 'footer':
      //   const metaRowsState = stateValue as PblNgridColumnDefinitionSetState['header'];
      //   if (metaRowsState && metaRowsState.length > 0) {
      //     for (const row of metaRowsState) {
      //       const rowAt = ctx.extApi.columnStore.metaColumnIds[key][row.rowIndex];
      //       ctx.runChildChunk('metaRow', row, );
      //     }
      //   }
      //   if (ctx.source[key] && ctx.source[key].length > 0) {
      //     const rows = [];
      //     for (const row of ctx.source[key]) {
      //       const r: PblNgridMetaRowSetState<PblNgridMetaColumnState> = {} as any;
      //       ctx.runChildChunk('metaRow', r, row);
      //       r.cols = runChildChunksForRowColumns('metaColumn', ctx, row.cols);
      //       rows.push(r);
      //     }
      //     return rows;
      //   }
      // case 'headerGroup':
      //   if (ctx.source.headerGroup && ctx.source.headerGroup.length > 0) {
      //     const rows = [];
      //     for (const row of ctx.source.headerGroup) {
      //       const r: PblNgridMetaRowSetState<PblNgridGroupColumnState> = {} as any;
      //       ctx.runChildChunk('metaGroupRow', r, row);
      //       r.cols = runChildChunksForRowColumns('metaGroupColumn', ctx, row.cols);
      //       rows.push(r);
      //     }
      //     return rows;
      //   }
    }
  })
  .register();

import './children';

export {
  PblNgridMetaColumnState,
  PblNgridGroupColumnState,
  PblNgridColumnState,
  PblNgridMetaRowState,
  PblNgridMetaRowSetState,
  PblNgridColumnDefinitionSetState,
} from './model';
