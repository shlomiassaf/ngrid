import { PblBaseColumnDefinition, PblColumnDefinition, PblColumnGroupDefinition } from './types';

const RE_PARSE_STYLE_LENGTH_UNIT = /((?:\d*\.)?\d+)(%|px)$/;

export function parseStyleWidth(exp: string): { value: number, type: 'px' | '%'} | undefined {
  const match = RE_PARSE_STYLE_LENGTH_UNIT.exec(exp);
  if (match) {
    return { value: Number(match[1]), type: <any> match[2] };
  }
}

export function initDefinitions<T extends PblBaseColumnDefinition>(def: PblBaseColumnDefinition, target: T): void {
  const copyKeys: Array<keyof PblBaseColumnDefinition> = ['id', 'label', 'css', 'minWidth', 'width', 'maxWidth', 'type'];
  copyKeys.forEach( k => k in def && (target[k as keyof T] = def[k]) );
  if (def.data) {
    target.data = Object.assign(target.data || {}, def.data);
  }
}

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
