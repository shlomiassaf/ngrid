import { PblColumnDefinition, PblColumn } from '@pebula/ngrid';

const TRANSFORM_ROW_REF = Symbol('TRANSFORM_ROW_REF');

export function getCellValueAsHeader (row: PblColumn): any {
  return row.label;
}

export function getCellValueTransformed(this: PblColumn, colAsRow: PblColumn): any {
  return colAsRow.getValue(this.data[TRANSFORM_ROW_REF]);
}

export function createTransformedColumn(row: any, index: number): PblColumnDefinition {
  return { prop: `__transform_item_${index}__`, data: { [TRANSFORM_ROW_REF]: row } };
}
