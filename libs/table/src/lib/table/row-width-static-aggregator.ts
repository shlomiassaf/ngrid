import { SgColumnGroup, SgColumn } from './columns';

export interface ColumnWidth {
  pct: number;
  px: number;
}

/**
 * Calculate row width based on static column definition.
 * It is static because it does not take into account realtime DOM measurments.
 *
 * Realtime DOM measurments are more accurate as they take into account the style.
 * For example, margin, padding, etc...
 */
export class RowWidthStaticAggregator {
  private _agg = {
    pct: 0,          // total agg fixed %
    px: 0,           // total agg fixed px
    minWidth: 0,      // total agg of min width
    pctCount: 0,     // total columns with fixed %
    pxCount: 0,      // total columns with fixed px
    count: 0         // total columns without a fixed value
  }

  get totalMinWidth(): number { return this._agg.minWidth; }

  aggColumn(column: SgColumn): void {
    const agg = this._agg;
    const width = column.parsedWidth;

    if (width) {
      switch (width.type) {
        case '%':
          agg.pctCount += 1;
          agg.pct += width.value;
          break;
        case 'px':
          agg.pxCount += 1;
          agg.px += width.value;
          column.minWidth = width.value;
          break;
        default:
          throw new Error(`Invalid width "${column.width}" in column ${column.prop}. Valid values are ##% or ##px (50% / 50px)`);
      }
    } else {
      agg.count += 1;
    }
    agg.minWidth += column.minWidth || 0;
  }

  /**
   * Returns the calculated default width for a column.
   * This is the width for columns that does not have a specific width, adjusting them to fit the table.
   * It's important to run this method AFTER aggregating all columns through `aggColumn()`.
   * The result contains 2 values, pct and px.
   * pct is the total width in percent that the column should spread taking into account columns with fixed % width.
   * px is the total width in pixels that the column should shrink taking into account columns with fixed pixel width.
   *
   * The algorithem is simple:
   *  1) Sum all columns with fixed percent width
   *  2) From the entire row width (100%) deduct the total fixed width (step 1).
   *     This result represents the % left for all columns without a fixed width (percent and pixel).
   *  3) Sum all columns with fixed pixel width.
   *     The result represent the total amount of width in pixel taken by columns with fixed width.
   *  4) Count all the columns without a fixed width.
   *
   *  For 2 & 3 we get values that we need to spread even between all of the columns without fixed width (percent and pixel).
   *  The exact width is the total percent left (2) minus the total width in pixel taken by columns with fixed with.
   *  We now need to devide the result from 2 & 3 by the result from 4.
   *
   * Both values should be used together on the `width` style property using the `calc` function:
   * e.g.: `calc(${pct}% - ${px}px)`
   */
  calculateDefault(): ColumnWidth {
    const agg = this._agg;
    const pct = (100 - agg.pct) / agg.count;
    const px = agg.px / agg.count;
    return { pct, px };
  }

  calculateGroup(g: SgColumnGroup): ColumnWidth {
    const agg = this._agg;
    const onePiece = 100 / agg.count
    let pct = 0;
    let px = 0;
    for ( const c of g.columns ) {
      const width = c.parsedWidth;
      if ( width ) {
        switch (width.type) {
          case '%':
            pct += width.value;
            break;
          case 'px':
            px += width.value;
            break;
        }
      } else {
        px -= agg.px / agg.count;
        pct += onePiece;
      }
    };
    return { pct, px };
  }
}
