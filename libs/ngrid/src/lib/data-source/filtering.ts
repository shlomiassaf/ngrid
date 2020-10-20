import { PblColumn } from '../grid/column/model';
import { DataSourceFilter, DataSourceFilterToken, DataSourcePredicate, DataSourceColumnPredicate } from './types';

export function createFilter(value: DataSourceFilterToken, columns: PblColumn[]): DataSourceFilter {
  return value === undefined
    ? undefined
    : {
      columns,
      type: typeof value === 'function' ? 'predicate' : 'value',
      filter: value
    };
}

export function filter<T>(rawData: T[], filter: DataSourceFilter): T[] {
  if (!filter || !rawData || rawData.length === 0) {
    return rawData;
  } else {
    const cols = filter.columns;
    if (filter.type === 'predicate') {
      const value: DataSourcePredicate = <any>filter.filter;
      return rawData.filter( v => value(v, cols) );
    } else if ( filter.type === 'value' ) {
      const value = typeof filter.filter.toLowerCase === 'function' ? filter.filter.toLowerCase() : filter.filter;
      return rawData.filter( row => cols.some( col => {
        const predicate = col.filter || genericColumnPredicate;
        return predicate(col.filter ? filter.filter : value, col.getValue(row), row, col);
      }));
    }
  }
  return rawData;
}

/**
 * A generic column predicate that compares the inclusion (text) of the value in the column value.
 */
export const genericColumnPredicate: DataSourceColumnPredicate = (filterValue: any, colValue: any, row?: any, col?: PblColumn): boolean => {
  return colValue && colValue.toString().toLowerCase().includes(filterValue);
}
