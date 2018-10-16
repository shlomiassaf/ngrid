
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SgTableCheckboxModule } from '@sac/table/material/selection-column';
import { SgTablePaginatorModule } from '@sac/table/material/paginator';
import { SgTableMatSortModule } from '@sac/table/material/sort';

@NgModule({
  imports: [
    CommonModule,
    SgTableCheckboxModule,
    SgTablePaginatorModule,
    SgTableMatSortModule,
  ],
  exports: [
    SgTableCheckboxModule,
    SgTablePaginatorModule,
    SgTableMatSortModule,
  ]
})
export class SgTableMaterialModule { }
