import { filter } from 'rxjs/operators';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { unrx } from '@pebula/ngrid/core';

import { _PblNgridComponent } from '../../tokens';
import { PblColumn } from '../column/model';
import { MetaCellContext } from '../context/index';
import { PblNgridColumnDef } from '../column/directives/column-def';
import { applyWidth, initCellElement } from './utils';
import { PblNgridBaseCell } from './base-cell';

 @Component({
  selector: 'pbl-ngrid-footer-cell',
  template: `<ng-container *ngTemplateOutlet="column?.footerCellTpl; context: cellCtx"></ng-container>`,
  host: {
    class: 'cdk-footer-cell pbl-ngrid-footer-cell',
    role: 'gridcell',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PblNgridFooterCellComponent extends PblNgridBaseCell {

  column: PblColumn;
  cellCtx: MetaCellContext<any, PblColumn>;
  get columnDef(): PblNgridColumnDef { return this.column?.columnDef; }
  get grid(): _PblNgridComponent { return this.extApi.grid; }

  setColumn(column: PblColumn) {
    const prev = this.column;
    if (prev !== column) {
      if (prev) {
        unrx.kill(this, prev);
      }

      this.column = column;

      this.cellCtx = MetaCellContext.create(column, this.grid);

      applyWidth.call(this);
      initCellElement(this.el, column);

      this.columnDef.widthChange
      .pipe(
        filter( event => event.reason !== 'update'),
        unrx(this, column),
      )
      .subscribe(applyWidth.bind(this));
    }
  }

  ngOnDestroy() {
    if (this.column) {
      unrx(this, this.column);
    }
    super.ngOnDestroy();
  }
}
