import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';

import {
  SG_TABLE_CONFIG, SgTableConfig,
  SgCdkTableComponent,
  SgTableComponent,

  SgTableRowComponent,

  SgTableColumnDef,
  SgTableHeaderCellDefDirective,
  SgTableFooterCellDefDirective,
  SgTableCellDefDirective,
  SgTableHeaderCellDirective,
  SgTableCellDirective,
  SgTableFooterCellDirective,

  SgTableNoDataRefDirective,
  SgTablePaginatorRefDirective,

  SgColumnSizeObserver,
} from './table';
import { TableCellContextPipe } from './table/pipes/table-cell-context.pipe';

@NgModule({
  imports: [
    CommonModule,
    CdkTableModule,
  ],
  declarations: [
    SgCdkTableComponent,
    SgTableColumnDef,
    SgTableRowComponent,
    SgTableNoDataRefDirective,
    SgTablePaginatorRefDirective,

    SgTableHeaderCellDefDirective,
    SgTableFooterCellDefDirective,
    SgTableCellDefDirective,
    SgTableHeaderCellDirective,
    SgTableCellDirective,
    SgTableFooterCellDirective,

    SgColumnSizeObserver,

    SgTableComponent,
    TableCellContextPipe
  ],
  exports: [
    SgTableRowComponent,
    SgTableNoDataRefDirective,
    SgTablePaginatorRefDirective,

    SgTableHeaderCellDefDirective,
    SgTableFooterCellDefDirective,
    SgTableCellDefDirective,
    SgTableHeaderCellDirective,
    SgTableCellDirective,
    SgTableFooterCellDirective,

    SgColumnSizeObserver,

    SgTableComponent,
  ]
})
export class SgTableModule {
  static forRoot(config?: SgTableConfig): ModuleWithProviders {
    return {
      ngModule: SgTableModule,
      providers: [
        { provide: SG_TABLE_CONFIG, useValue: config },
      ]
    };
  }
}
