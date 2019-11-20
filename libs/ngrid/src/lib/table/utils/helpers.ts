import { PblColumnDefinition } from '../columns/types';
import { PblColumn } from '../columns/column';
import { PblMetaColumnStore } from '../columns/column-store';
import { StaticColumnWidthLogic } from '../col-width-logic/static-column-width';

/**
 * Given an object (item) and a path, returns the value at the path
 */
export function deepPathGet(item: any, col: PblColumnDefinition): any {
  if ( col.path ) {
    for ( const p of col.path ) {
      item = item[ p ];
      if ( !item ) return;
    }
  }
  return item[ col.prop ];
}

/**
 * Given an object (item) and a path, returns the value at the path
 */
export function deepPathSet(item: any, col: PblColumnDefinition, value: any): void {
  if ( col.path ) {
    for ( const p of col.path ) {
      item = item[ p ];
      if ( !item ) return;
    }
  }
  item[ col.prop ] = value;
}

/**
 * Updates the column sizes of the columns provided based on the column definition metadata for each column.
 * The final width represent a static width, it is the value as set in the definition (except column without width, where the calculated global width is set).
 */
export function resetColumnWidths(rowWidth: StaticColumnWidthLogic,
                                  tableColumns: PblColumn[],
                                  metaColumns: PblMetaColumnStore[]): void {
  const { pct, px } = rowWidth.defaultColumnWidth;
  const defaultWidth = `calc(${pct}% - ${px}px)`;

  for (const c of tableColumns) {
    c.setDefaultWidth(defaultWidth);
    c.updateWidth();
  }

  for (const m of metaColumns) {
    for (const c of [m.header, m.footer]) {
      if (c) {
        c.updateWidth('');
      }
    }
    // We don't handle groups because they are handled by `PblNgridComponent.resizeRows()`
    // which set the width for each.
  }
}
