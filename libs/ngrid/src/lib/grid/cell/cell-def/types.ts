import { PblColumnTypeDefinitionDataMap } from '../../column/model';

export interface PblNgridCellDefDirectiveBase {
  name: string;
  type: keyof PblColumnTypeDefinitionDataMap;
}
