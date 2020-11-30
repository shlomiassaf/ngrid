import { isPblColumn, isPblMetaColumn, isPblColumnGroup, unrx, getRootElement } from './lib/grid/index';
import './lib/grid/bind-to-datasource'; // LEAVE THIS, WE NEED IT SO THE AUGMENTATION IN THE FILE WILL LOAD.

export {
  PblNgridPaginatorKind,
  PblPaginator,
  PblPagingPaginator,
  PblTokenPaginator,
  PblPaginatorChangeEvent
} from './lib/paginator/index';

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
  PblNgridRowDef, PblNgridRowComponent, PblNgridColumnRowComponent, PblNgridMetaRowComponent,

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

export {
  PblNgridPlugin,
  PblNgridPluginExtension,
  PblNgridOnInitEvent,
  PblNgridOnResizeRowEvent,
  PblNgridOnInvalidateHeadersEvent,
  PblNgridOnDataSourceEvent,
  PblNgridEvents,
 } from './lib/ext/types';

export { EXT_API_TOKEN, PblNgridExtensionApi } from './lib/ext/grid-ext-api';
export { ngridPlugin, NgridPluginMetadata } from './lib/ext/grid-plugin';
export { PblNgridPluginController } from './lib/ext/plugin-control';

export const utils = {
  getRootElement,
  isPblColumn,
  isPblMetaColumn,
  isPblColumnGroup,
  unrx,
};

export { PblNgridModule, provideCommon } from './lib/ngrid.module';
