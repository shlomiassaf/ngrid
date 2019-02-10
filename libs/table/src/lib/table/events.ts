import { PblColumn } from './columns/column';

export interface PblTableCellClickEvent<T = any> {
  source: MouseEvent;
  column: PblColumn;
  row: T;
}
