import { PblColumn } from '../column/model';
import { PblMetaColumnStore } from '../column/management';
import { StaticColumnWidthLogic } from '../column/width-logic/static-column-width';

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
