import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PblNgridCheckboxModule } from '@pebula/ngrid-material/selection-column';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';
import { PblNgridMatSortModule } from '@pebula/ngrid-material/sort';
import { PblNgridCellTooltipModule } from '@pebula/ngrid-material/cell-tooltip';
import { PblNgridContextMenuModule } from '@pebula/ngrid-material/context-menu';

@NgModule({
  imports: [
    CommonModule,
    PblNgridCheckboxModule,
    PblNgridPaginatorModule,
    PblNgridMatSortModule,
    PblNgridCellTooltipModule,
    PblNgridContextMenuModule,
  ],
  exports: [
    PblNgridCheckboxModule,
    PblNgridPaginatorModule,
    PblNgridMatSortModule,
    PblNgridCellTooltipModule,
    PblNgridContextMenuModule,
  ]
})
export class PblNgridMaterialModule { }
