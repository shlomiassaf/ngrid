
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SgTableCheckboxModule } from '@sac/table/material/selection-column';
import { SgTablePaginatorModule } from '@sac/table/material/paginator';
import { SgTableMatSortModule } from '@sac/table/material/sort';
import { SgTableCellTooltipModule } from '@sac/table/material/cell-toolip';

@NgModule({
  imports: [
    CommonModule,
    SgTableCheckboxModule,
    SgTablePaginatorModule,
    SgTableMatSortModule,
    SgTableCellTooltipModule,
  ],
  exports: [
    SgTableCheckboxModule,
    SgTablePaginatorModule,
    SgTableMatSortModule,
    SgTableCellTooltipModule,
  ]
})
export class SgTableMaterialModule { }
