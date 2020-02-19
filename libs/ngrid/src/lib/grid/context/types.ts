import { Observable } from 'rxjs';
import { RowContext } from '@angular/cdk/table';

import { PblNgridComponent } from '../ngrid.component';
import { PblColumnTypeDefinitionDataMap, PblMetaColumn, PblColumn } from '../columns';
import { PblRowContext } from './row';

declare module '@angular/cdk/table/table.d' {
  interface RowContext<T> {
    gridInstance: PblNgridComponent<T>;
  }
}

export interface CellContextState<T = any> {
  editing: boolean;
  focused: boolean;
  selected: boolean;
}

export interface RowContextState<T = any> {
  identity: any;
  dataIndex: number;
  cells: CellContextState<T>[];
  firstRender: boolean;
}

/**
 * A reference to a data cell on the grid.
 */
export interface GridDataPoint {
  /**
   * The row identity.
   * If the grid was set with an identity property use the value of the identity otherwise, use the location of the row in the datasource.
   */
  rowIdent: any;
  /**
   * The column index, relative to the column definition set provided to the grid.
   * Note that this is the absolute position, including hidden columns.
   */
  colIndex: number;
}

export type CellReference = HTMLElement | GridDataPoint | PblNgridCellContext;

export interface PblNgridFocusChangedEvent {
  prev: GridDataPoint | undefined;
  curr: GridDataPoint | undefined;
}

export interface PblNgridSelectionChangedEvent {
  added: GridDataPoint[];
  removed: GridDataPoint[];
}

export interface PblNgridMetaCellContext<T = any, TCol extends PblMetaColumn | PblColumn = PblMetaColumn | PblColumn> {
  $implicit: PblNgridMetaCellContext<T>;
  col: TCol;

  /** @deprecated use grid instead */
  table: PblNgridComponent<T>;
  grid: PblNgridComponent<T>;
}

export interface PblNgridCellContext<T = any, P extends keyof PblColumnTypeDefinitionDataMap = keyof PblColumnTypeDefinitionDataMap> {
  rowContext: PblNgridRowContext<T>,
  $implicit: PblNgridCellContext<T>;
  row: T,
  value: any;
  col: PblColumn;
  /** @deprecated use grid instead */
  table: PblNgridComponent<T>;
  grid: PblNgridComponent<T>;
  readonly index: number;
  readonly editing: boolean;
  readonly focused: boolean;
  readonly selected: boolean;

  startEdit(markForCheck?: boolean): void;
  stopEdit(markForCheck?: boolean): void;
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

  /** @deprecated use grid instead */
  readonly table: PblNgridComponent<T>;
  readonly grid: PblNgridComponent<T>;

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
   * The reference to currently focused cell context.
   * You can retrieve the actual context or context cell using `findRowInView` and / or `findRowInCache`.
   *
   * > Note that when virtual scroll is enabled the currently focused cell does not have to exist in the view.
   * If this is the case `findRowInView` will return undefined, use `findRowInCache` instead.
   */
  readonly focusedCell: GridDataPoint | undefined;
    /**
   * Notify when the focus has changed.
   *
   * > Note that the notification is not immediate, it will occur on the closest micro-task after the change.
   */
  readonly focusChanged: Observable<PblNgridFocusChangedEvent>;

  /**
   * The reference to currently selected range of cell's context.
   * You can retrieve the actual context or context cell using `findRowInView` and / or `findRowInCache`.
   *
   * > Note that when virtual scroll is enabled the currently selected cells does not have to exist in the view.
   * If this is the case `findRowInView` will return undefined, use `findRowInCache` instead.
   */
  readonly selectedCells: GridDataPoint[];
  /**
   * Notify when the selected cells has changed.
   */
  readonly selectionChanged: Observable<PblNgridSelectionChangedEvent>;

  /**
   * Focus the provided cell.
   * If a cell is not provided will un-focus (blur) the currently focused cell (if there is one).
   * @param cellRef A Reference to the cell
   * @param markForCheck Mark the row for change detection
   */
  focusCell(cellRef?: CellReference | boolean, markForCheck?: boolean): void;

  /**
   * Select all provided cells.
   * @param cellRef A Reference to the cell
   * @param markForCheck Mark the row for change detection
   * @param clearCurrent Clear the current selection before applying the new selection.
   * Default to false (add to current).
   */
  selectCells(cellRefs: CellReference[], markForCheck?: boolean, clearCurrent?: boolean): void;
  /**
   * Unselect all provided cells.
   * If cells are not provided will un-select all currently selected cells.
   * @param cellRef A Reference to the cell
   * @param markForCheck Mark the row for change detection
   */
  unselectCells(cellRefs?: CellReference[] | boolean, markForCheck?: boolean): void;

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
   * Try to find a specific row context, using the row identity, in the current view.
   * If the row is not in the view (or even not in the cache) it will return undefined, otherwise returns the row's context instance (`PblRowContext`)
   * @param rowIdentity The row's identity. If a specific identity is used, please provide it otherwise provide the index of the row in the datasource.
   */
  findRowInView(rowIdentity: any): PblRowContext<T> | undefined;

  /**
   * Try to find a specific row context, using the row identity, in the context cache.
   * Note that the cache does not hold the context itself but only the state that can later be used to retrieve a context instance. The context instance
   * is only used as context for rows in view.
   * @param rowIdentity The row's identity. If a specific identity is used, please provide it otherwise provide the index of the row in the datasource.
   */
  findRowInCache(rowIdentity: any): RowContextState<T> | undefined;
  /**
   * Try to find a specific row context, using the row identity, in the context cache.
   * Note that the cache does not hold the context itself but only the state that can later be used to retrieve a context instance. The context instance
   * is only used as context for rows in view.
   * @param rowIdentity The row's identity. If a specific identity is used, please provide it otherwise provide the index of the row in the datasource.
   * @param offset When set, returns the row at the offset from the row with the provided row identity. Can be any numeric value (e.g 5, -6, 4).
   * @param create Whether to create a new state if the current state does not exist.
   */
  findRowInCache(rowIdentity: any, offset: number, create: boolean): RowContextState<T> | undefined;

  /**
   * Get the row context in the specified index.
   *
   * The specified index refers to the rendered index and not the index in the data store.
   * If you are not using virtual scroll the rendered index is the same as the data index.
   *
   * > You can transform data < -- > render index's using the data source.
   * @param rowIndex The RENDER index position of the row.
   */
  getRow(rowIndex: number | HTMLElement): PblNgridRowContext<T> | undefined;

  getCell(cell: HTMLElement | GridDataPoint): PblNgridCellContext | undefined
  /**
   * Get the cell context in the specific row index and column index
   * @param rowIndex The index position of the row.
   * @param colIndex The index position of the column.
   */
  getCell(rowIndex: number, colIndex: number): PblNgridCellContext<T> | undefined;

  getDataItem(cell: CellReference): any;
}
