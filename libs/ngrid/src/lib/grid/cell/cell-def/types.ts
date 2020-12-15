import { PblColumnTypeDefinitionDataMap } from '@pebula/ngrid/core';

export interface PblNgridCellDefDirectiveBase {
  name: string;
  type: keyof PblColumnTypeDefinitionDataMap;
}
