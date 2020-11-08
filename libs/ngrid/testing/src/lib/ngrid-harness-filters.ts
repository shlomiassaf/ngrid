import { BaseHarnessFilters } from '@angular/cdk/testing';

export interface ColumnCellHarnessFilters extends BaseHarnessFilters {
  /** Only find instances whose column name matches the given value. */
  columnIds?: string[];
}

export interface ColumnHeaderCellHarnessFilters extends ColumnCellHarnessFilters {}

export interface DataCellHarnessFilters extends ColumnCellHarnessFilters { }


export interface PblNgridDataRowHarnessFilters extends BaseHarnessFilters {
  /**
   * Returns rows where the row reflects the data row at the position (index) in the datasource.
   */
  rowIndex?: number;
  /**
   * Returns rows where the row reflects the data row with the identity provided.
   */
  rowIdentity?: string;
}

export interface PblNgridHarnessFilters extends BaseHarnessFilters {
}
