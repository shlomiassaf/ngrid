import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, DragDrop } from '@angular/cdk/drag-drop';

import { PblTableModule, provideCommon } from '@pebula/table';

import {
  PblDragDrop,
  CdkLazyDropList, CdkLazyDrag, PblDragHandle,
  PblTableRowReorderPluginDirective, PblTableRowDragDirective,
  PblTableColumnReorderPluginDirective, PblTableColumnDragDirective, PblTableCellDraggerRefDirective,
  PblTableAggregationContainerDirective,
} from './drag-and-drop/index';

import { PblTableDragResizeComponent, PblTableCellResizerRefDirective } from './column-resize/index';

import { DragPluginDefaultTemplatesComponent } from './default-settings.component';

@NgModule({
  imports: [
    CommonModule,
    PblTableModule,
    DragDropModule
  ],
  declarations: [
    DragPluginDefaultTemplatesComponent,
    CdkLazyDropList, CdkLazyDrag, PblDragHandle,
    PblTableRowReorderPluginDirective, PblTableRowDragDirective,
    PblTableColumnReorderPluginDirective, PblTableColumnDragDirective, PblTableCellDraggerRefDirective,
    PblTableAggregationContainerDirective,
    PblTableDragResizeComponent, PblTableCellResizerRefDirective,
  ],
  exports: [
    DragDropModule,
    CdkLazyDropList, CdkLazyDrag, PblDragHandle,
    PblTableRowReorderPluginDirective, PblTableRowDragDirective,
    PblTableColumnReorderPluginDirective, PblTableColumnDragDirective, PblTableCellDraggerRefDirective,
    PblTableAggregationContainerDirective,
    PblTableDragResizeComponent, PblTableCellResizerRefDirective,
  ],
  providers: [
    PblDragDrop,
    { provide: DragDrop, useExisting: PblDragDrop },
  ],
  entryComponents: [ DragPluginDefaultTemplatesComponent ],
})
export class PblTableDragModule {

  static withDefaultTemplates(): ModuleWithProviders {
    return {
      ngModule: PblTableDragModule,
      providers: provideCommon( [ { component: DragPluginDefaultTemplatesComponent } ]),
    };
  }
}
