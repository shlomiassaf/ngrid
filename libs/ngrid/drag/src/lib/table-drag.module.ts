import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { PblNgridModule, provideCommon, ngridPlugin } from '@pebula/ngrid';

import {
  colReorderExtendGrid,
  PblNgridAggregationContainerDirective,
  PblNgridCellDraggerRefDirective,
  PblNgridColumnDragDirective,
  PblNgridColumnDropContainerDirective,
  COL_DRAG_CONTAINER_PLUGIN_KEY, PblNgridColumnDragContainerDirective,
  COL_REORDER_PLUGIN_KEY, PblNgridColumnReorderPluginDirective,
} from './drag-and-drop/column';

import {
  CdkLazyDropList,
  CdkLazyDrag,
  PblDragHandle
} from './drag-and-drop/core/index';

import { PblNgridRowReorderPluginDirective, PblNgridRowDragDirective, ROW_REORDER_PLUGIN_KEY } from './drag-and-drop/row/index';

import { PblNgridDragResizeComponent, COL_RESIZE_PLUGIN_KEY } from './column-resize/column-resize.component';
import { PblNgridCellResizerRefDirective } from './column-resize/cell-resizer-ref';
import { colResizeExtendGrid } from './column-resize/extend-grid';

import { DragPluginDefaultTemplatesComponent } from './default-settings.component';

export function ngridPlugins() {
  return [
    ngridPlugin({ id: ROW_REORDER_PLUGIN_KEY }, PblNgridRowReorderPluginDirective),
    ngridPlugin({ id: COL_DRAG_CONTAINER_PLUGIN_KEY }, PblNgridColumnDragContainerDirective),
    ngridPlugin({ id: COL_REORDER_PLUGIN_KEY, runOnce: colReorderExtendGrid }, PblNgridColumnReorderPluginDirective),
    ngridPlugin({ id: COL_RESIZE_PLUGIN_KEY, runOnce: colResizeExtendGrid }, PblNgridDragResizeComponent),
  ]
}

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
    PblNgridColumnDragContainerDirective,
    PblNgridColumnDropContainerDirective, PblNgridColumnReorderPluginDirective, PblNgridColumnDragDirective, PblNgridCellDraggerRefDirective,
    PblNgridAggregationContainerDirective,
    PblNgridDragResizeComponent, PblNgridCellResizerRefDirective,
  ],
  exports: [
    DragDropModule,
    CdkLazyDropList, CdkLazyDrag, PblDragHandle,
    PblNgridRowReorderPluginDirective, PblNgridRowDragDirective,
    PblNgridColumnDragContainerDirective,
    PblNgridColumnDropContainerDirective, PblNgridColumnReorderPluginDirective, PblNgridColumnDragDirective, PblNgridCellDraggerRefDirective,
    PblNgridAggregationContainerDirective,
    PblNgridDragResizeComponent, PblNgridCellResizerRefDirective,
  ],
  // TODO: remove when ViewEngine is no longer supported by angular (V11 ???)
  entryComponents: [ DragPluginDefaultTemplatesComponent ]
})
export class PblNgridDragModule {

  static readonly NGRID_PLUGIN = ngridPlugins();

  static withDefaultTemplates(): ModuleWithProviders<PblNgridDragModule> {
    return {
      ngModule: PblNgridDragModule,
      providers: provideCommon( [ { component: DragPluginDefaultTemplatesComponent } ]),
    };
  }
}
