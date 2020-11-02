import { utils } from '@pebula/ngrid';
import { createStateChunkHandler } from '../../handling';
import { stateVisor } from '../../state-visor';
import { StateChunks, PblNgridStateChunkContext } from '../../models/index';
import { PblNgridMetaRowSetState, PblNgridMetaColumnState, PblNgridGroupColumnState, PblNgridColumnDefinitionSetState } from './model';
import { registerColumnDefChildHandlers } from './children';

function runChildChunksForRowMetaColumns<TCol, TChild extends keyof StateChunks>(childChunkId: TChild, ctx: PblNgridStateChunkContext<"columns">, columns: TCol[]) {
  const stateColumns = [];
  for (const col of columns) {
    const c: StateChunks[TChild]['state'] = {} as any;
    ctx.runChildChunk(childChunkId, c, col);
    stateColumns.push(c);
  }
  return stateColumns;
}

/** Runs the process for the `header` and `footer` sections in the `table` section (if they exist) */
function runChildChunkForDataMetaRows(mode: 's' | 'd', state: PblNgridColumnDefinitionSetState['table'], ctx: PblNgridStateChunkContext<"columns">) {
  const { columnStore } = ctx.extApi;
  const { table } = ctx.source;
  for (const kind of ['header', 'footer'] as Array<'header' | 'footer'>) {
    // This is a mapping of the from->to relationship (i.e serializing or deserializing)
    const src = mode === 's' ? table : state;
    const dest = src === table ? state : table;

    // we need to have a source
    if (src[kind]) {
      const active = kind === 'header' ? columnStore.headerColumnDef : columnStore.footerColumnDef;
      if (!dest[kind]) { dest[kind] = {}; }
      ctx.runChildChunk('dataMetaRow', state[kind], table[kind], { kind, active });
    }
  }
}

function runChildChunksForRowDataColumns(mode: 's' | 'd', state: PblNgridColumnDefinitionSetState['table'], ctx: PblNgridStateChunkContext<"columns">) {
  const { table } = ctx.source;
  const src = mode === 's' ? table : state;

  const resolve = src === state
    ? col => ({ colState: col, pblColumn: table.cols.find( tCol => (utils.isPblColumn(tCol) && tCol.orgProp === col.prop) || (tCol.id === col.id || tCol.prop === col.prop) ) })
    : col => ({ colState: state.cols[state.cols.push({} as any) - 1] , pblColumn: utils.isPblColumn(col) && col })
  ;

  if (src.cols && src.cols.length > 0) {
    for (const col of src.cols) {
      const { colState, pblColumn } = resolve(col)

      const data = {
        pblColumn: utils.isPblColumn(pblColumn) && pblColumn,
        activeColumn: ctx.grid.columnApi.findColumn(col.id || col.prop),
      }
      ctx.runChildChunk('dataColumn', colState, pblColumn, data);
    }
  }
}

export function registerColumnDefHandlers() {
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

  createStateChunkHandler('columns')
    .handleKeys('table', 'header', 'headerGroup', 'footer')
    .serialize( (key, ctx) => {
      switch (key) {
        case 'table':
          const state: PblNgridColumnDefinitionSetState['table'] = { cols: [] };
          runChildChunkForDataMetaRows('s', state, ctx);
          runChildChunksForRowDataColumns('s', state, ctx);
          return state;
        case 'header':
        case 'footer':
          const source = ctx.source[key];
          if (source && source.length > 0) {
            const rows = [];
            for (const row of source) {
              const r: PblNgridMetaRowSetState<PblNgridMetaColumnState> = {} as any;
              ctx.runChildChunk('metaRow', r, row);
              r.cols = runChildChunksForRowMetaColumns('metaColumn', ctx, row.cols);
              rows.push(r);
            }
            return rows;
          }
          break;
        case 'headerGroup':
          const headerGroupSource = ctx.source.headerGroup;
          if (headerGroupSource && headerGroupSource.length > 0) {
            const rows = [];
            for (const row of headerGroupSource) {
              const r: PblNgridMetaRowSetState<PblNgridGroupColumnState> = {} as any;
              ctx.runChildChunk('metaGroupRow', r, row);
              r.cols = runChildChunksForRowMetaColumns('metaColumn', ctx, row.cols);
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
          const state = stateValue as PblNgridColumnDefinitionSetState['table'];
          runChildChunkForDataMetaRows('d', state, ctx);
          runChildChunksForRowDataColumns('d', state, ctx);
          break;
        case 'header':
        case 'footer':
          const source = ctx.source[key];
          const metaRowsState = stateValue as PblNgridColumnDefinitionSetState['header'];
          if (metaRowsState && metaRowsState.length > 0) {
            for (const rowState of metaRowsState) {
              const row = source.find( r => r.rowIndex === rowState.rowIndex );
              if (row) {
                ctx.runChildChunk('metaRow', rowState, row);
                for (const colState of rowState.cols) {
                  const col = row.cols.find( r => r.id === colState.id);
                  if (col) {
                    const activeColStore = ctx.extApi.columnStore.find(colState.id);
                    ctx.runChildChunk('metaColumn', colState, col);
                  }
                }
              }
            }
          }
          break;
        case 'headerGroup':
          break;
      }
    })
    .register();

    registerColumnDefChildHandlers();
}

export {
  PblNgridMetaColumnState,
  PblNgridGroupColumnState,
  PblNgridColumnState,
  PblNgridMetaRowState,
  PblNgridMetaRowSetState,
  PblNgridColumnDefinitionSetState,
} from './model';
