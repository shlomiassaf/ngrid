import { NegTableExtensionApi } from '../ext/table-ext-api';
import { NegTableComponent } from './table.component';
import { NegColumn } from './columns/column';
import { NegColumnStore } from './columns/column-store';

export interface AutoSizeToFitOptions {
  /**
   * When true will not take into account box model gaps (padding/margin) when calculating the widths.
   *
   * Enabling might yield unexpected results.
   */
  ignoreBoxModel?: boolean;

  /**
   * When `px` will force all columns width to be in fixed pixels
   * When `%` will force all column width to be in %
   * otherwise (default) the width will be set in the same format it was originally set.
   * e.g.: If width was `33%` the new width will also be in %, or if width not set the new width will not be set as well.
   *
   * Does not apply when columnBehavior is set and returns a value.
   */
  forceWidthType?: '%' | 'px';

  /**
   * When true will keep the `minWidth` column definition (when set), otherwise will clear it.
   * Does not apply when columnBehavior is set and returns a value.
   */
  keepMinWidth?: boolean;

  /**
   * When true will keep the `maxWidth` column definition (when set), otherwise will clear it.
   * Does not apply when columnBehavior is set and returns a value.
   */
  keepMaxWidth?: boolean

  /**
   * A function for per-column fine tuning of the process.
   * The function receives the `NegColumn`, its relative width (in %, 0 to 1) and total width (in pixels) and should return
   * an object describing how it should auto fit.
   *
   * When the function returns undefined the options are taken from the root.
   */
  columnBehavior?(column: NegColumn): Pick<AutoSizeToFitOptions, 'forceWidthType' | 'keepMinWidth' | 'keepMaxWidth'> | undefined;
}

export class ColumnApi<T> {

  get groupByColumns(): NegColumn[] { return this.store.groupBy; }
  get visibleColumnIds(): string[] { return this.store.columnIds; }
  get visibleColumns(): NegColumn[] { return this.store.columns; }
  get columns(): NegColumn[] { return this.store.allColumns; }

  constructor(private table: NegTableComponent<T>, private store: NegColumnStore, private extApi: NegTableExtensionApi) { }

  /**
   * Returns the `NegColumn` at the specified index from the list of rendered columns (i.e. not hidden).
   */
  findColumnAt(renderColumnIndex: number): NegColumn | undefined {
    return this.store.columns[renderColumnIndex];
  }

  /**
   * Returns the column matching provided `id`.
   *
   * The search is performed on all known columns.
   */
  findColumn(id: string): NegColumn | undefined {
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
  renderIndexOf(column: NegColumn): number {
    return this.store.columns.indexOf(column);
  }

  /**
   * Update the width of the column with the provided width.
   *
   * The width is set in px or % in the following format: ##% or ##px
   * Examples: '50%', '50px'
   *
   * Resizing the column will trigger a table width resizing event, updating column group if necessary.
   */
  resizeColumn(column: NegColumn, width: string): void {
    column.updateWidth(true, width)
    this.table.resetColumnsWidth();
    this.table.resizeColumns();
  }

  /**
   * Resize the column to best fit it's content.
   *
   * - Content: All of the cells rendered for this column (header, data and footer cells).
   * - Best fit: The width of the cell with the height width measured.
   *
   * The best fit found (width) is then used to call `resizeColumn()`.
   */
  autoSizeColumn(column: NegColumn): void {
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
  autoSizeColumns(...columns: NegColumn[]): void; // tslint:disable-line:unified-signatures
  autoSizeColumns(...columns: NegColumn[]): void {
    const cols = columns.length > 0 ? columns : this.visibleColumns;
    for (const column of cols) {
      const size = this.findColumnAutoSize(column);
      column.updateWidth(true, `${size}px`)
    }
    this.table.resetColumnsWidth();
    this.table.resizeColumns();
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
      const instructions = columnBehavior(column) || options;

      overflowTotalWidth += widthBreakout.content;

      if (!options.ignoreBoxModel) {
        totalWidth -= widthBreakout.nonContent;
      }

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

    let sum =[];
    for (let i = 0; i < visibleColumns.length; i++) {
      const widthBreakout = widthBreakouts[i];
      const instructions = widthBreakout.instructions;
      const column = visibleColumns[i];

      const r = widthBreakout.content / overflowTotalWidth;

      if (!instructions.keepMinWidth) {
        column.minWidth = undefined;
      }
      if (!instructions.keepMaxWidth) {
         column.maxWidth = undefined;
         column.checkMaxWidthLock(column.sizeInfo.width); // if its locked, we need to release...
      }

      // There are 3 scenarios when updating the column
      // 1) if it's a fixed width or we're force into fixed width
      // 2) Not fixed width and width is set (%)
      // 3) Not fixed width an width is not set ( the width depends on the calculated `defaultWidth` done in `this.table.resetColumnsWidth()` )
      let width: string;
      const { forceWidthType } = instructions;
      if (forceWidthType === 'px' || (!forceWidthType && column.isFixedWidth)) { // (1)
        width = `${totalWidth * r}px`;
      } else if (forceWidthType === '%' || (!forceWidthType && column.width)) { // (2)
        width = `${100 * r}%`;
      } // else (3) -> the update is skipped and it will run through resetColumnsWidth

      if (width) {
        // We're not updating the width width markForCheck set to true because it will be done right after in `this.table.resetColumnsWidth()`
        column.updateWidth(false, width);
      }

    }
    // we now reset the column widths, this will calculate a new `defaultWidth` and set it in all columns but the relevant ones are column from (3)
    // It will also mark all columnDef's for check
    this.table.resetColumnsWidth({ tableMarkForCheck: true });
    this.table.resizeColumns();
  }

  /**
   * Move the provided `column` to the position of the `anchor` column.
   * The new location of the anchor column will be it's original location plus or minus 1, depending on the delta between
   * the columns. If the origin of the `column` is before the `anchor` then the anchor's new position is minus one, otherwise plus 1.
   */
  moveColumn(column: NegColumn, anchor: NegColumn): boolean;
    /**
   * Move the provided `column` to the position of the column at `renderColumnIndex`.
   * `renderColumnIndex` must be a visible column (i.e. not hidden)
   */
  moveColumn(column: NegColumn, renderColumnIndex: number): boolean; // tslint:disable-line:unified-signatures
  moveColumn(column: NegColumn, anchor: NegColumn | number): boolean {
    if (anchor instanceof NegColumn) {
      const result = this.store.moveColumn(column, anchor);
      if (result) {
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
  swapColumns(col1: NegColumn, col2: NegColumn): boolean {
    const result = this.store.swapColumns(col1, col2);
    if (result) {
      this.afterColumnPositionChange();
    }
    return result;
  }

  addGroupBy(...column: NegColumn[]): void { this.store.addGroupBy(...column); }
  removeGroupBy(...column: NegColumn[]): void { this.store.removeGroupBy(...column); }

  private findColumnAutoSize(column: NegColumn): number {
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
    this.extApi.contextApi.clear();
    this.store.updateGroups();
    this.table.resetColumnsWidth();
    this.table.resizeColumns();
  }
}
