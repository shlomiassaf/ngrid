import { NegColumnSizeInfo } from '../types';

export interface BoxModelSpaceStrategy {
  cell(col: NegColumnSizeInfo): number;
  groupCell(col: NegColumnSizeInfo): number;
  group(cols: NegColumnSizeInfo[]): number;
}

/**
 * A column width calculator that calculates column width for a specific column or a group of columns.
 * It also provide the minimum required row width for the total columns added up to that point.
 *
 * The `DynamicColumnWidthLogic` takes into account real-time DOM measurements (especially box-model metadata), hence "dynamic".
 * It performs the calculation based on `NegColumn` and actual DOM size metadata.
 *
 * The `DynamicColumnWidthLogic` has 3 responsibilities:
 *
 * - It is responsible for enforcing the `maxWidth` boundary constraint for every column it processes by calculating the actual width
 * of a column and calling `NegColumn.checkMaxWidthLock` to verify if max width lock has changed due to the new actual width.
 *
 * - It calculates the absolute width for a group of columns, so `NegCdkVirtualScrollViewportComponentGroupColumn` can have an exact size that wraps it's children.
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

  private readonly cols = new Map<NegColumnSizeInfo, number>();
  private _minimumRowWidth = 0;

  constructor(private strategy: BoxModelSpaceStrategy) { }

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
  addColumn(columnInfo: NegColumnSizeInfo): void {
    if (!this.cols.has(columnInfo)) {
      const { column } = columnInfo;
      const width = (column.minWidth || 0) + this.strategy.cell(columnInfo);
      this.cols.set(columnInfo, width);
      this._minimumRowWidth += width;

      if (column.maxWidth) {
        const actualWidth = columnInfo.width - (width - (column.minWidth || 0));
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
   * The result represents the absolute width to be used in a `NegColumnGroup`.
   *
   * > Note that when a table has multiple column-group rows each column is the child of multiple group column, hence calling `addColumn` with the
   * same group more then once. However, since `addColumn()` ignores columns it already processed it is safe.
   */
  addGroup(columnInfos: NegColumnSizeInfo[]): number {
    let sum = 0;
    for (const c of columnInfos) {
      this.addColumn(c);
      sum += c.width + this.strategy.groupCell(c);
    }
    return sum - this.strategy.group(columnInfos);
  }

}

export const DYNAMIC_MARGIN_BOX_MODEL_SPACE_STRATEGY: BoxModelSpaceStrategy = {
  cell(col: NegColumnSizeInfo): number {
    const style = col.style;
    return parseInt(style.marginLeft) + parseInt(style.marginRight)
  },
  groupCell(col: NegColumnSizeInfo): number {
    return this.cell(col);
  },
  group(cols: NegColumnSizeInfo[]): number {
    const len = cols.length;
    return len > 0 ? parseInt(cols[0].style.marginLeft) + parseInt(cols[len - 1].style.marginRight) : 0;
  }
};

export const DYNAMIC_PADDING_BOX_MODEL_SPACE_STRATEGY: BoxModelSpaceStrategy = {
  cell(col: NegColumnSizeInfo): number {
    const style = col.style;
    return parseInt(style.paddingLeft) + parseInt(style.paddingRight)
  },
  groupCell(col: NegColumnSizeInfo): number {
    return 0;
  },
  group(cols: NegColumnSizeInfo[]): number {
    const len = cols.length;
    return len > 0 ? parseInt(cols[0].style.paddingLeft) + parseInt(cols[len - 1].style.paddingRight) : 0;
  }
};
