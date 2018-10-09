import { SgColumn } from './columns/column';

export interface SgTableCellClickEvent<T = any> {
  source: MouseEvent;
  column: SgColumn;
  row: T;
}
