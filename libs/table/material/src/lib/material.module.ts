
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PblTableCheckboxModule } from '@pebula/table/material/selection-column';
import { PblTablePaginatorModule } from '@pebula/table/material/paginator';
import { PblTableMatSortModule } from '@pebula/table/material/sort';
import { PblTableCellTooltipModule } from '@pebula/table/material/cell-tooltip';

@NgModule({
  imports: [
    CommonModule,
    PblTableCheckboxModule,
    PblTablePaginatorModule,
    PblTableMatSortModule,
    PblTableCellTooltipModule,
  ],
  exports: [
    PblTableCheckboxModule,
    PblTablePaginatorModule,
    PblTableMatSortModule,
    PblTableCellTooltipModule,
  ]
})
export class PblTableMaterialModule { }
