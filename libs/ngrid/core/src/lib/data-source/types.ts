import { PblColumnDefinition } from '../models/column';

export type PblNgridSortOrder = 'asc' | 'desc';

export interface PblNgridSortInstructions {
  order?: PblNgridSortOrder;
}

/**
 * Event fired when sort changes.
 */
export interface PblNgridSortDefinition extends PblNgridSortInstructions {
  sortFn?: PblNgridSorter;
}

/**
 * A function that can sort a dataset based on `PblNgridSortInstructions`
 */
export interface PblNgridSorter<T = any> {
  (column: PblColumnDefinition, sort: PblNgridSortInstructions, data: T[]): T[];
}

export interface PblNgridDataSourceSortChange {
  column: PblColumnDefinition;
  sort: PblNgridSortDefinition;
}


// FILTERING
/**
 * A function the return true then the value should be included in the result or false when not.
 * This is a single column filter predicated, returning false will filter out the entire row but the
 * predicate is only intended to filter a specific column.
 */
export type DataSourceColumnPredicate = (filterValue: any, colValue: any, row?: any, col?: PblColumnDefinition) => boolean;
/**
 * A function the return true then the row should be included in the result or false when not.
 * @param row The row in the data source that the filter apply on
 * @param properties A list of column instances (`PblColumnDefinition`) to filter values by.
 */
export type DataSourcePredicate = (row: any, properties: PblColumnDefinition[]) => boolean;

export type DataSourceFilterToken = undefined | DataSourcePredicate | any;

export interface DataSourceFilterType {
  type: 'value' | 'predicate';
  columns: PblColumnDefinition[];
  filter: any | DataSourcePredicate;
}

export type DataSourceFilter = undefined | DataSourceFilterType ;
