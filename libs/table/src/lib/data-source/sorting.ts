import { PblColumn } from '../table/columns';
import { PblTableSortDefinition, PblTableSortInstructions, PblTableSorter } from './types';

/**
 * Apply sorting on a collection, based on column and sort definitions.
 * If the sort definition doesn't have a sorting function the default sorter is used.
 */
export function applySort<T>(column: PblColumn, sort: PblTableSortDefinition, data: T[]): T[] {
  if (!sort || !sort.order) {
    return data;
  }
  const sortFn: PblTableSorter<T> = typeof sort.sortFn === 'function' ? sort.sortFn : defaultSorter;
  return column && data
    ? sortFn(column, sort, data)
    : data || []
  ;
}

function defaultSorter<T>(column: PblColumn, sort: PblTableSortInstructions, data: T[]): T[] {
  return data.slice().sort((a, b) => {
    let valueA = column.getValue(a);
    let valueB = column.getValue(b);

    valueA = isNaN(+valueA) ? valueA : +valueA;
    valueB = isNaN(+valueB) ? valueB : +valueB;

    return (valueA < valueB ? -1 : valueA === valueB ? 0 : 1) * (sort.order === 'asc' ? 1 : -1);
  });
}
