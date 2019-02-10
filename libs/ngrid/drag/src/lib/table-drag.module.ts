import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, DragDrop } from '@angular/cdk/drag-drop';

import { PblNgridModule, provideCommon } from '@pebula/ngrid';

import {
  PblDragDrop,
  CdkLazyDropList, CdkLazyDrag, PblDragHandle,
  PblNgridRowReorderPluginDirective, PblNgridRowDragDirective,
  PblNgridColumnReorderPluginDirective, PblNgridColumnDragDirective, PblNgridCellDraggerRefDirective,
  PblNgridAggregationContainerDirective,
} from './drag-and-drop/index';

import { PblNgridDragResizeComponent, PblNgridCellResizerRefDirective } from './column-resize/index';

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
  providers: [
    PblDragDrop,
    { provide: DragDrop, useExisting: PblDragDrop },
  ],
  entryComponents: [ DragPluginDefaultTemplatesComponent ],
})
export class PblNgridDragModule {

  static withDefaultTemplates(): ModuleWithProviders {
    return {
      ngModule: PblNgridDragModule,
      providers: provideCommon( [ { component: DragPluginDefaultTemplatesComponent } ]),
    };
  }
}
