import { SgColumn, SgMetaColumn, SgColumnGroup } from '@sac/table';

export type ROW_TYPE = 'header' | 'data' | 'footer';
export interface ROW_META_TYPE {
  data: SgColumn;
  meta: SgMetaColumn;
  'meta-group': SgColumnGroup;
}

export interface SgTableMatrixRow<RType extends ROW_TYPE, RMetaType extends keyof ROW_META_TYPE = 'data'> {
  type: RType;
  subType: RMetaType;
  rowIndex: number;
}

export interface SgTableMatrixPoint<RType extends ROW_TYPE, RMetaType extends keyof ROW_META_TYPE = 'data'> extends SgTableMatrixRow<RType, RMetaType> {
  colIndex: number;
}

export interface SgTableDataMatrixRow<T = any> extends SgTableMatrixRow<'data'> {
  row: T;
}

export interface SgTableColumnMatrixPoint<RType extends ROW_TYPE, RMetaType extends keyof ROW_META_TYPE = 'data'> extends SgTableMatrixPoint<RType, RMetaType> {
  column: ROW_META_TYPE[RMetaType];
}

export interface SgTableDataMatrixPoint<T = any> extends SgTableColumnMatrixPoint<'data'> {
  row: T;
}

export type SgTableCellEvent<T = any> = { source: MouseEvent; cellTarget: HTMLElement; rowTarget: HTMLElement; }
  & (SgTableDataMatrixPoint<T> | SgTableColumnMatrixPoint<'header' | 'footer'> | SgTableColumnMatrixPoint<'header' | 'footer', 'meta'>  | SgTableColumnMatrixPoint<'header' | 'footer', 'meta-group'>);

export type SgTableRowEvent<T = any> = { source: MouseEvent; rowTarget: HTMLElement; root?: SgTableCellEvent<T>; }
  & (SgTableDataMatrixRow<T> | SgTableMatrixRow<'header' | 'footer'> | SgTableMatrixRow<'header' | 'footer', 'meta'>  | SgTableMatrixRow<'header' | 'footer', 'meta-group'>);

