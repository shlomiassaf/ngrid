import { PblColumn } from '../table/columns/column';

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
  (column: PblColumn, sort: PblNgridSortInstructions, data: T[]): T[];
}

export interface PblNgridDataSourceSortChange {
  column: PblColumn;
  sort: PblNgridSortDefinition;
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
