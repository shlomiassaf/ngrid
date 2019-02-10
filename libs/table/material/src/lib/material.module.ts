
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NegTableCheckboxModule } from '@pebula/table/material/selection-column';
import { NegTablePaginatorModule } from '@pebula/table/material/paginator';
import { NegTableMatSortModule } from '@pebula/table/material/sort';
import { NegTableCellTooltipModule } from '@pebula/table/material/cell-tooltip';

@NgModule({
  imports: [
    CommonModule,
    NegTableCheckboxModule,
    NegTablePaginatorModule,
    NegTableMatSortModule,
    NegTableCellTooltipModule,
  ],
  exports: [
    NegTableCheckboxModule,
    NegTablePaginatorModule,
    NegTableMatSortModule,
    NegTableCellTooltipModule,
  ]
})
export class NegTableMaterialModule { }
