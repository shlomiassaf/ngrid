import {
  PblNgridComponent,
  PblMetaColumnDefinition, PblMetaColumn,
  PblColumnGroupDefinition, PblColumnGroup,
  PblColumnDefinition, PblColumn,
  PblMetaRowDefinitions,
  PblColumnSet,
  PblNgridColumnDefinitionSet,
  ColumnApi,
} from '@pebula/ngrid';

import { PblNgridGlobalState, StateChunkItem } from '../state-model';
import * as C from './column-def/index';
import { PblNgridSurfaceState } from './grid-primitives/index';

import './grid-primitives/index';
export * from './grid-primitives/index';

import './column-def/index';
export * from './column-def/index';

import './column-order/index';
export * from './column-order/index';

export interface PblNgridBuiltInGlobalState {
  grid: PblNgridSurfaceState;
  columns: C.PblNgridColumnDefinitionSetState;
  visibleColumnIds: string[];
}

export interface BuiltInRootStateChunks {
  grid: StateChunkItem<PblNgridSurfaceState, PblNgridComponent>;
  columns: StateChunkItem<C.PblNgridColumnDefinitionSetState, PblNgridColumnDefinitionSet>;
  visibleColumnIds: StateChunkItem<Pick<PblNgridGlobalState, 'visibleColumnIds'>, ColumnApi<any>, any, true>;
}

export interface BuiltInStateChunks {
  metaColumn: StateChunkItem<C.PblNgridMetaColumnState, PblMetaColumnDefinition | PblMetaColumn>;
  metaGroupColumn: StateChunkItem<C.PblNgridGroupColumnState, PblColumnGroupDefinition | PblColumnGroup>;
  dataColumn: StateChunkItem<C.PblNgridColumnState, PblColumnDefinition | PblColumn, DataColumnBuiltInStateChunkExtraData>;
  metaRow: StateChunkItem<C.PblNgridMetaRowSetState<C.PblNgridMetaColumnState>, PblColumnSet<PblMetaColumnDefinition | PblMetaColumn>>;
  metaGroupRow: StateChunkItem<C.PblNgridMetaRowSetState<C.PblNgridGroupColumnState>, PblColumnSet<PblColumnGroupDefinition | PblColumnGroup>>;
  dataMetaRow: StateChunkItem<C.PblNgridMetaRowState, PblMetaRowDefinitions, { kind: 'header' | 'footer'; active?: PblMetaRowDefinitions; }>;
}

export interface DataColumnBuiltInStateChunkExtraData {
  /**
   * The `PblColumn` instance, if found.
   * If no instance is found it means that the source (`PblNgridComponent.columns`) contains `PblNgridColumnDefinitions`.
   *
   * Implementation must fallback to using `ctx.source` if `pblColumn` is not provided.
   */
  pblColumn?: PblColumn;

  /**
   * The `PblColumn` instance that is currently in the grid's column store, if found.
   * The currently active column is not `pblColumn`, the store always has a copy of all columns.
   *
   * If provided, it is not a replacement for `pblColumn`, both require updates. Use the `activeColumn` to save/load the data that
   * change during runtime.
   */
  activeColumn?: PblColumn;
}
