
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NegTableCheckboxModule } from '@neg/table/material/selection-column';
import { NegTablePaginatorModule } from '@neg/table/material/paginator';
import { NegTableMatSortModule } from '@neg/table/material/sort';
import { NegTableCellTooltipModule } from '@neg/table/material/cell-tooltip';

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
