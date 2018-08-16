import { SgColumnSizeInfo } from './types';

export interface IndentStrategy {
  cell(col: SgColumnSizeInfo): number;
  groupCell(col: SgColumnSizeInfo): number;
  group(cols: SgColumnSizeInfo[]): number;
}

export class RowWidthDynamicAggregator {
  get totalMinWidth(): number { return this._totalMinWidth; };
  private readonly cols = new Map<SgColumnSizeInfo, number>();
  private _totalMinWidth = 0;

  constructor(private strategy: IndentStrategy) { }

  aggColumn(columnInfo: SgColumnSizeInfo): number {
    if (this.cols.has(columnInfo)) {
      return this.cols.get(columnInfo);
    } else {
      let width = 0;
      const style = columnInfo.style;
      if (columnInfo.column.minWidth) {
        width += columnInfo.column.minWidth;
      }
      width += this.strategy.cell(columnInfo);
      this.cols.set(columnInfo, width);
      this._totalMinWidth += width;
      return width;
    }
  }

  aggColumns(columnInfos: SgColumnSizeInfo[]): number {
    let sum = 0;
    for (const c of columnInfos) {
      this.aggColumn(c);
      sum += c.width + this.strategy.groupCell(c);
    }
    return sum - this.strategy.group(columnInfos);
  }

}

export const MARGIN_END_STRATEGY = {
  cell(col: SgColumnSizeInfo): number {
    const style = col.style;
    return parseInt(style.marginLeft) + parseInt(style.marginRight)
  },
  groupCell(col: SgColumnSizeInfo): number {
    return this.cell(col);
  },
  group(cols: SgColumnSizeInfo[]): number {
    const len = cols.length;
    return len > 0 ? parseInt(cols[0].style.marginLeft) + parseInt(cols[len - 1].style.marginRight) : 0;
  }
};

export const PADDING_END_STRATEGY = {
  cell(col: SgColumnSizeInfo): number {
    const style = col.style;
    return parseInt(style.paddingLeft) + parseInt(style.paddingRight)
  },
  groupCell(col: SgColumnSizeInfo): number {
    return 0;
  },
  group(cols: SgColumnSizeInfo[]): number {
    const len = cols.length;
    return len > 0 ? parseInt(cols[0].style.paddingLeft) + parseInt(cols[len - 1].style.paddingRight) : 0;
  }
};
