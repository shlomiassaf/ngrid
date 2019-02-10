import { PblColumn, PblMetaColumn, PblColumnGroup, PblTableCellContext, PblTableRowContext } from '@pebula/table';

export type ROW_TYPE = 'header' | 'data' | 'footer';
export interface ROW_META_TYPE {
  data: PblColumn;
  meta: PblMetaColumn;
  'meta-group': PblColumnGroup;
}

export interface PblTableMatrixRow<RType extends ROW_TYPE, RMetaType extends keyof ROW_META_TYPE = 'data'> {
  type: RType;
  subType: RMetaType;
  rowIndex: number;
}

export interface PblTableMatrixPoint<RType extends ROW_TYPE, RMetaType extends keyof ROW_META_TYPE = 'data'> extends PblTableMatrixRow<RType, RMetaType> {
  colIndex: number;
}

export interface PblTableDataMatrixRow<T = any> extends PblTableMatrixRow<'data'> {
  row: T;
  context: PblTableRowContext<T>;
}

export interface PblTableColumnMatrixPoint<RType extends ROW_TYPE, RMetaType extends keyof ROW_META_TYPE = 'data'> extends PblTableMatrixPoint<RType, RMetaType> {
  column: ROW_META_TYPE[RMetaType];
}

export interface PblTableDataMatrixPoint<T = any> extends PblTableColumnMatrixPoint<'data'> {
  row: T;
  context: PblTableCellContext;
}

export type PblTableCellEvent<T = any> = { source: MouseEvent; cellTarget: HTMLElement; rowTarget: HTMLElement; }
  & (PblTableDataMatrixPoint<T> | PblTableColumnMatrixPoint<'header' | 'footer'> | PblTableColumnMatrixPoint<'header' | 'footer', 'meta'>  | PblTableColumnMatrixPoint<'header' | 'footer', 'meta-group'>);

export type PblTableRowEvent<T = any> = { source: MouseEvent; rowTarget: HTMLElement; root?: PblTableCellEvent<T>; }
  & (PblTableDataMatrixRow<T> | PblTableMatrixRow<'header' | 'footer'> | PblTableMatrixRow<'header' | 'footer', 'meta'>  | PblTableMatrixRow<'header' | 'footer', 'meta-group'>);

