import { PblColumnDefinition } from '../../../models/column';

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
