import { PblColumn } from '../table/columns/column';

export type PblTableSortOrder = 'asc' | 'desc';

export interface PblTableSortInstructions {
  order?: PblTableSortOrder;
}

/**
 * Event fired when sort changes.
 */
export interface PblTableSortDefinition extends PblTableSortInstructions {
  sortFn?: PblTableSorter;
}

/**
 * A function that can sort a dataset based on `PblTableSortInstructions`
 */
export interface PblTableSorter<T = any> {
  (column: PblColumn, sort: PblTableSortInstructions, data: T[]): T[];
}

export interface PblTableDataSourceSortChange {
  column: PblColumn;
  sort: PblTableSortDefinition;
}


// FILTERING
export type DataSourcePredicate = (item: any, properties: PblColumn[]) => boolean;
export type DataSourceFilterToken = undefined | DataSourcePredicate | any;

export interface DataSourceFilterType {
  type: 'value' | 'predicate';
  columns: PblColumn[];
  filter: any | DataSourcePredicate;
}

export type DataSourceFilter = undefined | DataSourceFilterType ;
