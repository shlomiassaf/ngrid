/* LEAVE THIS, WE NEED IT SO THE AUGMENTATION IN THE FILE WILL LOAD. */
import './lib/grid/bind-grid-to-datasource';
import { isPblColumn, isPblMetaColumn, isPblColumnGroup } from './lib/grid/index';

/* Some symbols in `@pebula/ngrid/core` are also used by "regular" users of ngrid (as opposed to internal/plugin use) so we need to re-export them
   from the main package so "regular" user will not have to specifically address `@pebula/ngrid/core` */
export {
  // Configuration
  PEB_NGRID_CONFIG, PblNgridConfig, PblNgridConfigService,

  // Pagination
  PblNgridPaginatorKind, PblPaginator, PblPaginatorChangeEvent,

  // Data Source
  PblDataSourceConfigurableTriggers,
  PblDataSourceTriggers,
  PblDataSourceTriggerChange, PblDataSourceTriggerChangedEvent, PblDataSourceTriggerChangedEventSource, PblDataSourceTriggerChangeHandler,
  PblDataSourceAdapter,
  PblDataSource, PblDataSourceOptions,
  PblNgridSortInstructions, PblNgridSortDefinition, PblNgridSorter, PblNgridSortOrder,
  PblDataSourceBaseFactory, PblDataSourceFactory, DataSourceOf,
  DataSourceFilterToken, DataSourcePredicate, DataSourceColumnPredicate,
  PblDataSourceAdapterProcessedResult,
  createDS, applySort,

  // Models: Column
  PblColumnTypeDefinitionDataMap,
  PblColumnTypeDefinition,
  PblColumnDefinition,
  PblMetaColumnDefinition,
  PblColumnGroupDefinition,
  PblColumnSet,
  PblMetaRowDefinitions,
  PblNgridColumnDefinitionSet,
} from '@pebula/ngrid/core';

export {
  PblColumn, PblMetaColumn, PblColumnGroup, PblColumnFactory, COLUMN, columnFactory,
  isPblMetaColumn, isPblColumnGroup, isPblColumn,

  GridRowType,
  RowsApi,
  NGRID_CELL_FACTORY,
  PBL_NGRID_ROW_TEMPLATE,
  PblNgridRowDef, PblNgridRowOverride, PblNgridRowComponent, PblNgridColumnRowComponent, PblNgridMetaRowComponent,

  PblNgridComponent,
  AutoSizeToFitOptions, ColumnApi,

  PblNgridSingleTemplateRegistry, PblNgridMultiTemplateRegistry, PblNgridMultiComponentRegistry,
  PblNgridDataHeaderExtensionRef, PblNgridDataHeaderExtensionContext,
  PblNgridCellDefDirective,
  PblNgridHeaderCellDefDirective,
  PblNgridFooterCellDefDirective,
  PblNgridCellStyling,
  PblNgridNoDataRefDirective,
  PblNgridColumnSet,

  DISABLE_INTERSECTION_OBSERVABLE,
  PblNgridVirtualScrollStrategy, PblNgridBaseVirtualScrollDirective,
  NoVirtualScrollStrategy, PblNgridDynamicVirtualScrollStrategy,
  // TODO: Move to an independent package in v4
  PblNgridFixedSizeVirtualScrollStrategy, PblNgridAutoSizeVirtualScrollStrategy,

  PblNgridFocusChangedEvent, PblNgridSelectionChangedEvent,
  PblNgridMetaCellContext, PblNgridCellContext, PblNgridRowContext, PblRowContext, PblNgridContextApi,
  CellReference, GridDataPoint,
} from './lib/grid/index';

export { PblNgridPlugin, PblNgridPluginExtension } from './lib/ext/types';

export { EXT_API_TOKEN, PblNgridExtensionApi } from './lib/ext/grid-ext-api';
export { ngridPlugin, NgridPluginMetadata } from './lib/ext/grid-plugin';
export { PblNgridPluginController } from './lib/ext/plugin-control';

export const utils = {
  isPblColumn,
  isPblMetaColumn,
  isPblColumnGroup,
};

export { PblNgridModule, provideCommon } from './lib/ngrid.module';
