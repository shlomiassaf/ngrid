import { SgColumn } from './columns/column';

export interface SgColumnSizeInfo {
  column: SgColumn;
  height: number;
  width: number;
  style: CSSStyleDeclaration;
}

export interface SgTableHeaderCellSortContainer {
  column: SgColumn;
}
