import { SgColumn } from '../table/columns/column';

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


// FILTERING
export type DataSourcePredicate = (item: any, properties: SgColumn[]) => boolean;
export type DataSourceFilterToken = undefined | DataSourcePredicate | any;

export interface DataSourceFilterType {
  type: 'value' | 'predicate';
  columns: SgColumn[];
  filter: any | DataSourcePredicate;
}

export type DataSourceFilter = undefined | DataSourceFilterType ;
