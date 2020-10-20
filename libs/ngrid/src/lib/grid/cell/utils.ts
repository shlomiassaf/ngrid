import { uniqueColumnCss, uniqueColumnTypeCss } from '../utils/unique-column-css';
import { PblNgridColumnDef } from '../column/directives/column-def';
import { COLUMN } from '../column/model';

export function initCellElement(el: HTMLElement, column: COLUMN, prev?: COLUMN): void {
  if (prev) {
    el.classList.remove(uniqueColumnCss(prev.columnDef));
    if (prev.type) {
      el.classList.remove(uniqueColumnTypeCss(prev.type));
    }
    if (prev.css) {
      const css = prev.css.split(' ');
      for (const c of css) {
        el.classList.remove(c);
      }
    }
  }

  el.classList.add(uniqueColumnCss(column.columnDef));
  if (column.type) {
    el.classList.add(uniqueColumnTypeCss(column.type));
  }
  if (column.css) {
    const css = column.css.split(' ');
    for (const c of css) {
      el.classList.add(c);
    }
  }
}

export function applyWidth(this: { columnDef: PblNgridColumnDef; el: HTMLElement }) {
  this.columnDef.applyWidth(this.el);
}

export function applySourceWidth(this: { columnDef: PblNgridColumnDef; el: HTMLElement }) {
  this.columnDef.applySourceWidth(this.el);
}
