import { uniqueColumnCss, uniqueColumnTypeCss } from '../utils/unique-column-css';
import { PblNgridColumnDef } from '../column/directives/column-def';
import { COLUMN } from '../column/model';

export function initCellElement(el: HTMLElement, column: COLUMN, prev?: COLUMN): void {
  if (prev) {
    // If IE 11 is dropped before we switch to setting a single class name, change to multi param
    // with destructuring.
    const classList = el.classList;
    for (const className of prev.columnDef._columnCssClassName) {
      classList.add(className);
    }

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

  // If IE 11 is dropped before we switch to setting a single class name, change to multi param
  // with destructuring.
  const classList = el.classList;
  for (const className of column.columnDef._columnCssClassName) {
    classList.add(className);
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

export function initCellHeaderFooter(element: HTMLElement, isFooter: boolean) {
  element.classList.add(...(isFooter ? ['cdk-footer-cell', 'pbl-ngrid-footer-cell'] : ['cdk-header-cell', 'pbl-ngrid-header-cell']));
}

export function applyWidth(this: { columnDef: PblNgridColumnDef; el: HTMLElement }) {
  this.columnDef.applyWidth(this.el);
}

export function applySourceWidth(this: { columnDef: PblNgridColumnDef; el: HTMLElement }) {
  this.columnDef.applySourceWidth(this.el);
}
