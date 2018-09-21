import { SgColumn } from '../table/columns';
import { DataSourceFilter, DataSourceFilterToken, DataSourcePredicate } from './types';

export function createFilter(value: DataSourceFilterToken, columns: SgColumn[]): DataSourceFilter {
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
      const value = filter.filter.toLowerCase();
      return rawData.filter( row => cols.some( col => {
        const v = col.getValue(row);
        return v && v.toString().toLowerCase().includes(value);
      }) );
    }
  }
  return rawData;
}
