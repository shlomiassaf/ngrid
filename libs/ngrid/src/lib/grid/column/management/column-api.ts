import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { PblNgridExtensionApi } from '../../../ext/grid-ext-api';
import { PblNgridComponent } from '../../ngrid.component';
import { PblColumn, isPblColumn } from '../model/column';
import { PblColumnStore } from './column-store';
import { AutoSizeToFitOptions } from './types';

export class ColumnApi<T> {

  // workaround, we need a parameter-less constructor since @ngtools/webpack@8.0.4
  // Non @Injectable classes are now getting addded with hard reference to the ctor params which at the class creation point are undefined
  // forwardRef() will not help since it's not inject by angular, we instantiate the class..
  // probably due to https://github.com/angular/angular-cli/commit/639198499973e0f437f059b3c933c72c733d93d8
  static create<T>(extApi: PblNgridExtensionApi): ColumnApi<T> {
    const instance = new ColumnApi<T>();

    instance.grid = extApi.grid;
    instance.store = extApi.columnStore;
    instance.extApi = extApi;

    return instance;
  }

  get visibleColumnIds(): string[] { return this.store.visibleColumnIds; }
  get hiddenColumnIds(): string[] { return this.store.hiddenColumnIds; }
  get visibleColumns(): PblColumn[] { return this.store.visibleColumns; }
  get columns(): PblColumn[] { return this.store.allColumns; }
  get columnIds(): string[] { return this.store.columnIds; }

  get totalColumnWidthChange(): Observable<number> {
    if (!this._totalColumnWidthChange) {
      this._totalColumnWidthChange = this.extApi.events
        .pipe(
          filter(event => event.kind === 'onResizeRow'),
          map( e => this.grid.columnApi.visibleColumns.reduce( (p, c) => p + c.sizeInfo.width, 0 ) ),
        );
    }
    return this._totalColumnWidthChange;
  }

  private grid: PblNgridComponent<T>;
  private store: PblColumnStore;
  private extApi: PblNgridExtensionApi;
  private _totalColumnWidthChange: Observable<number>;

  private constructor() { }

  /**
   * Returns the `PblColumn` at the specified index from the list of rendered columns (i.e. not hidden).
   */
  findColumnAt(renderColumnIndex: number): PblColumn | undefined {
    return this.store.visibleColumns[renderColumnIndex];
  }

  /**
   * Returns the column matching provided `id`.
   *
   * The search is performed on all known columns.
   */
  findColumn(id: string): PblColumn | undefined {
    const result = this.store.find(id);
    if (result) {
      return result.data;
    }
  }

  /**
  * Returns the render index of column or -1 if not found.
  *
  * The render index represents the current location of the column in the group of visible columns.
  */
  renderIndexOf(column: string | PblColumn): number {
    const c = typeof column === 'string' ? this.findColumn(column) : column;
    return this.store.visibleColumns.indexOf(c);
  }

  /**
   * Returns the index of a column or -1 if not found.
   */
  indexOf(column: string | PblColumn): number {
    const c = typeof column === 'string' ? this.findColumn(column) : column;
    return this.store.allColumns.indexOf(c);
  }

  isColumnHidden(column: PblColumn) {
    return this.store.isColumnHidden(column);
  }

  /**
   * Hide columns in the table
   */
  hideColumns(column: PblColumn | string,  ...columns: PblColumn[] | string[]): void {
    this.store.updateColumnVisibility([column, ...columns] as PblColumn[] | string[]);
  }

  /**
   * Change the visibility state of the provided columns to visible.
   * If no columns are provided all columns
   */
  showColumns(showAll: true): void;
  showColumns(column: PblColumn | string,  ...columns: PblColumn[] | string[]): void;
  showColumns(columnOrShowAll: PblColumn | string | true,  ...columns: PblColumn[] | string[]): void {
    if (columnOrShowAll === true) {
      this.store.clearColumnVisibility();
    } else {
      this.store.updateColumnVisibility(undefined, [columnOrShowAll, ...columns] as PblColumn[] | string[]);
    }
  }

  /**
   * Update the width of the column with the provided width.
   *
   * The width is set in px or % in the following format: ##% or ##px
   * Examples: '50%', '50px'
   *
   * Resizing the column will trigger a table width resizing event, updating column group if necessary.
   */
  resizeColumn(column: PblColumn, width: string): void {
    column.updateWidth(width);
    // this.grid.resetColumnsWidth();
    // this.grid.resizeColumns();
  }

  /**
   * Resize the column to best fit it's content.
   *
   * - Content: All of the cells rendered for this column (header, data and footer cells).
   * - Best fit: The width of the cell with the height width measured.
   *
   * The best fit found (width) is then used to call `resizeColumn()`.
   */
  autoSizeColumn(column: PblColumn): void {
    const size = this.findColumnAutoSize(column);
    this.resizeColumn(column, `${size}px`);
  }

  /**
   * For each visible column in the table, resize to best fit it's content.
   *
   * This method will simply run `autoSizeColumn()` on the visible columns in the table.
   */
  autoSizeColumns(): void;
  /**
   * For each column in the list of column provided, resize to best fit it's content.
   *
   * Make sure you are not resizing an hidden column.
   * This method will simply run `autoSizeColumn()` on the columns provided.
   */
  autoSizeColumns(...columns: PblColumn[]): void; // tslint:disable-line:unified-signatures
  autoSizeColumns(...columns: PblColumn[]): void {
    const cols = columns.length > 0 ? columns : this.visibleColumns;
    for (const column of cols) {
      const size = this.findColumnAutoSize(column);
      column.updateWidth(`${size}px`);
    }
    // this.grid.resetColumnsWidth();
    // this.grid.resizeColumns();
  }

