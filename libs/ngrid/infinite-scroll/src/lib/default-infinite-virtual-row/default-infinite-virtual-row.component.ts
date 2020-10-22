import { Component, ViewEncapsulation } from '@angular/core';
import { PblColumn } from '@pebula/ngrid';

/**
 * Use to set the a default `pblNgridInfiniteVirtualRowDef` if the user did not set one.
 */
@Component({
  selector: 'pbl-ngrid-default-infinite-virtual-row',
  templateUrl: './default-infinite-virtual-row.component.html',
  styleUrls: ['./default-infinite-virtual-row.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PblNgridDefaultInfiniteVirtualRowComponent {
  protected createCell(column: PblColumn) {
  }

  protected destroyCell(column: PblColumn) {
  }
}
