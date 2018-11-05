import { ViewContainerRef, EmbeddedViewRef } from '@angular/core';
import { NegTableMatrixRow } from './events';

/**
 * Returns true if the element is a row element (`neg-table-row`, `cdk-row`).
 *
 * This function works under the following assumptions:
 *
 *   - A row element MUST contain a "role" attribute with the value "row"
 */
export function isRowContainer(element: HTMLElement): boolean {
  return element.getAttribute('role') === 'row';
}

/**
 * Find the cell element that is or wraps the provided element.
 * The element can be a table cell element (any type of) OR a nested element (any level) of a table cell element.
 *
 * This function works under the following assumptions:
 *
 *   - The parent of a cell element is a row element.
 *   - Each row element MUST contain a "role" attribute with the value "row"
 */
export function findParentCell(element: HTMLElement): HTMLElement | undefined {
  while (element.parentElement) {
    if (isRowContainer(element.parentElement)) {
      return element;
    }
    element = element.parentElement;
  }
}

/**
 * Returns the position (index) of the cell (element) among it's siblings.
 */
export function findCellIndex(cell: Element): number {
  let colIndex = 0;
  while (cell = cell.previousElementSibling) {
    colIndex++;
  }
  return colIndex;
}

/**
 * Returns table metadata for a given ROW element.
 * This function works under the following assumptions:
 *
 *   - Each row element MUST contain a "role" attribute with the value "row"
 *   - Each row element MUST contains the type identifier attribute "data-rowtype" (except "data" rows)
 *   - Allowed values for "data-rowtype" are: 'header' | 'meta-header' | 'footer' | 'meta-footer' | 'data'
 *   - Row's representing data items (data-rowtype="data") can omit the type attribute and the function will infer it.
 *
 * NOTE that this function DOES NOT identify subType of `meta-group` (`NegTableMatrixRow<'header' | 'footer', 'meta-group'>`), it will return it as
 * 'meta`, you need to handle this case specifically.
 *
 * Because detection is based on DOM element position finding the original row index when multiple row containers are set (fixed/style/row) will not work.
 * The rowIndex will be relative to the container, and not the entire table.
 */
export function matrixRowFromRow(row: Element,
                                 vcRef: ViewContainerRef): NegTableMatrixRow<'data'> | NegTableMatrixRow<'header' | 'footer'> | NegTableMatrixRow<'header' | 'footer', 'meta'> | undefined  {
  const rowAttrType: 'header' | 'data' | 'footer' | 'meta-header' | 'meta-footer' = row.getAttribute('data-rowtype') as any || 'data';

  // TODO: Error if rowAttrType is not one of the allowed values!

  let rowIndex = 0;
  switch (rowAttrType) {
    case 'data':
      const sourceRow = row;
      while (row.previousElementSibling) {
        rowIndex++;
        row = row.previousElementSibling;
      }
      rowIndex = Math.min(rowIndex, vcRef.length - 1);
      while (rowIndex > -1) {
        if ((vcRef.get(rowIndex) as EmbeddedViewRef<any>).rootNodes[0] === sourceRow) {
          return {
            type: 'data',
            subType: 'data',
            rowIndex,
          } as { rowIndex: number } & NegTableMatrixRow<'data'>;
        }
        rowIndex--;
      }
      return;
    case 'header':
    case 'footer':
     return {
        type: rowAttrType,
        subType: 'data',
        rowIndex,
      } as NegTableMatrixRow<'header' | 'footer'>;
    default:
      while (row.previousElementSibling && row.previousElementSibling.getAttribute('data-rowtype') === rowAttrType) {
        rowIndex++;
        row = row.previousElementSibling;
      }
      return {
        type: rowAttrType === 'meta-footer' ? 'footer' : 'header',
        subType: 'meta',
        rowIndex,
      } as NegTableMatrixRow<'header' | 'footer', 'meta'>;
  }
}
