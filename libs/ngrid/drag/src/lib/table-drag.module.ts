import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { PblNgridModule, provideCommon, ngridPlugin } from '@pebula/ngrid';

import { CdkLazyDropList, CdkLazyDrag, PblDragHandle } from './drag-and-drop/core/lazy-drag-drop';
import { PblNgridRowReorderPluginDirective, PblNgridRowDragDirective, ROW_REORDER_PLUGIN_KEY } from './drag-and-drop/row/row-reorder-plugin';
import { PblNgridColumnReorderPluginDirective, PblNgridColumnDragDirective, COL_REORDER_PLUGIN_KEY } from './drag-and-drop/column/column-reorder-plugin';
import { PblNgridCellDraggerRefDirective } from './drag-and-drop/column/cell-dragger-ref';
import { colReorderExtendGrid } from './drag-and-drop/column/extend-grid';

import { PblNgridAggregationContainerDirective } from './drag-and-drop/column/aggregation-column';

import { PblNgridDragResizeComponent, COL_RESIZE_PLUGIN_KEY } from './column-resize/column-resize.component';
import { PblNgridCellResizerRefDirective } from './column-resize/cell-resizer-ref';
import { colResizeExtendGrid } from './column-resize/extend-grid';

import { DragPluginDefaultTemplatesComponent } from './default-settings.component';

export function ngridPlugins() {
  return [
    ngridPlugin({ id: ROW_REORDER_PLUGIN_KEY }, PblNgridRowReorderPluginDirective),
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

  static readonly NGRID_PLUGIN = ngridPlugins();

  static withDefaultTemplates(): ModuleWithProviders<PblNgridDragModule> {
    return {
      ngModule: PblNgridDragModule,
      providers: provideCommon( [ { component: DragPluginDefaultTemplatesComponent } ]),
    };
  }
}
