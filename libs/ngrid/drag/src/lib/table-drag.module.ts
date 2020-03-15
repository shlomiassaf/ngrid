import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, DragDrop } from '@angular/cdk/drag-drop';

import { PblNgridModule, provideCommon } from '@pebula/ngrid';

import { CdkLazyDropList, CdkLazyDrag, PblDragHandle } from './drag-and-drop/core/lazy-drag-drop';
import { PblNgridRowReorderPluginDirective, PblNgridRowDragDirective } from './drag-and-drop/row/row-reorder-plugin';
import { PblNgridColumnReorderPluginDirective, PblNgridColumnDragDirective } from './drag-and-drop/column/column-reorder-plugin';
import { PblNgridCellDraggerRefDirective } from './drag-and-drop/column/cell-dragger-ref';
import { PblNgridAggregationContainerDirective } from './drag-and-drop/column/aggregation-column';

import { PblNgridDragResizeComponent } from './column-resize/column-resize.component';
import { PblNgridCellResizerRefDirective } from './column-resize/cell-resizer-ref';

import { DragPluginDefaultTemplatesComponent } from './default-settings.component';

@NgModule({
  imports: [
    CommonModule,
    PblNgridModule,
    DragDropModule
  ],
  declarations: [
    DragPluginDefaultTemplatesComponent,
    CdkLazyDropList, CdkLazyDrag, PblDragHandle,
    PblNgridRowReorderPluginDirective, PblNgridRowDragDirective,
    PblNgridColumnReorderPluginDirective, PblNgridColumnDragDirective, PblNgridCellDraggerRefDirective,
    PblNgridAggregationContainerDirective,
    PblNgridDragResizeComponent, PblNgridCellResizerRefDirective,
  ],
  exports: [
    DragDropModule,
    CdkLazyDropList, CdkLazyDrag, PblDragHandle,
    PblNgridRowReorderPluginDirective, PblNgridRowDragDirective,
    PblNgridColumnReorderPluginDirective, PblNgridColumnDragDirective, PblNgridCellDraggerRefDirective,
    PblNgridAggregationContainerDirective,
    PblNgridDragResizeComponent, PblNgridCellResizerRefDirective,
  ],
  // TODO: remove when ViewEngine is no longer supported by angular (V11 ???)
  entryComponents: [ DragPluginDefaultTemplatesComponent ]
})
export class PblNgridDragModule {

  static withDefaultTemplates(): ModuleWithProviders<PblNgridDragModule> {
    return {
      ngModule: PblNgridDragModule,
      providers: provideCommon( [ { component: DragPluginDefaultTemplatesComponent } ]),
    };
  }
}
