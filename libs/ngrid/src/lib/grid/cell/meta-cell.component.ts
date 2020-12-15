import { filter } from 'rxjs/operators';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewContainerRef,
  ViewChild,
} from '@angular/core';
import { unrx } from '@pebula/ngrid/core';

import { PblNgridComponent } from '../ngrid.component';
import { PblMetaColumn, PblColumnGroup, isPblColumnGroup } from '../column/model';
import { MetaCellContext } from '../context/index';
import { PblNgridColumnDef } from '../column/directives/column-def';
import { applySourceWidth, initCellElement, initCellHeaderFooter } from './utils';
import { PblNgridBaseCell } from './base-cell';

const HEADER_GROUP_CSS = `pbl-header-group-cell`;
const HEADER_GROUP_PLACE_HOLDER_CSS = `pbl-header-group-cell-placeholder`;

/**
 * Header cell component.
 * The header cell component will render the header cell template and add the proper classes and role.
 *
 * It is also responsible for creating and managing the any `dataHeaderExtensions` registered in the registry.
 * These extensions add features to the cells either as a template instance or as a component instance.
 * Examples: Sorting behavior, drag&drop/resize handlers, menus etc...
 */
@Component({
  selector: 'pbl-ngrid-meta-cell',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    role: 'cell',
  },
  exportAs: 'ngridMetaCell',
  template: `<ng-container *ngTemplateOutlet="column?.template; context: cellCtx"></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PblNgridMetaCellComponent<T extends PblMetaColumn | PblColumnGroup = PblMetaColumn | PblColumnGroup> extends PblNgridBaseCell {
  @ViewChild('vcRef', { read: ViewContainerRef, static: true }) vcRef: ViewContainerRef;

  column: T;
  cellCtx: MetaCellContext<any, PblMetaColumn>;

  get columnDef(): PblNgridColumnDef<PblMetaColumn> { return this.column.columnDef; }
  get grid(): PblNgridComponent { return this.extApi.grid; }

  setColumn(column: T, isFooter: boolean) {
    const prev = this.column;
    if (prev !== column) {
      if (prev) {
        unrx.kill(this, prev);
      }

      this.column = column;

      if (column) {
        if (!column.columnDef) {
          new PblNgridColumnDef(this.extApi).column = column;
          column.columnDef.name = column.id;
        }

        this.cellCtx = MetaCellContext.create(column, this.grid);

        if (isPblColumnGroup(column)) {
          this.el.classList.add(HEADER_GROUP_CSS);
          if (column.placeholder) {
            this.el.classList.add(HEADER_GROUP_PLACE_HOLDER_CSS);
          }
        }
        this.columnDef.widthChange
          .pipe(
            filter( event => event.reason !== 'resize'),
            unrx(this, column),
          )
          .subscribe( event => this.columnDef.applySourceWidth(this.el));

        applySourceWidth.call(this);
        initCellElement(this.el, column);
        initCellHeaderFooter(this.el, isFooter);
      }
    }
  }

  ngOnDestroy() {
    if (this.column) {
      unrx(this, this.column);
    }
    super.ngOnDestroy();
  }
}
