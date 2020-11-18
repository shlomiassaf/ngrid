import { filter } from 'rxjs/operators';
import { OnDestroy, Component, ElementRef, DoCheck, TemplateRef } from '@angular/core';
import { RowContext } from '@angular/cdk/table';

import { unrx } from '../utils';
import { COLUMN_EDITABLE_CELL_CLASS } from '../utils/unique-column-css';
import { PblRowContext, PblCellContext } from '../context/index';
import { PblColumn } from '../column/model';
import { initCellElement } from './utils';
import { PblNgridBaseCell } from './base-cell';


function initDataCellElement(el: HTMLElement, column: PblColumn, prev?: PblColumn): void {
  if (prev?.editable && prev.editorTpl) {
    el.classList.remove(COLUMN_EDITABLE_CELL_CLASS);
  }
  if (column.editable && column.editorTpl) {
    el.classList.add(COLUMN_EDITABLE_CELL_CLASS);
  }
}

/** Cell template container that adds the right classes and role. */
@Component({
  selector: 'pbl-ngrid-cell',
  template: `<ng-container *ngTemplateOutlet="template; context: cellCtx"></ng-container>`,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    'class': 'pbl-ngrid-cell',
    'role': 'gridcell',
    '[attr.id]': 'column?.id',
    '[attr.tabindex]': 'column?.columnDef?.grid.cellFocus'
  },
  exportAs: 'pblNgridCell',
})
export class PblNgridCellComponent extends PblNgridBaseCell implements DoCheck {

  column: PblColumn;
  cellCtx: PblCellContext | undefined;
  template: TemplateRef<any>;

  private _rowCtx: PblRowContext<any>;
  private __rowCtx: RowContext<any>;

  /**
   * The position of the column def among all columns regardless of visibility.
   */
  private colIndex: number;
  private focused = false;
  private selected = false;

  syncColumn() {
    if (this.column) {
      this.colIndex = this.column.columnDef.grid.columnApi.indexOf(this.column);
    }
  }

  setContext(context: PblRowContext<any>) {
    this._rowCtx = context;
  }

  setColumn(column: PblColumn) {
    const prev = this.column;
    if (prev !== column) {
      if (prev) {
        unrx.kill(this, prev);
      }

      this.column = column;
      this.colIndex = this.column.columnDef.grid.columnApi.indexOf(column);

      column.columnDef.applyWidth(this.el);
      initCellElement(this.el, column, prev);
      initDataCellElement(this.el, column, prev);

      /*  Apply width changes to this data cell
          We don't update "update" events because they are followed by a resize event which will update the absolute value (px) */
      column.columnDef.widthChange
        .pipe(
          filter( event => event.reason !== 'update'),
          unrx(this, column),
        )
        .subscribe(event => this.column.columnDef.applyWidth(this.el));
    }
  }

  ngDoCheck(): void {
    if (this._rowCtx) {
      const cellContext = this.cellCtx = this._rowCtx.cell(this.colIndex);

      this.template = cellContext.editing ? this.column.editorTpl : this.column.cellTpl;

      if (cellContext.focused !== this.focused) {

        if (this.focused = cellContext.focused) {
          this.el.classList.add('pbl-ngrid-cell-focused');
        } else {
          this.el.classList.remove('pbl-ngrid-cell-focused');
        }
      }
      if (this.cellCtx.selected !== this.selected) {
        if (this.selected = cellContext.selected) {
          this.el.classList.add('pbl-ngrid-cell-selected');
        } else {
          this.el.classList.remove('pbl-ngrid-cell-selected');
        }
      }
    }
  }
}
