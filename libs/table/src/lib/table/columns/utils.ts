import { NegCdkVirtualScrollViewportComponentBaseColumnDefinition, NegColumnDefinition, NegColumnGroupDefinition } from './types';

const RE_PARSE_STYLE_LENGTH_UNIT = /((?:\d*\.)?\d+)(%|px)$/;

export function parseStyleWidth(exp: string): { value: number, type: 'px' | '%'} | undefined {
  const match = RE_PARSE_STYLE_LENGTH_UNIT.exec(exp);
  if (match) {
    return { value: Number(match[1]), type: <any> match[2] };
  }
}

export function initDefinitions<T extends NegCdkVirtualScrollViewportComponentBaseColumnDefinition>(def: NegCdkVirtualScrollViewportComponentBaseColumnDefinition, target: T): void {
  const copyKeys: Array<keyof NegCdkVirtualScrollViewportComponentBaseColumnDefinition> = ['id', 'label', 'css', 'minWidth', 'width', 'maxWidth', 'type'];
  copyKeys.forEach( k => k in def && (target[k] = def[k]) );
  if (def.data) {
    target.data = Object.assign(target.data || {}, def.data);
  }
}

export function isColumnDefinition(obj: any): obj is NegColumnDefinition {
  // TODO: Get rid of this duckt-type type matching. Accept solid instances in NegTable.columns instead of interfaces.
  return !!obj.prop && !obj.hasOwnProperty('span');
}


export function isColumnGroupDefinition(obj: any): obj is NegColumnGroupDefinition {
  // TODO: Get rid of this duckt-type type matching. Accept solid instances in NegTable.columns instead of interfaces.
  return !!obj.prop && obj.hasOwnProperty('span');
}
