import { ChangeDetectionStrategy, Component, ElementRef, EmbeddedViewRef, Inject, Input, ViewEncapsulation, SimpleChanges, OnChanges, Optional } from '@angular/core';
import { CdkRow, CDK_ROW_TEMPLATE, RowContext } from '@angular/cdk/table';
import { PblNgridPluginController } from '../../ext/plugin-control';
import { EXT_API_TOKEN, PblNgridExtensionApi } from '../../ext/table-ext-api';
import { PblRowContext } from '../context/index';
import { PblNgridComponent } from '../table.component';

export const PBL_NGRID_ROW_TEMPLATE  = `<ng-content select=".pbl-ngrid-row-prefix"></ng-content>${CDK_ROW_TEMPLATE}<ng-content select=".pbl-ngrid-row-suffix"></ng-content>`;

@Component({
  selector: 'pbl-ngrid-row[row]',
  template: PBL_NGRID_ROW_TEMPLATE,
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'pbl-ngrid-row',
    'role': 'row',
  },
  providers: [
    { provide: CdkRow, useExisting: PblNgridRowComponent }
  ],
  exportAs: 'pblNgridRow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PblNgridRowComponent<T = any> extends CdkRow implements OnChanges {

  @Input() set row(value: T) { value && this.updateRow(); }

  /**
   * Optional grid instance, required only if the row is declared outside the scope of the grid.
   */
  @Input() grid: PblNgridComponent<T>;

  rowRenderIndex: number;
  context: PblRowContext<T>;

  constructor(@Optional() @Inject(EXT_API_TOKEN) protected extApi: PblNgridExtensionApi<T>, protected el: ElementRef<HTMLElement>) {
    super();
    if (extApi) {
      this.grid = extApi.table;
    }
  }

  updateRow(): void {
    if (this.extApi) {
      if (! (this.rowRenderIndex >= 0) ) {
        this.getRend();
      }
      this.context = this.extApi.contextApi.rowContext(this.rowRenderIndex);
      this.el.nativeElement.setAttribute('row-id', this.context.dataIndex as any);
      this.el.nativeElement.setAttribute('row-key', this.context.identity);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.extApi) {
      if (!this.grid) {
        throw new Error('"pbl-ngrid-row" is used outside the scope of a grid, you must provide a grid instance.');
      }
      const controller = PblNgridPluginController.find(this.grid);
      this.extApi = controller.extApi;
      this.updateRow();
    }
  }

  getRend(): void {
    const vcRef = this.extApi.cdkTable._rowOutlet.viewContainer;
    const len = vcRef.length - 1;
    for (let i = len; i > -1; i--) {
      const viewRef = vcRef.get(i) as EmbeddedViewRef<RowContext<T>>;
      if (viewRef.rootNodes[0] === this.el.nativeElement) {
        this.rowRenderIndex = i;
        break;
      }
    }
  }
}
