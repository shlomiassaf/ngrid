import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollingModule as ScrollingModuleExp } from '@angular/cdk-experimental/scrolling';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';

import {
  NEG_TABLE_CONFIG, NegTableConfig,
  NegCdkTableComponent,
  NegTableComponent,

  NegTableRowComponent,

  NegTableColumnDef,
  NegTableHeaderCellDefDirective,
  NegTableFooterCellDefDirective,
  NegTableCellDefDirective,
  NegTableHeaderCellDirective,
  NegTableCellDirective,
  NegTableFooterCellDirective,

  ParentNgStyleDirective, ParentNgClassDirective,
  NegTableNoDataRefDirective,
  NegTablePaginatorRefDirective,

  NegColumnSizeObserver,
  NegCdkVirtualScrollViewportComponent,
  NegCdkVirtualScrollDirective,
} from './table/index';
import { TableCellContextPipe } from './table/pipes/table-cell-context.pipe';

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule, ScrollingModuleExp,
    CdkTableModule,
  ],
  declarations: [
    NegCdkTableComponent,
    NegTableColumnDef,
    NegTableRowComponent,
    ParentNgStyleDirective, ParentNgClassDirective,
    NegTableNoDataRefDirective,
    NegTablePaginatorRefDirective,

    NegTableHeaderCellDefDirective,
    NegTableFooterCellDefDirective,
    NegTableCellDefDirective,
    NegTableHeaderCellDirective,
    NegTableCellDirective,
    NegTableFooterCellDirective,

    NegColumnSizeObserver,
    NegCdkVirtualScrollViewportComponent,
    NegCdkVirtualScrollDirective,

    NegTableComponent,
    TableCellContextPipe
  ],
  exports: [
    NegTableRowComponent,
    ParentNgStyleDirective, ParentNgClassDirective,
    NegTableNoDataRefDirective,
    NegTablePaginatorRefDirective,

    NegTableHeaderCellDefDirective,
    NegTableFooterCellDefDirective,
    NegTableCellDefDirective,
    NegTableHeaderCellDirective,
    NegTableCellDirective,
    NegTableFooterCellDirective,

    NegColumnSizeObserver,
    NegCdkVirtualScrollDirective,

    NegTableComponent,
  ]
})
export class NegTableModule {
  static forRoot(config?: NegTableConfig): ModuleWithProviders {
    return {
      ngModule: NegTableModule,
      providers: [
        { provide: NEG_TABLE_CONFIG, useValue: config },
      ]
    };
  }
}
