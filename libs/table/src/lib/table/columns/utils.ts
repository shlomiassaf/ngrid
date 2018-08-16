import { SgBaseColumnDefinition, SgColumnDefinition, SgColumnGroupDefinition } from './types';

const RE_PARSE_STYLE_LENGTH_UNIT = /((?:\d*\.)?\d+)(%|px)$/;

export function parseStyleWidth(exp: string): { value: number, type: 'px' | '%'} | undefined {
  const match = RE_PARSE_STYLE_LENGTH_UNIT.exec(exp);
  if (match) {
    return { value: Number(match[1]), type: <any> match[2] };
  }
}

export function initDefinitions<T extends SgBaseColumnDefinition>(def: SgBaseColumnDefinition, target: T): void {
  const copyKeys: Array<keyof SgBaseColumnDefinition> = ['id', 'label', 'css', 'minWidth', 'width', 'type', 'typeData'];
  copyKeys.forEach( k => k in def && (target[k] = def[k]) );
}

export function isColumnDefinition(obj: any): obj is SgColumnDefinition {
  // TODO: Get rid of this duckt-type type matching. Accept solid instances in SgTable.columns instead of interfaces.
  return !!obj.prop && !obj.hasOwnProperty('span');
}


export function isColumnGroupDefinition(obj: any): obj is SgColumnGroupDefinition {
  // TODO: Get rid of this duckt-type type matching. Accept solid instances in SgTable.columns instead of interfaces.
  return !!obj.prop && obj.hasOwnProperty('span');
}
