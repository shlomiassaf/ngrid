import { PblColumnSizeInfo } from '../types';

export interface BoxModelSpaceStrategy {
  cell(col: PblColumnSizeInfo): number;
  groupCell(col: PblColumnSizeInfo): number;
  group(cols: PblColumnSizeInfo[]): number;
}

/**
 * A column width calculator that calculates column width for a specific column or a group of columns.
 * It also provide the minimum required row width for the total columns added up to that point.
 *
 * The `DynamicColumnWidthLogic` takes into account real-time DOM measurements (especially box-model metadata), hence "dynamic".
 * It performs the calculation based on `PblColumn` and actual DOM size metadata.
 *
 * The `DynamicColumnWidthLogic` has 3 responsibilities:
 *
 * - It is responsible for enforcing the `maxWidth` boundary constraint for every column it processes by calculating the actual width
 * of a column and calling `PblColumn.checkMaxWidthLock` to verify if max width lock has changed due to the new actual width.
 *
 * - It calculates the absolute width for a group of columns, so `PblCdkVirtualScrollViewportComponentGroupColumn` can have an exact size that wraps it's children.
 *
 * - It calculates the `minimumRowWidth`, which represents the minimum width required width of the row, i.e. table.
 *
 * > Note that an instance of `DynamicColumnWidthLogic` represents a one-time pass for all columns, for every run a new instance is required.
 */
export class DynamicColumnWidthLogic {
  /**
   * When true, it indicates that one (or more) columns has changed the max width lock state.
   * @readonly
   */
  maxWidthLockChanged: boolean;

  get minimumRowWidth(): number { return this._minimumRowWidth; };

  private readonly cols = new Map<PblColumnSizeInfo, number>();
  private _minimumRowWidth = 0;

  constructor(private strategy: BoxModelSpaceStrategy) { }

  /**
   * Returns a breakout of the width of the column, breaking it into the width of the content and the rest of the width
   */
  widthBreakout(columnInfo: PblColumnSizeInfo): { content: number, nonContent: number } {
    const nonContent = this.strategy.cell(columnInfo);
    return {
      content: columnInfo.width - nonContent,
      nonContent,
    };
  }

  /**
   * Add a column to the calculation.
   *
   * The operation will update the minimum required width and trigger a `checkMaxWidthLock` on the column.
   * If the max width lock has changed the `maxWidthLockChanged` is set to true.
   *
   * A column that was previously added is ignored.
   *
   * Note that once `maxWidthLockChanged` is set to true it will never change.
   */
  addColumn(columnInfo: PblColumnSizeInfo): void {
    if (!this.cols.has(columnInfo)) {
      const { column } = columnInfo;
      let minWidth = column.minWidth || 0;
      if (column.isFixedWidth) {
        minWidth = Math.max(column.parsedWidth.value, minWidth);
      }
      const nonContent = this.strategy.cell(columnInfo);
      const width = minWidth + nonContent;
      this.cols.set(columnInfo, width);
      this._minimumRowWidth += width;

      if (column.maxWidth) {
        const actualWidth = columnInfo.width - nonContent;
        if (column.checkMaxWidthLock(actualWidth)) {
          this.maxWidthLockChanged = true;
        }
      }
    }
  }

  /**
   * Run each of the columns through `addColumn` and returns the sum of the width all columns using
   * the box model space strategy.
   *
   * The result represents the absolute width to be used in a `PblColumnGroup`.
   *
   * > Note that when a table has multiple column-group rows each column is the child of multiple group column, hence calling `addColumn` with the
   * same group more then once. However, since `addColumn()` ignores columns it already processed it is safe.
   */
  addGroup(columnInfos: PblColumnSizeInfo[]): number {
    let sum = 0;
    for (const c of columnInfos) {
      this.addColumn(c);
      sum += c.width;
    }
   sum -= this.strategy.group(columnInfos);
   return sum;
  }

}

export const DYNAMIC_PADDING_BOX_MODEL_SPACE_STRATEGY: BoxModelSpaceStrategy = {
  cell(col: PblColumnSizeInfo): number {
    const style = col.style;
    return style ? parseInt(style.paddingLeft) + parseInt(style.paddingRight) : 0
  },
  groupCell(col: PblColumnSizeInfo): number {
    return 0;
  },
  group(cols: PblColumnSizeInfo[]): number {
    const len = cols.length;
    return len > 0 && cols[0].style && cols[len - 1].style ? parseInt(cols[0].style.paddingLeft) + parseInt(cols[len - 1].style.paddingRight) : 0;
  }
};
