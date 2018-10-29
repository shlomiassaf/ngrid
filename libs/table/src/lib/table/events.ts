import { NegColumn } from './columns/column';

export interface NegTableCellClickEvent<T = any> {
  source: MouseEvent;
  column: NegColumn;
  row: T;
}
