import { SgColumn } from './columns/column';

export interface SgDetailsRowToggleEvent<T = any> {
  row: T;
  expended: boolean;
  toggle(): void;
}

export interface SgColumnSizeInfo {
  column: SgColumn;
  height: number;
  width: number;
  style: CSSStyleDeclaration;
}

export interface SgTableHeaderCellSortContainer {
  column: SgColumn;
}
