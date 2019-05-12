import { RowContext } from '@angular/cdk/table';

import { PblNgridComponent } from '../table.component';
import { PblColumnTypeDefinitionDataMap, PblMetaColumn, PblColumn } from '../columns';

export interface PblNgridMetaCellContext<T, TCol extends PblMetaColumn | PblColumn = PblMetaColumn | PblColumn> {
  $implicit: PblNgridMetaCellContext<T>;
  col: TCol;
  table: PblNgridComponent<T>;
}

export interface PblNgridCellContext<T = any, P extends keyof PblColumnTypeDefinitionDataMap = keyof PblColumnTypeDefinitionDataMap> {
  rowContext: PblNgridRowContext<T>,
  $implicit: PblNgridCellContext<T>;
  row: T,
  value: any;
  col: PblColumn;
  table: PblNgridComponent<T>;
  readonly index: number;
  readonly editing: boolean;

  startEdit(markForCheck?: boolean): void;
  stopEdit(markForCheck?: boolean): void;

  // selectRow(): void;
  // selectCell(): void;
}

export interface PblNgridRowContext<T = any> extends RowContext<T> {
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

  readonly table: PblNgridComponent<T>;

  /**
   * Returns the length of cells context stored in this row
   */
  readonly length: number;

  cell(index: number): PblNgridCellContext<T> | undefined;

  /**
   * Returns a shallow copy of the current cell's context array.
   */
  getCells(): PblNgridCellContext<T>[];

  /**
   * Updates the `outOfView` property.
   */
  updateOutOfViewState(): void;
}

export interface PblNgridContextApi<T = any> {
  /**
   * Clear the current context.
   * This method will reset the context of all cells.
   *
   * In most cases, you do not need to run this method because it will automatically run when
   * the datasource is replaced (entire datasource instance).
   *
   * However, if you are keeping the same datasource but switching data internally (onTrigger)
   * you can clear the context using this method.
   */
  clear(): void;

  /**
   * Get the row context in the specified index.
   *
   * The specified index refers to the rendered index and not the index in the data store.
   * If you are not using virtual scroll the rendered index is the same as the data index.
   *
   * > You can transform data < -- > render index's using the data source.
   * @param rowIndex The RENDER index position of the row.
   */
  getRow(rowIndex: number): PblNgridRowContext<T> | undefined;

  /**
   * Get the cell context in the specific row index and column index
   * @param rowIndex The index position of the row.
   * @param colIndex The index position of the column.
   */
  getCell(rowIndex: number, colIndex: number): PblNgridCellContext<T> | undefined;

}
