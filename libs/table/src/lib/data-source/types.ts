import { SgColumn } from '../table/columns';

export type SgTableSortOrder = 'asc' | 'desc';

export interface SgTableSortInstructions {
  order?: SgTableSortOrder;
}

/**
 * Event fired when sort changes.
 */
export interface SgTableSortDefinition extends SgTableSortInstructions {
  sortFn?: SgTableSorter;
}

/**
 * A function that can sort a dataset based on `SgTableSortInstructions`
 */
export interface SgTableSorter<T = any> {
  (column: SgColumn, sort: SgTableSortInstructions, data: T[]): T[];
}

export interface SgTableDataSourceSortChange {
  column: SgColumn;
  sort: SgTableSortDefinition;
}
