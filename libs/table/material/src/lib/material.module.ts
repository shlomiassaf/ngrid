
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PblNgridCheckboxModule } from '@pebula/table/material/selection-column';
import { PblNgridPaginatorModule } from '@pebula/table/material/paginator';
import { PblNgridMatSortModule } from '@pebula/table/material/sort';
import { PblNgridCellTooltipModule } from '@pebula/table/material/cell-tooltip';

@NgModule({
  imports: [
    CommonModule,
    PblNgridCheckboxModule,
    PblNgridPaginatorModule,
    PblNgridMatSortModule,
    PblNgridCellTooltipModule,
  ],
  exports: [
    PblNgridCheckboxModule,
    PblNgridPaginatorModule,
    PblNgridMatSortModule,
    PblNgridCellTooltipModule,
  ]
})
export class PblNgridMaterialModule { }
