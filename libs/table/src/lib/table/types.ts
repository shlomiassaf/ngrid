import { NegColumn } from './columns/column';

export interface NegColumnSizeInfo {
  column: NegColumn;
  height: number;
  width: number;
  style: CSSStyleDeclaration;
}

export interface NegTableHeaderCellSortContainer {
  column: NegColumn;
}
