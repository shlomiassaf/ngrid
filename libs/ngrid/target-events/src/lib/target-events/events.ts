import { PblColumn, PblMetaColumn, PblColumnGroup, PblNgridCellContext, PblNgridRowContext } from '@pebula/ngrid';

export type ROW_TYPE = 'header' | 'data' | 'footer';
export interface ROW_META_TYPE {
  data: PblColumn;
  meta: PblMetaColumn;
  'meta-group': PblColumnGroup;
}

export interface PblNgridMatrixRow<RType extends ROW_TYPE, RMetaType extends keyof ROW_META_TYPE = 'data'> {
  type: RType;
  subType: RMetaType;
  rowIndex: number;
}

export interface PblNgridMatrixPoint<RType extends ROW_TYPE, RMetaType extends keyof ROW_META_TYPE = 'data'> extends PblNgridMatrixRow<RType, RMetaType> {
  /** The RENDER column index */
  colIndex: number;
}

export interface PblNgridDataMatrixRow<T = any> extends PblNgridMatrixRow<'data'> {
  row: T;
  context: PblNgridRowContext<T>;
}

export interface PblNgridColumnMatrixPoint<RType extends ROW_TYPE, RMetaType extends keyof ROW_META_TYPE = 'data'> extends PblNgridMatrixPoint<RType, RMetaType> {
  column: ROW_META_TYPE[RMetaType];
}

export interface PblNgridDataMatrixPoint<T = any> extends PblNgridColumnMatrixPoint<'data'> {
  row: T;
  context: PblNgridCellContext;
}

export type PblNgridBaseCellEvent<TEvent extends Event = MouseEvent | KeyboardEvent> = {
  source: TEvent;
  cellTarget: HTMLElement;
  rowTarget: HTMLElement;
};
export type PblNgridDataCellEvent<T = any, TEvent extends Event = MouseEvent | KeyboardEvent> = PblNgridBaseCellEvent<TEvent> & PblNgridDataMatrixPoint<T>;
export type PblNgridMetaCellEvent<TEvent extends Event = MouseEvent | KeyboardEvent> = PblNgridBaseCellEvent<TEvent> & (PblNgridColumnMatrixPoint<'header' | 'footer'> | PblNgridColumnMatrixPoint<'header' | 'footer', 'meta'>  | PblNgridColumnMatrixPoint<'header' | 'footer', 'meta-group'>);
export type PblNgridCellEvent<T = any, TEvent extends Event = MouseEvent | KeyboardEvent> = PblNgridBaseCellEvent<TEvent> & (PblNgridDataCellEvent<T, TEvent> | PblNgridMetaCellEvent<TEvent>);

// TODO: Refactor the row event to be like cell events (meta, data);
export type PblNgridRowEvent<T = any> = { source: MouseEvent | KeyboardEvent; rowTarget: HTMLElement; root?: PblNgridCellEvent<T>; }
  & (PblNgridDataMatrixRow<T> | PblNgridMatrixRow<'header' | 'footer'> | PblNgridMatrixRow<'header' | 'footer', 'meta'>  | PblNgridMatrixRow<'header' | 'footer', 'meta-group'>);

