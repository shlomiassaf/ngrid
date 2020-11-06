import { ChangeDetectionStrategy, Component, Input, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { CdkRow } from '@angular/cdk/table';
import { PblNgridRowComponent, PblNgridComponent } from '@pebula/ngrid';

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

  // We must explicitly define the inherited properties which have angular annotations
  // Because angular will not detect them when building this library.
  // TODO: When moving up to IVY see if this one get fixed
  /**
   * Optional grid instance, required only if the row is declared outside the scope of the grid.
   */
  @Input() grid: PblNgridComponent<T>;
  @ViewChild('viewRef', { read: ViewContainerRef }) _viewRef: ViewContainerRef;

  @Input('infiniteRow') set row(value: any) { this.updateRow(); }

  canCreateCell() {
    return false;
  }
}
