import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridHeightGridExampleModule } from './concepts/grid/grid-height/grid-height.module';

import { DatasourceIntroductionSimpleModelExampleModule} from './concepts/datasource/simple-model/simple-model.module';
import { WorkingWithPblDataSourceExampleModule } from './concepts/datasource/working-with-pbl-datasource/working-with-pbl-datasource.module';
import { EnablingCustomTriggersExampleModule } from './concepts/datasource/enabling-custom-triggers/enabling-custom-triggers.module';
import { ManualDatasourceTriggerExampleModule } from './concepts/datasource/manual-trigger/manual-trigger.module';

import { ColumnsSimpleModelExampleModule} from './concepts/columns/simple-model/simple-model.module';
import { ColumnsFactoryExampleModule } from './concepts/columns/factory/factory.module';

import { HideColumnFeatureExampleModule } from './features/column/hide-columns/hide-columns.module';
import { ColumnWidthFeatureExampleModule } from './features/column/width/column-width.module';
import { ColumnGroupExampleModule } from './features/column/column-group/column-group.module';
import { ColumnFilterExampleModule } from './features/column/column-filter/column-filter.module';
import { ColumnSortExampleModule } from './features/column/column-sort/column-sort.module';
import { CellEditExampleModule } from './features/column/cell-edit/cell-edit.module';
import { ColumnReorderExampleModule } from './features/column/column-reorder/column-reorder.module';
import { SwitchingColumnDefinitionsExampleModule } from './features/column/switching-column-definitions/switching-column-definitions.module';
import { FocusAndSelectionExampleModule } from './features/grid/focus-and-selection/focus-and-selection.module';
import { ReuseExampleModule } from './features/grid/reuse/reuse.module';
import { RowHeightExampleModule } from './features/grid/row-height/row-height.module';
import { EmptyCollectionTemplateExampleModule } from './features/grid/empty-collection-template/empty-collection-template.module';
import { VirtualScrollExampleModule } from './features/grid/virtual-scroll/virtual-scroll.module';
import { GridFillerExampleModule } from './features/grid/grid-filler/grid-filler.module';
import { TargetEventsExampleModule } from './features/built-in-plugins/target-events/target-events.module';
import { StatePersistenceExampleModule } from './features/built-in-plugins/state-persistence/state-persistence.module';
import { DetailRowExampleModule } from './features/built-in-plugins/detail-row/detail-row.module';
import { OverlayPanelExampleModule } from './features/built-in-plugins/overlay-panel/overlay-panel.module';
import { BlockUiExampleModule } from './features/built-in-plugins/block-ui/block-ui.module';
import { TransposeExampleModule } from './features/built-in-plugins/transpose/transpose.module';
import { StickyExampleModule } from './features/built-in-plugins/sticky/sticky.module';
import { ActionRowExampleModule } from './stories/action-row/action-row.module';
import { MultiColumnFilterExampleModule } from './stories/multi-column-filter/multi-column-filter.module';
import { ColumnHeaderMenuExampleModule } from './stories/column-header-menu/column-header-menu.module';
import { CellTooltipExampleModule } from './plugins/ngrid-material/cell-tooltip/cell-tooltip.module';
import { SelectionColumnExampleModule } from './plugins/ngrid-material/selection-column/selection-column.module';
import { MatSortExampleModule } from './plugins/ngrid-material/mat-sort/mat-sort.module';
import { PaginationExampleModule } from './plugins/ngrid-material/pagination/pagination.module';
import { ContextMenuExampleModule } from './plugins/ngrid-material/context-menu/context-menu.module';
import { ColumnResizeExampleModule } from './features/column/column-resize/column-resize.module';
import { SellerDemoExampleModule } from './demos/seller-demo/seller-demo.module';
import { VirtualScrollPerformanceDemoExampleModule } from './demos/virtual-scroll-performance-demo/virtual-scroll-performance-demo.module';
import { ComplexDemo1ExampleModule } from './demos/complex-demo1/complex-demo1.module';

@NgModule({
  imports: [
    CommonModule,
    GridHeightGridExampleModule,

    DatasourceIntroductionSimpleModelExampleModule,
    WorkingWithPblDataSourceExampleModule,
    EnablingCustomTriggersExampleModule,
    ManualDatasourceTriggerExampleModule,

    ColumnsSimpleModelExampleModule,
    ColumnsFactoryExampleModule,

    HideColumnFeatureExampleModule,
    ColumnWidthFeatureExampleModule,
    ColumnGroupExampleModule,
    ColumnFilterExampleModule,
    ColumnSortExampleModule,
    CellEditExampleModule,
    ColumnReorderExampleModule,
    SwitchingColumnDefinitionsExampleModule,
    FocusAndSelectionExampleModule,
    ReuseExampleModule,
    RowHeightExampleModule,
    EmptyCollectionTemplateExampleModule,
    VirtualScrollExampleModule,
    GridFillerExampleModule,
    TargetEventsExampleModule,
    StatePersistenceExampleModule,
    DetailRowExampleModule,
    OverlayPanelExampleModule,
    BlockUiExampleModule,
    TransposeExampleModule,
    StickyExampleModule,
    ActionRowExampleModule,
    MultiColumnFilterExampleModule,
    ColumnHeaderMenuExampleModule,
    CellTooltipExampleModule,
    SelectionColumnExampleModule,
    MatSortExampleModule,
    PaginationExampleModule,
    ContextMenuExampleModule,
    ColumnResizeExampleModule,
    SellerDemoExampleModule,
    VirtualScrollPerformanceDemoExampleModule,
    ComplexDemo1ExampleModule,
  ]
})
export class ExampleModule { }
