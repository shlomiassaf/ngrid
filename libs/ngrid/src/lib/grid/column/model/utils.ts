import { PblBaseColumnDefinition } from '@pebula/ngrid/core';

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
