import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewEncapsulation, Optional, ComponentRef, Attribute, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CdkHeaderRow } from '@angular/cdk/table';

import { unrx } from '../utils/unrx';
import { PblNgridComponent } from '../ngrid.component';
import { PblNgridBaseRowComponent, PBL_NGRID_BASE_ROW_TEMPLATE } from './base-row.component';
import { PblColumn, PblMetaRowDefinitions } from '../column/model';
import { PblNgridMetaRowService, PblMetaRow } from '../meta-rows/meta-row.service';
import { PblNgridHeaderCellComponent } from '../cell/header-cell.component';
import { applyMetaRowClass, initColumnOrMetaRow, setRowVisibility } from './utils';
import { PblNgridColumnDef } from '../column/directives/column-def';

/**
 * The row that represents the columns of the grid.
 * There are only 2 column rows in a grid, the top (header) and bottom (footer), both optional.
 */
@Component({
  selector: 'pbl-ngrid-column-row',
  template: PBL_NGRID_BASE_ROW_TEMPLATE,
  host: { // tslint:disable-line:no-host-metadata-property
    'role': 'row',
  },
  providers: [
    { provide: CdkHeaderRow, useExisting: PblNgridColumnRowComponent }
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
export class PblNgridColumnRowComponent extends PblNgridBaseRowComponent<'header' | 'footer', PblMetaRowDefinitions> implements PblMetaRow, OnDestroy {

  @Input() set row(value: PblMetaRowDefinitions) { this.updateRow(value); }

  get rowIndex(): number { return 0; }

  get meta(): PblMetaRowDefinitions { return this._meta; }
  set meta(value: PblMetaRowDefinitions) { this._meta = value; } // TODO: remove when removing pblMetaRow

  readonly rowType: 'header' | 'footer';
  readonly element: HTMLElement;
  readonly isFooter: boolean;
  readonly gridWidthRow: boolean;
  private _meta: PblMetaRowDefinitions;

  constructor(@Optional() grid: PblNgridComponent,
              cdRef: ChangeDetectorRef,
              el: ElementRef<HTMLElement>,
              private readonly metaRows: PblNgridMetaRowService,
              @Attribute('footer') isFooter: any,
              @Attribute('gridWidthRow') gridWidthRow: any) {
    super(grid, cdRef, el);
    this.element = el.nativeElement;
    this.gridWidthRow = gridWidthRow !== null;
    this.isFooter = isFooter !== null;
    this.rowType = this.isFooter ? 'footer' : 'header';
  }

  updateSize() {
    if (this.gridWidthRow) {
      for (const c of this._cells as ComponentRef<PblNgridHeaderCellComponent>[]) {
        c.instance.updateSize();
      }
    }
  }

  ngOnDestroy(): void {
    this.metaRows.removeMetaRow(this);
    super.ngOnDestroy();
  }

  protected init() {
    this.handleVisibility();
  }

  protected detectChanges() {
    for (const cell of this._cells) {
      // TODO: the cells are created through code which mean's that they don't belong
      // to the CD tree and we need to manually mark them for checking
      // We can customize the diffing, detect context changes internally and only trigger these cells which have changed!
      cell.changeDetectorRef.markForCheck();
    }
  }

  protected updateRow(value: PblMetaRowDefinitions) {
    if (value !== this._meta) {
      applyMetaRowClass(this.metaRows, this, this.element, this._meta, value);
    }
  }

  protected cellCreated(column: PblColumn, cell: ComponentRef<PblNgridHeaderCellComponent>) {
    if (!column.columnDef) {
      new PblNgridColumnDef(this._extApi).column = column;
      column.columnDef.name = column.id;
    }
    cell.instance.setColumn(column, this.gridWidthRow);
  }

  protected cellDestroyed(cell: ComponentRef<PblNgridHeaderCellComponent>, previousIndex: number) {
    unrx.kill(this, cell.instance.column);
  }

  private handleVisibility() {
    initColumnOrMetaRow(this.element, this.isFooter);
    const key = this.isFooter ? 'showFooter' : 'showHeader';
    if (!this._extApi.grid[key]) {
      setRowVisibility(this.element, false);
    }

    this._extApi.propChanged
      .pipe(unrx(this))
      .subscribe( event => {
        if (event.source === this._extApi.grid && event.key === key) {
          setRowVisibility(this.element, event.prev === false)
        }
      });
  }
}
