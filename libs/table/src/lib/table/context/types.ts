import { RowContext } from '@angular/cdk/table';

import { NegTableComponent } from '../table.component';
import { NegColumnTypeDefinitionDataMap, NegMetaColumn, NegColumn } from '../columns';

export interface NegTableMetaCellContext<T, TCol extends NegMetaColumn | NegColumn = NegMetaColumn | NegColumn> {
  $implicit: NegTableMetaCellContext<T>;
  col: TCol;
  table: NegTableComponent<T>;
}

export interface NegTableCellContext<T = any, P extends keyof NegColumnTypeDefinitionDataMap = keyof NegColumnTypeDefinitionDataMap> {
  rowContext: NegTableRowContext<T>,
  $implicit: NegTableCellContext<T>;
  row: T,
  value: any;
  col: NegColumn;
  table: NegTableComponent<T>;
  readonly index: number;
  readonly editing: boolean;

  startEdit(markForCheck?: boolean): void;
  stopEdit(markForCheck?: boolean): void;

  // selectRow(): void;
  // selectCell(): void;
}

export interface NegTableRowContext<T = any> extends RowContext<T> {
  identity: number;

  /**
   * When true, it is the first time that the row is rendered.
   * Once the row leaves the view this will be false and will not change.
   *
   * Note that rendered items might appear outside of the viewport if virtual scroll is not set and
   * when set but the row is rendered as part of the buffer.
   *
   * This is relevant only when virtual scroll is set.
   */
  firstRender: boolean;

  /**
   * When true, indicates that the row is rendered outside of the viewport.
   *
   * The indicator is updated when rows are rendered (i.e. not live, on scroll events).
   * Understanding this behavior is important!!!
   *
   * For live updated, you can use `updateOutOfViewState()` to trigger updates from a scroll stream. (keep track on performance)
   *
   * Note that when virtual scroll is enabled `true` indicates a buffer row.
   */
  outOfView: boolean;

  readonly table: NegTableComponent<T>;

  updateOutOfViewState(): void;
}
