import { NegColumn } from '../table/columns/column';

export type NegTableSortOrder = 'asc' | 'desc';

export interface NegTableSortInstructions {
  order?: NegTableSortOrder;
}

/**
 * Event fired when sort changes.
 */
export interface NegTableSortDefinition extends NegTableSortInstructions {
  sortFn?: NegTableSorter;
}

/**
 * A function that can sort a dataset based on `NegTableSortInstructions`
 */
export interface NegTableSorter<T = any> {
  (column: NegColumn, sort: NegTableSortInstructions, data: T[]): T[];
}

export interface NegTableDataSourceSortChange {
  column: NegColumn;
  sort: NegTableSortDefinition;
}


// FILTERING
export type DataSourcePredicate = (item: any, properties: NegColumn[]) => boolean;
export type DataSourceFilterToken = undefined | DataSourcePredicate | any;

export interface DataSourceFilterType {
  type: 'value' | 'predicate';
  columns: NegColumn[];
  filter: any | DataSourcePredicate;
}

export type DataSourceFilter = undefined | DataSourceFilterType ;
