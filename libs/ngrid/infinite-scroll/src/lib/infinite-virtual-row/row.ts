import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { CdkRow } from '@angular/cdk/table';
import { PblColumn, PblNgridRowComponent } from '@pebula/ngrid';

export const PBL_NGRID_ROW_TEMPLATE  = `<ng-content select=".pbl-ngrid-row-prefix"></ng-content><ng-content></ng-content><ng-content select=".pbl-ngrid-row-suffix"></ng-content>`;

@Component({
  selector: 'pbl-ngrid-row[infiniteRow]',
  template: PBL_NGRID_ROW_TEMPLATE,
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'pbl-ngrid-row',
    'role': 'row',
  },
  providers: [
    { provide: CdkRow, useExisting: PblNgridRowComponent }
  ],
  exportAs: 'pblNgridInfiniteRow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PblNgridInfiniteRowComponent<T = any> extends PblNgridRowComponent<T> {

  @Input('infiniteRow') set row(value: any) { this.updateRow(); }

  canCreateCell() {
    return false;
  }
}
