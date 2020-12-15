import { PblColumnDefinition, getValue } from '@pebula/ngrid/core';

const TRANSFORM_ROW_REF = Symbol('TRANSFORM_ROW_REF');

export function getCellValueAsHeader (row: PblColumnDefinition): any {
  return row.label;
}

export function getCellValueTransformed(this: PblColumnDefinition, colAsRow: PblColumnDefinition): any {
  return getValue(colAsRow, this.data[TRANSFORM_ROW_REF]);
}

export function createTransformedColumn(row: any, index: number): PblColumnDefinition {
  return { prop: `__transform_item_${index}__`, data: { [TRANSFORM_ROW_REF]: row } };
}
