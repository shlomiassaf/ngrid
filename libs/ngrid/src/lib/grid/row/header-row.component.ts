import { ChangeDetectionStrategy, Component, ElementRef, EmbeddedViewRef, Inject, Input, ViewEncapsulation, SimpleChanges, OnChanges, Optional, DoCheck, OnDestroy, ViewContainerRef, ViewChild, ComponentRef, Attribute } from '@angular/core';
import { CdkHeaderRow } from '@angular/cdk/table';

import { EXT_API_TOKEN, PblNgridExtensionApi } from '../../ext/grid-ext-api';
import { PblNgridComponent } from '../ngrid.component';
import { unrx } from '../utils/unrx';
import { PblNgridBaseRowComponent, PBL_NGRID_BASE_ROW_TEMPLATE } from './base-row.component';
import { PblColumn, PblMetaRowDefinitions } from '../column/model';
import { PblNgridMetaRowService, PblMetaRow } from '../meta-rows';
import { PblNgridHeaderCellComponent } from '../cell/header-cell.component';

@Component({
  selector: 'pbl-ngrid-header-row',
  template: PBL_NGRID_BASE_ROW_TEMPLATE,
  host: { // tslint:disable-line:use-host-property-decorator
    'role': 'row',
  },
  providers: [
    { provide: CdkHeaderRow, useExisting: PblNgridHeaderRowComponent }
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
export class PblNgridHeaderRowComponent extends PblNgridBaseRowComponent<'header' | 'footer', PblMetaRowDefinitions> implements PblMetaRow {

  @Input() set row(value: PblMetaRowDefinitions) { this.updateRow(value); }

  get meta(): PblMetaRowDefinitions { return this._meta; }
  set meta(value: PblMetaRowDefinitions) { this.row = value; }

  readonly element: HTMLElement;
  readonly isFooter: boolean;
  readonly gridWidthRow: boolean;
  private _meta: PblMetaRowDefinitions;

  constructor(@Optional() @Inject(EXT_API_TOKEN) extApi: PblNgridExtensionApi,
              el: ElementRef<HTMLElement>,
              private readonly metaRows: PblNgridMetaRowService,
              @Attribute('footer') isFooter: any,
              @Attribute('gridWidthRow') gridWidthRow: any) {
    super(extApi, el);
    this.element = el.nativeElement;
    this.gridWidthRow = gridWidthRow !== null;
    this.isFooter = isFooter !== null;
    if (this._extApi) {
      this.handleVisibility();
    }
  }

  ngOnDestroy(): void {
    this.metaRows.removeMetaRow(this);
    super.ngOnDestroy();
  }

  protected getRowType() { return this.el.nativeElement.hasAttribute('footer') ? 'footer' : 'header' as const; }

  protected init(initAtConstructor: boolean) {
    if (!initAtConstructor) {
      this.handleVisibility();
    }
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
      const oldMeta = this._meta;

      if (oldMeta) {
        if(oldMeta.rowClassName) {
          this.el.nativeElement.classList.remove(oldMeta.rowClassName);
        }
        this.metaRows.removeMetaRow(this);
      }
      this._meta = value;
      if (value) {
        if (value.rowClassName) {
          this.el.nativeElement.classList.add(value.rowClassName);
        }
        this.metaRows.addMetaRow(this);
      }
    }
  }

  protected cellCreated(column: PblColumn, cell: ComponentRef<PblNgridHeaderCellComponent>) {
    cell.instance.setColumn(column);
  }

  private handleVisibility() {
    const classList = this.element.classList;
    classList.add(...(this.isFooter ? ['cdk-footer-row', 'pbl-ngrid-footer-row'] : ['cdk-header-row', 'pbl-ngrid-header-row']));
    const key = this.isFooter ? 'showFooter' : 'showHeader';
    if (!this._extApi.grid[key]) {
      classList.add('pbl-ngrid-row-hidden');
    }

    this._extApi.propChanged
      .pipe(unrx(this))
      .subscribe( event => {
        if (event.type === 'grid' && event.key === key) {
          if (event.prev === false) {
            classList.remove('pbl-ngrid-row-hidden');
          } else {
            classList.add('pbl-ngrid-row-hidden');
          }
        }
      });
  }
}
