import { PblColumnSizeInfo } from './types';
import { PblColumn } from './column';

export class ColumnSizeInfo implements PblColumnSizeInfo {
  get column(): PblColumn { return this._column; }
  set column(value: PblColumn) { this.attachColumn(value); }

  /**
   * The height of the column (subpixel resolution)
   */
  height: number;
  /**
   * The width of the column (subpixel resolution)
   * Note that this is the not the content width.
   */
  width: number;

  /**
   * The computed style for this cell.
   */
  style: CSSStyleDeclaration;

  protected _column: PblColumn;

  constructor(public readonly target: HTMLElement) { }

  attachColumn(column: PblColumn): void {
    this.detachColumn();

    if (column) {
      column.sizeInfo = this;
    }

    this._column = column;
  }

  detachColumn(): void {
    if (this._column) {
      this._column.sizeInfo = undefined;
      this._column = undefined;
    }
  }

  updateSize(): void {
    if (this.column && !this.column.columnDef.isDragging) {
      const el = this.target;
      const rect = el.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
      this.style = getComputedStyle(el);
      this.column.columnDef.onResize();
    }
  }
}
