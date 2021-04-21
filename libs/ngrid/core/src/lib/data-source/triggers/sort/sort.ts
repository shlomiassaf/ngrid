import { PblColumnDefinition } from '../../../models/column';
import { getValue } from '../../../utils/column';
import { PblNgridSortDefinition, PblNgridSortInstructions, PblNgridSorter } from './types';

/**
 * Apply sorting on a collection, based on column and sort definitions.
 * If the sort definition doesn't have a sorting function the default sorter is used.
 */
export function applySort<T>(column: PblColumnDefinition, sort: PblNgridSortDefinition, data: T[]): T[] {
  if (!sort || !sort.order) {
    return data;
  }

  const sortFn: PblNgridSorter<T> = typeof sort.sortFn === 'function'
    ? sort.sortFn
    : typeof column.sort === 'function'
      ? column.sort
      : defaultSorter
  ;

  return column && data
    ? sortFn(column, sort, data.slice())
    : data || []
  ;
}

function defaultSorter<T>(column: PblColumnDefinition, sort: PblNgridSortInstructions, data: T[]): T[] {
  return data.sort((a, b) => {
    const directionMultiplier = (sort.order === 'asc' ? 1 : -1);
    let valueA = getValue(column, a);
    let valueB = getValue(column, b);

    valueA = isNaN(+valueA) ? valueA : +valueA;
    valueB = isNaN(+valueB) ? valueB : +valueB;

    if (valueA && valueB) {
      return (valueA < valueB ? -1 : valueA === valueB ? 0 : 1) * directionMultiplier;
    }

    return (valueA ? 1 : -1) * directionMultiplier;
  });
}
