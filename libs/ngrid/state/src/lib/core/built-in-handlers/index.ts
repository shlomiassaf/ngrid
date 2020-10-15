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

import { PblNgridGlobalState, StateChunkItem } from '../models/index';
import * as C from './column-def/index';
import { PblNgridSurfaceState } from './grid-primitives/index';

export * from './grid-primitives/index';
export * from './column-def/index';
export * from './column-order/index';

export interface PblNgridBuiltInGlobalState {
  grid: PblNgridSurfaceState;
  columns: C.PblNgridColumnDefinitionSetState;
  columnOrder: string[];
  columnVisibility: string[];
}

export interface BuiltInRootStateChunks {
  /**
   * A state chunk that handles serialization of primitive properties on the grid instance (PblNgridComponent)
   *
   * - key/value chunk.
   * - root chunk.
   */
  grid: StateChunkItem<PblNgridSurfaceState, PblNgridComponent>;
  /**
   * A state chunk that handles serialization of the entire column definition set.
   *
   * It include a limited set of keys that you can control (include/exclude).
   * Based on the keys processed, additional child chunks are processed, based on the processed key and object it represents.
   *
   * - key/value chunk.
   * - has children chunks
   * - root chunk.
   */
  columns: StateChunkItem<C.PblNgridColumnDefinitionSetState, PblNgridColumnDefinitionSet>;
  /**
   * A state chunk that handles serialization of the current column order.
   * This is a keyless chunk, in this case an array, so you can only include / exclude it as a whole.
   *
   * - keyless chunk.
   * - root chunk.
   */
  columnOrder: StateChunkItem<Pick<PblNgridGlobalState, 'columnOrder'>, ColumnApi<any>, any, true>;
  /**
   * A state chunk that handles serialization of the current column visibility.
   * This is a keyless chunk, in this case an array, so you can only include / exclude it as a whole.
   *
   * - keyless chunk.
   * - root chunk.
   */
  columnVisibility: StateChunkItem<Pick<PblNgridGlobalState, 'columnVisibility'>, ColumnApi<any>, any, true>;
}

export interface BuiltInStateChunks {
  /**
   * A state chunk that handles serialization of meta columns (header / footer).
   *
   * This is a child chunk of the `columns` root chunk
   */
  metaColumn: StateChunkItem<C.PblNgridMetaColumnState, PblMetaColumnDefinition | PblMetaColumn>;
  /**
   * A state chunk that handles serialization of meta group columns (header group).
   *
   * This is a child chunk of the `columns` root chunk
   */
  metaGroupColumn: StateChunkItem<C.PblNgridGroupColumnState, PblColumnGroupDefinition | PblColumnGroup>;
  /**
   * A state chunk that handles serialization of data columns.
   *
   * This is a child chunk of the `columns` root chunk
   */
  dataColumn: StateChunkItem<C.PblNgridColumnState, PblColumnDefinition | PblColumn, DataColumnBuiltInStateChunkExtraData>;
  /**
   * A state chunk that handles serialization of meta rows (A row with header / footer column).
   *
   * This is a child chunk of the `columns` root chunk
   *
   * Note that a `metaRow` does not refer to that main header/footer rows, it only refers to additional meta rows.
   * The `dataMetaRow` section chunk is the one referring to the main header/footer rows
   */
  metaRow: StateChunkItem<C.PblNgridMetaRowSetState<C.PblNgridMetaColumnState>, PblColumnSet<PblMetaColumnDefinition | PblMetaColumn>>;
  /**
   * A state chunk that handles serialization of meta group rows (A row with header group columns).
   *
   * This is a child chunk of the `columns` root chunk
   */
  metaGroupRow: StateChunkItem<C.PblNgridMetaRowSetState<C.PblNgridGroupColumnState>, PblColumnSet<PblColumnGroupDefinition | PblColumnGroup>>;
  /**
   * A state chunk that handles serialization of data rows (A row with data columns).
   *
   * This is a child chunk of the `columns` root chunk
   */
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
