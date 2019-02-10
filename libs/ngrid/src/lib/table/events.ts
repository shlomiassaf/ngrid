import { PblColumn } from './columns/column';

export interface PblNgridCellClickEvent<T = any> {
  source: MouseEvent;
  column: PblColumn;
  row: T;
}
