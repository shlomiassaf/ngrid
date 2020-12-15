// Some symbols in `@pebula/ngrid/core` are also used by "regular" users of ngrid (as opposed to internal/plugin use) so we need to re-export them
// from the main package so "regular" user will not have to specifically address `@pebula/ngrid/core`
export {
  PblNgridPaginatorKind, PblPaginator, PblPaginatorChangeEvent,


} from '@pebula/ngrid/core';

import { isPblColumn, isPblMetaColumn, isPblColumnGroup } from './lib/grid/index';

export {
  PblDataSourceConfigurableTriggers,
  PblDataSourceTriggers,
  PblDataSourceTriggerChange, PblDataSourceTriggerChangedEvent, PblDataSourceTriggerChangedEventSource, PblDataSourceTriggerChangeHandler,
  PblDataSourceAdapter,
  PblDataSource, PblDataSourceOptions,
  PblNgridSortInstructions, PblNgridSortDefinition, PblNgridSorter, applySort, PblNgridSortOrder,
  PblDataSourceBaseFactory, PblDataSourceFactory, createDS, DataSourceOf,
  DataSourceFilterToken, DataSourcePredicate, DataSourceColumnPredicate,
  PblDataSourceAdapterProcessedResult,
} from './lib/data-source/index';

export {
  PEB_NGRID_CONFIG, PblNgridConfig, PblNgridConfigService,

  PblColumn, PblMetaColumn, PblColumnGroup, PblColumnFactory, COLUMN, columnFactory,
  isPblMetaColumn, isPblColumnGroup, isPblColumn,

  GridRowType,
  RowsApi,
  NGRID_CELL_FACTORY,
  PBL_NGRID_ROW_TEMPLATE,
  PblNgridRowDef, PblNgridRowOverride, PblNgridRowComponent, PblNgridColumnRowComponent, PblNgridMetaRowComponent,

  PblNgridComponent,
  PblNgridRegistryService,
  AutoSizeToFitOptions, ColumnApi,

  PblNgridSingleTemplateRegistry, PblNgridMultiTemplateRegistry, PblNgridMultiComponentRegistry,
  PblNgridDataHeaderExtensionRef, PblNgridDataHeaderExtensionContext,
  PblNgridCellDefDirective,
  PblNgridHeaderCellDefDirective,
  PblNgridFooterCellDefDirective,
  PblNgridCellStyling,
  PblNgridNoDataRefDirective,
  PblColumnTypeDefinition, PblColumnTypeDefinitionDataMap,
  PblColumnDefinition,
  PblMetaColumnDefinition,
  PblColumnGroupDefinition,
  PblColumnSet, PblMetaRowDefinitions,
  PblNgridColumnSet, PblNgridColumnDefinitionSet,

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
