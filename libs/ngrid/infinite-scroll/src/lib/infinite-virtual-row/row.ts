import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CdkRow } from '@angular/cdk/table';
import { PblNgridRowComponent } from '@pebula/ngrid';

export const PBL_NGRID_ROW_TEMPLATE  = `<ng-content select=".pbl-ngrid-row-prefix"></ng-content><ng-content></ng-content><ng-content select=".pbl-ngrid-row-suffix"></ng-content>`;

@Component({
  selector: 'pbl-ngrid-row[infiniteRow]',
  template: PBL_NGRID_ROW_TEMPLATE,
  host: { // tslint:disable-line:no-host-metadata-property
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

  canCreateCell() {
    return false;
  }
}
