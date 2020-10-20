import { filter } from 'rxjs/operators';
import { OnInit, OnDestroy, Directive, ElementRef } from '@angular/core';
import { CdkFooterCell } from '@angular/cdk/table';

import { unrx } from '../utils';
import { PblNgridComponent } from '../ngrid.component';
import { PblMetaColumn,PblColumnGroup } from '../column/model';
import { MetaCellContext } from '../context/index';
import { PblNgridColumnDef } from '../column/directives/column-def';
import { applyWidth, initCellElement } from './utils';

@Directive({
  selector: 'pbl-ngrid-footer-cell',
  host: {
    'class': 'pbl-ngrid-footer-cell',
    'role': 'gridcell',
  },
  exportAs: 'ngridFooterCell',
 })
export class PblNgridFooterCellDirective extends CdkFooterCell implements OnInit, OnDestroy {
  cellCtx: MetaCellContext;

  private el: HTMLElement;
  constructor(private columnDef: PblNgridColumnDef<PblMetaColumn | PblColumnGroup>,
              public grid: PblNgridComponent,
              elementRef: ElementRef) {
    super(columnDef, elementRef);
    this.el = elementRef.nativeElement;
    const column = columnDef.column;
    applyWidth.call(this);
    initCellElement(this.el, column);

    columnDef.widthChange
      .pipe(
        filter( event => event.reason !== 'update'),
        unrx(this),
      )
      .subscribe(applyWidth.bind(this));
  }

  ngOnInit(): void {
    this.cellCtx = MetaCellContext.create(this.columnDef.column, this.grid);
  }

  ngOnDestroy(): void {
    unrx.kill(this);
  }

}
