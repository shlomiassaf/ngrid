import { NegColumn, NegMetaColumn, NegColumnGroup, NegTableCellContext, NegTableRowContext } from '@neg/table';

export type ROW_TYPE = 'header' | 'data' | 'footer';
export interface ROW_META_TYPE {
  data: NegColumn;
  meta: NegMetaColumn;
  'meta-group': NegColumnGroup;
}

export interface NegTableMatrixRow<RType extends ROW_TYPE, RMetaType extends keyof ROW_META_TYPE = 'data'> {
  type: RType;
  subType: RMetaType;
  rowIndex: number;
}

export interface NegTableMatrixPoint<RType extends ROW_TYPE, RMetaType extends keyof ROW_META_TYPE = 'data'> extends NegTableMatrixRow<RType, RMetaType> {
  colIndex: number;
}

export interface NegTableDataMatrixRow<T = any> extends NegTableMatrixRow<'data'> {
  row: T;
  context: NegTableRowContext<T>;
}

export interface NegTableColumnMatrixPoint<RType extends ROW_TYPE, RMetaType extends keyof ROW_META_TYPE = 'data'> extends NegTableMatrixPoint<RType, RMetaType> {
  column: ROW_META_TYPE[RMetaType];
}

export interface NegTableDataMatrixPoint<T = any> extends NegTableColumnMatrixPoint<'data'> {
  row: T;
  context: NegTableCellContext;
}

export type NegTableCellEvent<T = any> = { source: MouseEvent; cellTarget: HTMLElement; rowTarget: HTMLElement; }
  & (NegTableDataMatrixPoint<T> | NegTableColumnMatrixPoint<'header' | 'footer'> | NegTableColumnMatrixPoint<'header' | 'footer', 'meta'>  | NegTableColumnMatrixPoint<'header' | 'footer', 'meta-group'>);

export type NegTableRowEvent<T = any> = { source: MouseEvent; rowTarget: HTMLElement; root?: NegTableCellEvent<T>; }
  & (NegTableDataMatrixRow<T> | NegTableMatrixRow<'header' | 'footer'> | NegTableMatrixRow<'header' | 'footer', 'meta'>  | NegTableMatrixRow<'header' | 'footer', 'meta-group'>);

