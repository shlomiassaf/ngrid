import { PblNgridSortOrder } from '@pebula/ngrid/core';

export type PblNgridBsSortDirection = PblNgridSortOrder | '';

/** Interface for a directive that holds sorting state consumed by `PblNgridBsSortablePlugin`. */
export interface PblNgridSortable {
  /** The id of the column being sorted. */
  id: string;

  /** Starting sort direction. */
  start: 'asc' | 'desc';

  /** Whether to disable clearing the sorting state. */
  disableClear: boolean;
}

export interface PblNgridBsSortState {
  /** The id of the column being sorted. */
  active: string;

  /** The sort direction. */
  direction: PblNgridBsSortDirection;
}
