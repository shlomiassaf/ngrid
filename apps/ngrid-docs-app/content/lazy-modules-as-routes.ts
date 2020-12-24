export const ELEMENT_MODULE_PATHS_AS_ROUTES = [
  {
    path: 'c3c34r2wedcasfawef-seller-demo.module',
    pathMatch: 'full',
    loadChildren: () => import('./demos/seller-demo/seller-demo.module').then( m => m.SellerDemoExampleModule ),
  },
  {
    path: 'c3c34r2wedcasfawef-virtual-scroll-performance-demo.module',
    pathMatch: 'full',
    loadChildren: () => import('./demos/virtual-scroll-performance-demo/virtual-scroll-performance-demo.module').then( m => m.VirtualScrollPerformanceDemoExampleModule ),
  },
  {
    path: 'c3c34r2wedcasfawef-infinite-scroll-performance-demo.module',
    pathMatch: 'full',
    loadChildren: () => import('./demos/infinite-scroll-performance-demo/infinite-scroll-performance-demo.module').then( m => m.InfiniteScrollPerformanceDemoExampleModule ),
  },
  {
    path: 'c3c34r2wedcasfawef-complex-demo1.module',
    pathMatch: 'full',
    loadChildren: () => import('./demos/complex-demo1/complex-demo1.module').then( m => m.ComplexDemo1ExampleModule ),
  },

  {
    path: 'concepts-grid-height.module',
    pathMatch: 'full',
    loadChildren: () => import('./concepts/grid/height-and-scrolling/grid-height/grid-height.module').then( m => m.GridHeightGridExampleModule ),
  },
  {
    path: 'concepts-datasource-simple-model.module',
    pathMatch: 'full',
    loadChildren: () => import('./concepts/datasource/introduction/simple-model/simple-model.module').then( m => m.DatasourceIntroductionSimpleModelExampleModule ),
  },
  {
    path: 'concepts-datasource-working-with-pbl-datasource.module',
    pathMatch: 'full',
    loadChildren: () => import('./concepts/datasource/introduction/working-with-pbl-datasource/working-with-pbl-datasource.module').then( m => m.WorkingWithPblDataSourceExampleModule ),
  },
  {
    path: 'concepts-datasource-enabling-custom-triggers.module',
    pathMatch: 'full',
    loadChildren: () => import('./concepts/datasource/factory/enabling-custom-triggers/enabling-custom-triggers.module').then( m => m.EnablingCustomTriggersExampleModule ),
  },
  {
    path: 'concepts-datasource-manual-trigger.module',
    pathMatch: 'full',
    loadChildren: () => import('./concepts/datasource/factory/manual-trigger/manual-trigger.module').then( m => m.ManualDatasourceTriggerExampleModule ),
  },
  {
    path: 'concepts-columns-simple-model.module',
    pathMatch: 'full',
    loadChildren: () => import('./concepts/columns/column-model/simple-model.module').then( m => m.ColumnsSimpleModelExampleModule ),
  },
  {
    path: 'concepts-columns-factory.module',
    pathMatch: 'full',
    loadChildren: () => import('./concepts/columns/factory/factory.module').then( m => m.ColumnsFactoryExampleModule ),
  },

  {
    path: 'column-hide-columns.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/column/hide-columns/hide-columns.module').then( m => m.HideColumnFeatureExampleModule ),
  },
  {
    path: 'column-width.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/column/width/column-width.module').then( m => m.ColumnWidthFeatureExampleModule ),
  },
  {
    path: 'column-group.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/column/column-group/column-group.module').then( m => m.ColumnGroupExampleModule ),
  },
  {
    path: 'column-filter.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/column/column-filter/column-filter.module').then( m => m.ColumnFilterExampleModule ),
  },
  {
    path: 'column-sort.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/column/column-sort/column-sort.module').then( m => m.ColumnSortExampleModule ),
  },
  {
    path: 'column-cell-edit.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/column/cell-edit/cell-edit.module').then( m => m.CellEditExampleModule ),
  },
  {
    path: 'column-reorder.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/column/column-reorder/column-reorder.module').then( m => m.ColumnReorderExampleModule ),
  },
  {
    path: 'column-switching-column-definitions.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/column/switching-column-definitions/switching-column-definitions.module').then( m => m.SwitchingColumnDefinitionsExampleModule ),
  },
  {
    path: 'column-resize.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/column/column-resize/column-resize.module').then( m => m.ColumnResizeExampleModule ),
  },

  {
    path: 'grid-focus-and-selection.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/grid/focus-and-selection/focus-and-selection.module').then( m => m.FocusAndSelectionExampleModule ),
  },
  {
    path: 'grid-reuse.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/grid/reuse/reuse.module').then( m => m.ReuseExampleModule ),
  },
  {
    path: 'features-grid-row-class.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/grid/row-class/row-class.module').then( m => m.RowClassExampleModule ),
  },
  {
    path: 'grid-row-height.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/grid/row-height/row-height.module').then( m => m.RowHeightExampleModule ),
  },
  {
    path: 'features-grid-row-ordering.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/grid/row-ordering/row-ordering.module').then( m => m.RowOrderingExampleModule ),
  },
  {
    path: 'grid-empty-collection-template.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/grid/empty-collection-template/empty-collection-template.module').then( m => m.EmptyCollectionTemplateExampleModule ),
  },
  {
    path: 'grid-virtual-scroll.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/grid/virtual-scroll/virtual-scroll.module').then( m => m.VirtualScrollExampleModule ),
  },
  {
    path: 'grid-infinite-scroll.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/grid/infinite-scroll/infinite-scroll.module').then( m => m.InfiniteScrollExampleModule ),
  },
  {
    path: 'grid-grid-filler.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/grid/grid-filler/grid-filler.module').then( m => m.GridFillerExampleModule ),
  },

  {
    path: 'built-in-plugins-block-ui.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/built-in-plugins/block-ui/block-ui.module').then( m => m.BlockUiExampleModule ),
  },
  {
    path: 'built-in-plugins-target-events.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/built-in-plugins/target-events/target-events.module').then( m => m.TargetEventsExampleModule ),
  },
  {
    path: 'built-in-plugins-state-persistence.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/built-in-plugins/state-persistence/state-persistence.module').then( m => m.StatePersistenceExampleModule ),
  },
  {
    path: 'built-in-plugins-detail-row.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/built-in-plugins/detail-row/detail-row.module').then( m => m.DetailRowExampleModule ),
  },
  {
    path: 'built-in-plugins-overlay-panel.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/built-in-plugins/overlay-panel/overlay-panel.module').then( m => m.OverlayPanelExampleModule ),
  },
  {
    path: 'built-in-plugins-transpose.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/built-in-plugins/transpose/transpose.module').then( m => m.TransposeExampleModule ),
  },
  {
    path: 'c3c34r2wedcasfawef-sticky.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/built-in-plugins/sticky/sticky.module').then( m => m.StickyExampleModule ),
  },

  {
    path: 'plugins-ngrid-material-cell-tooltip.module',
    pathMatch: 'full',
    loadChildren: () => import('./plugins/ngrid-material/cell-tooltip/cell-tooltip.module').then( m => m.CellTooltipExampleModule ),
  },
  {
    path: 'plugins-ngrid-material-selection-column.module',
    pathMatch: 'full',
    loadChildren: () => import('./plugins/ngrid-material/selection-column/selection-column.module').then( m => m.SelectionColumnExampleModule ),
  },
  {
    path: 'plugins-ngrid-material-mat-sort.module',
    pathMatch: 'full',
    loadChildren: () => import('./plugins/ngrid-material/mat-sort/mat-sort.module').then( m => m.MatSortExampleModule ),
  },
  {
    path: 'plugins-ngrid-material-pagination.module',
    pathMatch: 'full',
    loadChildren: () => import('./plugins/ngrid-material/pagination/pagination.module').then( m => m.PaginationExampleModule ),
  },
  {
    path: 'plugins-ngrid-material-context-menu.module',
    pathMatch: 'full',
    loadChildren: () => import('./plugins/ngrid-material/context-menu/context-menu.module').then( m => m.ContextMenuExampleModule ),
  },

  {
    path: 'stories-action-row.module',
    pathMatch: 'full',
    loadChildren: () => import('./stories/action-row/action-row.module').then( m => m.ActionRowExampleModule ),
  },
  {
    path: 'stories-multi-column-filter.module',
    pathMatch: 'full',
    loadChildren: () => import('./stories/multi-column-filter/multi-column-filter.module').then( m => m.MultiColumnFilterExampleModule ),
  },
  {
    path: 'stories-column-header-menu.module',
    pathMatch: 'full',
    loadChildren: () => import('./stories/column-header-menu/column-header-menu.module').then( m => m.ColumnHeaderMenuExampleModule ),
  },
  {
    path: 'extending-ngrid-copy-selection.module',
    pathMatch: 'full',
    loadChildren: () => import('./extending-ngrid/copy-selection/copy-selection.module').then( m => m.CopySelectionExampleModule ),
  },
  {
    path: 'features-built-in-plugins-drag.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/built-in-plugins/drag/drag.module').then( m => m.DragExampleModule ),
  },
  {
    path: 'features-built-in-plugins-drag-drop-container.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/built-in-plugins/drag/drop-container/drop-container.module').then( m => m.DropContainerExampleModule ),
  },
  {
    path: 'concepts-context-context-example.module',
    pathMatch: 'full',
    loadChildren: () => import('./concepts/context/context-example/context-example.module').then( m => m.ContextExampleExampleModule ),
  },
  {
    path: 'features-grid-rtl-support.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/grid/rtl-support/rtl-support.module').then( m => m.RtlSupportExampleModule ),
  },
  {
    path: 'features-grid-virtual-scroll-strategies.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/grid/virtual-scroll/strategies/strategies.module').then( m => m.StrategiesExampleModule ),
  },
  {
    path: 'features-grid-custom-row.module',
    pathMatch: 'full',
    loadChildren: () => import('./features/grid/custom-row/custom-row.module').then( m => m.CustomRowExampleModule ),
  },
  {
    path: 'plugins-ngrid-bootstrap-cell-tooltip.module',
    pathMatch: 'full',
    loadChildren: () => import('./plugins/ngrid-bootstrap/cell-tooltip/cell-tooltip.module').then( m => m.CellTooltipExampleModule ),
  },
  {
    path: 'plugins-ngrid-bootstrap-sort-header.module',
    pathMatch: 'full',
    loadChildren: () => import('./plugins/ngrid-bootstrap/sort-header/sort-header.module').then( m => m.SortHeaderExampleModule ),
  },
  {
    path: 'plugins-ngrid-bootstrap-pagination.module',
    pathMatch: 'full',
    loadChildren: () => import('./plugins/ngrid-bootstrap/pagination/pagination.module').then( m => m.PaginationExampleModule ),
  },
  {
    path: 'concepts-theming-spacing.module',
    pathMatch: 'full',
    loadChildren: () => import('./concepts/theming/spacing/spacing.module').then( m => m.SpacingExampleModule ),
  }
];
