import { SgColumn } from '../table/columns';
import { SgTableSortDefinition, SgTableSortInstructions, SgTableSorter } from './types';

/**
 * Apply sorting on a collection, based on column and sort definitions.
 * If the sort definition doesn't have a sorting function the default sorter is used.
 */
export function applySort<T>(column: SgColumn, sort: SgTableSortDefinition, data: T[]): T[] {
  if (!sort || !sort.order) {
    return data;
  }
  const sortFn: SgTableSorter<T> = typeof sort.sortFn === 'function' ? sort.sortFn : defaultSorter;
  return column && data
    ? sortFn(column, sort, data)
    : data || []
  ;
}

function defaultSorter<T>(column: SgColumn, sort: SgTableSortInstructions, data: T[]): T[] {
  return data.slice().sort((a, b) => {
    let valueA = column.getValue(a);
    let valueB = column.getValue(b);

    valueA = isNaN(+valueA) ? valueA : +valueA;
    valueB = isNaN(+valueB) ? valueB : +valueB;

    return (valueA < valueB ? -1 : valueA === valueB ? 0 : 1) * (sort.order === 'asc' ? 1 : -1);
  });
}