  /**
   * For each visible column in the table, resize the width to a proportional width relative to the total width provided.
   */
  autoSizeToFit(totalWidth: number, options: AutoSizeToFitOptions = {}): void {
    const wLogic = this.extApi.dynamicColumnWidthFactory();
    const { visibleColumns } = this;
    const columnBehavior: AutoSizeToFitOptions['columnBehavior'] = options.columnBehavior || ( () => options ) as any;

    let overflowTotalWidth = 0;
    let totalMinWidth = 0;

    const withMinWidth: number[] = [];

    const widthBreakouts = visibleColumns.map( (column, index) => {
      const widthBreakout = wLogic.widthBreakout(column.sizeInfo);
      const instructions = { ...(columnBehavior(column) || {}), ...options };

      overflowTotalWidth += widthBreakout.content;
      totalWidth -= widthBreakout.nonContent;

      if (instructions.keepMinWidth && column.minWidth) {
        totalMinWidth += column.minWidth;
        withMinWidth.push(index);
      }

      return { ...widthBreakout, instructions };
    });

    const p = totalMinWidth / totalWidth;
    const level = (overflowTotalWidth * p  - totalMinWidth) / (1 - p);
    for (const i of withMinWidth) {
      const addition = level * (visibleColumns[i].minWidth / totalMinWidth)
      widthBreakouts[i].content += addition;
      overflowTotalWidth += addition;
    }

    for (let i = 0; i < visibleColumns.length; i++) {
      const widthBreakout = widthBreakouts[i];
      const instructions = widthBreakout.instructions;
      const column = visibleColumns[i];

      const r = widthBreakout.content / overflowTotalWidth;

      if (!instructions.keepMinWidth || !column.minWidth) {
        column.minWidth = undefined;
      }
      if (!instructions.keepMaxWidth || !column.maxWidth) {
        column.maxWidth = undefined;
        column.checkMaxWidthLock(column.sizeInfo.width); // if its locked, we need to release...
      }

      // There are 3 scenarios when updating the column
      // 1) if it's a fixed width or we're force into fixed width
      // 2) Not fixed width and width is set (%)
      // 3) Not fixed width an width is not set ( the width depends on the calculated `defaultWidth` done in `this.grid.resetColumnsWidth()` )
      let width: string;
      const { forceWidthType } = instructions;
      if (forceWidthType === 'px' || (!forceWidthType && column.isFixedWidth)) { // (1)
        width = `${totalWidth * r}px`;
      } else if (forceWidthType === '%' || (!forceWidthType && column.width)) { // (2)
        width = `${100 * r}%`;
      } // else (3) -> the update is skipped and it will run through resetColumnsWidth

      if (width) {
        column.updateWidth(width);
      }

    }
    // we now reset the column widths, this will calculate a new `defaultWidth` and set it in all columns but the relevant ones are column from (3)
    // It will also mark all columnDefs for check
    this.grid.resetColumnsWidth();
    this.grid.resizeColumns();
  }

  /**
   * Move the provided `column` to the position of the `anchor` column.
   * The new location of the anchor column will be it's original location plus or minus 1, depending on the delta between
   * the columns. If the origin of the `column` is before the `anchor` then the anchor's new position is minus one, otherwise plus 1.
   */
  moveColumn(column: PblColumn, anchor: PblColumn, skipRedraw?: boolean): boolean;
    /**
   * Move the provided `column` to the position of the column at `renderColumnIndex`.
   * `renderColumnIndex` must be a visible column (i.e. not hidden)
   */
  moveColumn(column: PblColumn, renderColumnIndex: number, skipRedraw?: boolean): boolean; // tslint:disable-line:unified-signatures
  moveColumn(column: PblColumn, anchor: PblColumn | number, skipRedraw?: boolean): boolean {
    if (isPblColumn(anchor)) {
      const result = column === anchor ? false : this.store.moveColumn(column, anchor);
      if (result && skipRedraw !== true) {
        this.afterColumnPositionChange();
      }
      return result;
    } else {
      const a = this.findColumnAt(anchor);
      return a ? this.moveColumn(column, a) : false;
    }
  }

  /**
   * Swap positions between 2 existing columns.
   */
  swapColumns(col1: PblColumn, col2: PblColumn, skipRedraw?: boolean): boolean {
    const result = this.store.swapColumns(col1, col2);
    if (result && skipRedraw !== true) {
      this.afterColumnPositionChange();
    }
    return result;
  }

  addGroupBy(...column: PblColumn[]): void { this.store.addGroupBy(...column); }
  removeGroupBy(...column: PblColumn[]): void { this.store.removeGroupBy(...column); }

  private findColumnAutoSize(column: PblColumn): number {
    const { columnDef } = column;
    const cells = columnDef.queryCellElements();
    let size = 0;
    for (const c of cells) {
      const element = (c.firstElementChild || c) as HTMLElement;
      if (element.scrollWidth > size) {
        size = element.scrollWidth + 1;
        // we add 1 pixel because `element.scrollWidth` does not support subpixel values, the width is converted to an integer removing subpixel values (fractions).
      }
    }
    return size;
  }

  private afterColumnPositionChange(): void {
    this.extApi.contextApi.clear(true);
    this.store.updateGroups();
    this.grid.resetColumnsWidth();
    this.grid.resizeColumns();
  }
}
