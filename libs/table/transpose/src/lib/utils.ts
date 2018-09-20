import { SgColumnDefinition, SgColumn } from '@sac/table';

const TRANSFORM_ROW_REF = Symbol('TRANSFORM_ROW_REF');

export function getCellValueAsHeader (row: SgColumn): any {
  return row.label;
}

export function getCellValueTransformed(this: SgColumn, row: SgColumn): any {
  return row.getValue(this.data[TRANSFORM_ROW_REF]);
}

export function createTransformedColumn(row: any, index: number): SgColumnDefinition {
  return { prop: `__transform_item_${index}__`, data: { [TRANSFORM_ROW_REF]: row } };
}
