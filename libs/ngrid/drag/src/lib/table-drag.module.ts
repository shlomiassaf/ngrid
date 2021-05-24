import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { PblNgridModule, provideCommon, ngridPlugin } from '@pebula/ngrid';

import './drag-and-drop/column/extend-grid'; // to make sure d.ts stay in published lib and so agumentation kicks in
import { colReorderExtendGrid } from './drag-and-drop/column/extend-grid'
import { PblNgridAggregationContainerDirective } from './drag-and-drop/column/aggregation-column'
import { PblNgridCellDraggerRefDirective } from './drag-and-drop/column/cell-dragger-ref'
import { PblNgridColumnDragDirective } from './drag-and-drop/column/column-drag'
import { PblNgridColumnDropContainerDirective } from './drag-and-drop/column/column-drop-container'
import { PblNgridColumnDragContainerDirective, COL_DRAG_CONTAINER_PLUGIN_KEY } from './drag-and-drop/column/column-drag-container'
import { PblNgridColumnReorderPluginDirective, COL_REORDER_PLUGIN_KEY } from './drag-and-drop/column/column-reorder-plugin'

import { CdkLazyDropList } from './drag-and-drop/core/drop-list';
import { CdkLazyDrag } from './drag-and-drop/core/drag';
import { PblDragHandle } from './drag-and-drop/core/drag-handle';

import { PblNgridRowReorderPluginDirective, ROW_REORDER_PLUGIN_KEY } from './drag-and-drop/row/row-reorder-plugin';
import { PblNgridRowDragDirective } from './drag-and-drop/row/row-drag';

import { PblNgridDragResizeComponent, COL_RESIZE_PLUGIN_KEY } from './column-resize/column-resize.component';
import { PblNgridCellResizerRefDirective } from './column-resize/cell-resizer-ref';
import './column-resize/extend-grid'; // to make sure d.ts stay in published lib and so agumentation kicks in
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
  // TODO(REFACTOR_REF 2): remove when ViewEngine is no longer supported by angular (V12 ???)
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
