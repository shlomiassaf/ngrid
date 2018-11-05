import { NegColumn } from '../columns';

/**
 * A column width object representing the relative column using a combination of percentage and pixels.
 *
 * The percentage represent the total width of the column
 * The pixels represent the total fixed width, in pixels, that other columns occupy (these are columns with absolute width set).
 *
 * In a DOM element, the `ColumnWidth` object is represented via the `width` style property
 * and the value is set using the `calc()` CSS function: `width: calc({pct}% - {px}px);`.
 *
 * For example, the `ColumnWidth` object  `{ pct: 33, px: 25 }` is translated to `width: calc(33% - 25px);`
 *
 * @internal
 */
export interface ColumnWidth {
  pct: number;
  px: number;
}

/**
 * A column width calculator that, based on all of the columns, calculates the default column width
 * and minimum required row width.
 *
 * The default column width is the width for all columns that does not have a width setting defined.
 * In addition, a `minimumRowWidth` is calculated, which represents the minimum width required width of the row, i.e. table.
 *
 * The `StaticColumnWidthLogic` does not take into account real-time DOM measurements (especially box-model metadata), hence "static".
 * It performs the calculation based on "dry" `NegColumn` metadata input from the user.
 *
 * The `StaticColumnWidthLogic` is less accurate and best used as a measurement baseline followed by a more accurate calculation.
 * This is why it outputs a default column width and not a column specific width.
 */
export class StaticColumnWidthLogic {
  private _agg = {
    pct: 0,          // total agg fixed %
    px: 0,           // total agg fixed px
    minRowWidth: 0,  // total agg of min width
    pctCount: 0,     // total columns with fixed %
    pxCount: 0,      // total columns with fixed px
    count: 0         // total columns without a fixed value
  }

  get minimumRowWidth(): number { return this._agg.minRowWidth; }

  /**
   * Returns the calculated default width for a column.
   * This is the width for columns that does not have a specific width, adjusting them to fit the table.
   * It's important to run this method AFTER aggregating all columns through `addColumn()`.
   * The result contains 2 values, pct and px.
   * pct is the total width in percent that the column should spread taking into account columns with fixed % width.
   * px is the total width in pixels that the column should shrink taking into account columns with fixed pixel width.
   *
   * The algorithm is simple:
   *  1) Sum all columns with fixed percent width
   *  2) From the entire row width (100%) deduct the total fixed width (step 1).
   *     This result represents the % left for all columns without a fixed width (percent and pixel).
   *  3) Sum all columns with fixed pixel width.
   *     The result represent the total amount of width in pixel taken by columns with fixed width.
   *  4) Count all the columns without a fixed width.
   *
   *  For 2 & 3 we get values that we need to spread even between all of the columns without fixed width (percent and pixel).
   *  The exact width is the total percent left (2) minus the total width in pixel taken by columns with fixed with.
   *  We now need to divide the result from 2 & 3 by the result from 4.
   *
   * Both values should be used together on the `width` style property using the `calc` function:
   * e.g.: `calc(${pct}% - ${px}px)`
   *
   * This value is calculated every time it is called, use it once all columns are added.
   */
  get defaultColumnWidth(): ColumnWidth {
    const agg = this._agg;
    const pct = (100 - agg.pct) / agg.count;
    const px = agg.px / agg.count;
    return { pct, px };
  }

  addColumn(column: NegColumn): void {
    const agg = this._agg;
    const width = column.parsedWidth;

    let minWidth = column.minWidth || 0;

    if (width) {
      switch (width.type) {
        case '%':
          agg.pctCount += 1;
          agg.pct += width.value;
          break;
        case 'px':
          agg.pxCount += 1;
          agg.px += width.value;
          minWidth = width.value;
          break;
        default:
          throw new Error(`Invalid width "${column.width}" in column ${column.prop}. Valid values are ##% or ##px (50% / 50px)`);
      }
    } else if (column.maxWidthLock) {
      agg.pxCount += 1;
      agg.px += column.maxWidth;
    } else {
      agg.count += 1;
    }
    agg.minRowWidth += minWidth;
  }

}
