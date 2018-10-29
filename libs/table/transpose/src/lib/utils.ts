import { NegColumnDefinition, NegColumn } from '@neg/table';

const TRANSFORM_ROW_REF = Symbol('TRANSFORM_ROW_REF');

export function getCellValueAsHeader (row: NegColumn): any {
  return row.label;
}

export function getCellValueTransformed(this: NegColumn, row: NegColumn): any {
  return row.getValue(this.data[TRANSFORM_ROW_REF]);
}

export function createTransformedColumn(row: any, index: number): NegColumnDefinition {
  return { prop: `__transform_item_${index}__`, data: { [TRANSFORM_ROW_REF]: row } };
}
