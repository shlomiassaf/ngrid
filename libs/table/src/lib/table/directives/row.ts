import { CdkRow, CDK_ROW_TEMPLATE, RowContext } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, ElementRef, EmbeddedViewRef, Inject, Input, ViewEncapsulation } from '@angular/core';
import { EXT_API_TOKEN, PblNgridExtensionApi } from '../../ext/table-ext-api';
import { PblRowContext } from '../context/index';


export const PBL_ANGRID_ROW_TEMPLATE  = `<ng-content select=".pbl-ngrid-row-prefix"></ng-content>${CDK_ROW_TEMPLATE}<ng-content select=".pbl-ngrid-row-suffix"></ng-content>`;

@Component({
  selector: 'pbl-ngrid-row:not([detailRow])',
  template: PBL_ANGRID_ROW_TEMPLATE,
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
export class PblNgridRowComponent<T = any> extends CdkRow {

  @Input() set row(value: T) {
    if (! (this.rowRenderIndex >= 0) ) {
      this.getRend();
    }
    this.context = this.extApi.contextApi.rowContext(this.rowRenderIndex);
  }

  rowRenderIndex: number;
  context: PblRowContext<T>;

  constructor(@Inject(EXT_API_TOKEN) protected extApi: PblNgridExtensionApi<T>, protected el: ElementRef<HTMLElement>) {
    super();
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
