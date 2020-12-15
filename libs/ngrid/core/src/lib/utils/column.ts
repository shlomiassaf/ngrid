import { PblColumnDefinition } from '../models/column';

/**
 * Given an object (item) and a path, returns the value at the path
 */
export function deepPathGet(item: any, col: PblColumnDefinition): any {
  if ( col.path ) {
    for ( const p of col.path ) {
      item = item[ p ];
      if ( !item ) return;
    }
  }
  return item[ col.prop ];
}

/**
 * Given an object (item) and a path, returns the value at the path
 */
export function deepPathSet(item: any, col: PblColumnDefinition, value: any): void {
  if ( col.path ) {
    for ( const p of col.path ) {
      item = item[ p ];
      if ( !item ) return;
    }
  }
  item[ col.prop ] = value;
}


export function getValue<T = any>(col: PblColumnDefinition, row: any): T {
  if (col.transform) {
    return col.transform(deepPathGet(row, this), row, this);
  }
  return deepPathGet(row, col);
}
