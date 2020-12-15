import { asapScheduler, animationFrameScheduler, fromEventPattern } from 'rxjs';
import { filter, take, tap, observeOn, switchMap, map, mapTo, startWith, pairwise, debounceTime, skip } from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  Injector,
  ChangeDetectionStrategy,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterContentInit,
  ViewEncapsulation,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ChangeDetectorRef,
  TemplateRef,
  ViewContainerRef,
  EmbeddedViewRef,
  NgZone,
  isDevMode, forwardRef, Attribute, Optional,
} from '@angular/core';

import { Direction, Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { CdkHeaderRowDef, CdkFooterRowDef, CdkRowDef } from '@angular/cdk/table';

import { PblNgridPaginatorKind, unrx } from '@pebula/ngrid/core';

import { EXT_API_TOKEN, PblNgridExtensionApi, PblNgridInternalExtensionApi } from '../ext/grid-ext-api';
import { PblNgridPluginController, PblNgridPluginContext } from '../ext/plugin-control';
import { DataSourcePredicate, DataSourceFilterToken, PblNgridSortDefinition, PblDataSource, DataSourceOf, createDS, PblNgridOnDataSourceEvent } from '../data-source/index';
import { resetColumnWidths } from './utils/width';
import { PblCdkTableComponent } from './pbl-cdk-table/pbl-cdk-table.component';
import { PblColumn, PblNgridColumnSet, PblNgridColumnDefinitionSet } from './column/model';
import { PblColumnStore, ColumnApi, AutoSizeToFitOptions } from './column/management';
import { PblNgridCellContext, PblNgridMetaCellContext, PblNgridContextApi, PblNgridRowContext } from './context/index';
import { PblNgridRegistryService } from './registry/registry.service';
import { PblNgridConfigService } from './services/config';
import { DynamicColumnWidthLogic } from './column/width-logic/dynamic-column-width';
import { PblCdkVirtualScrollViewportComponent } from './features/virtual-scroll/virtual-scroll-viewport.component';
import { PblNgridMetaRowService } from './meta-rows/meta-row.service';

import { RowsApi } from './row';
import { createApis } from './api-factory';

export function internalApiFactory(grid: { _extApi: PblNgridExtensionApi; }) { return grid._extApi; }
export function pluginControllerFactory(grid: { _plugin: PblNgridPluginContext; }) { return grid._plugin.controller; }
export function metaRowServiceFactory(grid: { _extApi: PblNgridExtensionApi; }) { return grid._extApi.metaRowService; }

declare module '../ext/types' {
  interface OnPropChangedSources {
    grid: PblNgridComponent;
  }
  interface OnPropChangedProperties {
    grid: Pick<PblNgridComponent, 'showFooter' | 'showHeader' | 'rowClassUpdate' | 'rowClassUpdateFreq'>;
  }
}

@Component({
  selector: 'pbl-ngrid',
  templateUrl: './ngrid.component.html',
  styleUrls: [ './ngrid.component.scss' ],
  providers: [
    PblNgridRegistryService,
    {
      provide: PblNgridPluginController,
      useFactory: pluginControllerFactory,
      deps: [forwardRef(() => PblNgridComponent)],
    },
    {
      provide: EXT_API_TOKEN,
      useFactory: internalApiFactory,
      deps: [forwardRef(() => PblNgridComponent)],
    },
    {
      provide: PblNgridMetaRowService,
      useFactory: metaRowServiceFactory,
      deps: [forwardRef(() => PblNgridComponent)],
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PblNgridComponent<T = any> implements AfterContentInit, AfterViewInit, OnChanges, OnDestroy {

  /**
   * Show/Hide the header row.
   * Default: true
   */
  @Input() get showHeader(): boolean { return this._showHeader; };
  set showHeader(value: boolean) {
    this._extApi.notifyPropChanged(this, 'showHeader', this._showHeader, this._showHeader = coerceBooleanProperty(value));
  }
  _showHeader: boolean;

  /**
   * Show/Hide the footer row.
   * Default: false
   */
  @Input() get showFooter(): boolean { return this._showFooter; };
  set showFooter(value: boolean) {
    this._extApi.notifyPropChanged(this, 'showFooter', this._showFooter, this._showFooter = coerceBooleanProperty(value));
  }
  _showFooter: boolean;

  /**
   * When true, the filler is disabled.
   */
  @Input() get noFiller(): boolean { return this._noFiller; };
  set noFiller(value: boolean) {
    this._noFiller = coerceBooleanProperty(value);
  }
  _noFiller: boolean;

  /**
   * Set's the behavior of the grid when tabbing.
   * The default behavior is none (rows and cells are not focusable)
   *
   * Note that the focus mode has an effect on other functions, for example a detail row will toggle (open/close) using
   * ENTER / SPACE only when focusMode is set to `row`.
   */
  @Input() focusMode: 'row' | 'cell' | 'none' | '' | false | undefined;

  /**
   * The grid's source of data
   *
   * @remarks
   * The grid's source of data, which can be provided in 2 ways:
   *
   * - DataSourceOf<T>
   * - PblDataSource<T>
   *
   * The grid only works with `PblDataSource<T>`, `DataSourceOf<T>` is a shortcut for providing
   * the data array directly.
   *
   * `DataSourceOf<T>` can be:
   *
   * - Simple data array (each object represents one grid row)
   * - Promise for a data array
   * - Stream that emits a data array each time the array changes
   *
   * When a `DataSourceOf<T>` is provided it is converted into an instance of `PblDataSource<T>`.
   *
   * To access the `PblDataSource<T>` instance use the `ds` property (readonly).
   *
   * It is highly recommended to use `PblDataSource<T>` directly, the datasource factory makes it easy.
   * For example, when an array is provided the factory is used to convert it to a datasource:
   *
   * ```typescript
   * const collection: T[] = [];
   * const pblDataSource = createDS<T>().onTrigger( () => collection ).create();
   * ```
   *
   * > This is a write-only (setter) property that triggers the `setDataSource` method.
   */
  @Input() set dataSource(value: PblDataSource<T> | DataSourceOf<T>) {
    if (value instanceof PblDataSource) {
      this.setDataSource(value);
    } else {
      this.setDataSource(createDS<T>().onTrigger( () => value || [] ).create());
    }
  }

  get ds(): PblDataSource<T> { return this._dataSource; };

  @Input() get usePagination(): PblNgridPaginatorKind | false { return this._pagination; }
  set usePagination(value: PblNgridPaginatorKind | false) {
    if ((value as any) === '') {
      value = 'pageNumber';
    }
    if ( value !== this._pagination ) {
      this._pagination = value;
      this.setupPaginator();
    }
  }

  @Input() get noCachePaginator(): boolean { return this._noCachePaginator; }
  set noCachePaginator(value: boolean) {
    value = coerceBooleanProperty(value);
    if (this._noCachePaginator !== value) {
      this._noCachePaginator = value;
      if (this.ds && this.ds.paginator) {
        this.ds.paginator.noCacheMode = value;
      }
    }
  }

  /**
   * The column definitions for this grid.
   */
  @Input() columns: PblNgridColumnSet | PblNgridColumnDefinitionSet;

  @Input() rowClassUpdate: undefined | ( (context: PblNgridRowContext<T>) => ( string | string[] | Set<string> | { [klass: string]: any } ));
  @Input() rowClassUpdateFreq: 'item' | 'ngDoCheck' | 'none' = 'item';

  rowFocus: 0 | '' = '';
  cellFocus: 0 | '' = '';

  /**
   * The minimum height to assign to the data viewport (where data rows are shown)
   *
   * The data viewport is the scrollable area where all data rows are visible, and some metadata rows might also be there
   * depending on their type (fixed/row/sticky) as well as outer section items.
   *
   * By default, the data viewport has no size and it will grow based on the available space it has left within the container.
   * The container will first assign height to any fixed rows and dynamic content (before/after) provided.
   *
   * If the container height is fixed (e.g. `<pbl-ngrid style="height: 500px"></pbl-ngrid>`) and there is no height left
   * for the data viewport then it will get no height (0 height).
   *
   * To deal with this issue there are 2 options:
   *
   * 1. Do not limit the height of the container
   * 2. Provide a default minimum height for the data viewport
   *
   * Option number 1 is not practical, it will disable all scrolling in the table, making it a long box scrollable by the host container.
   *
   * This is where we use option number 2.
   * By defining a default minimum height we ensure visibility and since there's a scroll there, the user can view all of the data.
   *
   * There are 2 types of inputs:
   *
   * A. Default minimum height in PX
   * B. Default minimum height in ROW COUNT
   *
   * For A, provide a positive value, for B provide a negative value.
   *
   * For example:
   *
   *  - Minimum data viewport of 100 pixels: `<pbl-ngrid minDataViewHeight="100"></pbl-ngrid>`
   *  - Minimum data viewport of 2 ros: `<pbl-ngrid minDataViewHeight="-2"></pbl-ngrid>`
   *
   * Notes when using rows:
   *  - The row height is calculated based on an initial row pre-loaded by the grid, this row will get it's height from the CSS theme defined.
   *  - The ROW COUNT is the lower value between the actual row count provided and the total rows to render.
   *
   * ## Container Overflow:
   *
   * Note that when using a default minimum height, if the minimum height of the data viewport PLUS the height of all other elements in the container EXCEEDS any fixed
   * height assigned to the container, the container will render a scrollbar which results in the possibility of 2 scrollbars, 1 for the container and the seconds
   * for the data viewport, if it has enough data rows.
   */
  @Input() get minDataViewHeight(): number { return this.minDataViewHeight; }
  set minDataViewHeight(value: number) {
    value = coerceNumberProperty(value);
    if (this._minDataViewHeight !== value) {
      this._minDataViewHeight = value;
    }
  }

  /**
   * @deprecated see `minDataViewHeight`
   */
  // TODO: remove in v4.0.0
  @Input() get fallbackMinHeight(): number { return this._minDataViewHeight > 0 ? this._minDataViewHeight : undefined; }
  set fallbackMinHeight(value: number) { this.minDataViewHeight = value; }

  get dir(): Direction { return this._dir };

  private _dir: Direction = 'ltr';
  private _minDataViewHeight = 0;
  private _dataSource: PblDataSource<T>;

  @ViewChild('beforeTable', { read: ViewContainerRef, static: true }) _vcRefBeforeTable: ViewContainerRef;
  @ViewChild('beforeContent', { read: ViewContainerRef, static: true }) _vcRefBeforeContent: ViewContainerRef;
  @ViewChild('afterContent', { read: ViewContainerRef, static: true }) _vcRefAfterContent: ViewContainerRef;
  @ViewChild('fbTableCell', { read: TemplateRef, static: true }) _fbTableCell: TemplateRef<PblNgridCellContext<T>>;
  @ViewChild('fbHeaderCell', { read: TemplateRef, static: true }) _fbHeaderCell: TemplateRef<PblNgridMetaCellContext<T>>;
  @ViewChild('fbFooterCell', { read: TemplateRef, static: true }) _fbFooterCell: TemplateRef<PblNgridMetaCellContext<T>>;
  @ViewChild(CdkRowDef, { static: true }) _tableRowDef: CdkRowDef<T>;
  @ViewChildren(CdkHeaderRowDef) _headerRowDefs: QueryList<CdkHeaderRowDef>;
  @ViewChildren(CdkFooterRowDef) _footerRowDefs: QueryList<CdkFooterRowDef>;

  /**
   * When true, the virtual paging feature is enabled because the virtual content size exceed the supported height of the browser so paging is enable.
   */
  get virtualPagingActive() { return this.viewport.virtualPagingActive; }

  get metaHeaderRows() { return this._store.metaHeaderRows; }
  get metaFooterRows() { return this._store.metaFooterRows; }
  get metaColumns(): PblColumnStore['metaColumns'] { return this._store.metaColumns; }
  get columnRowDef() { return { header: this._store.headerColumnDef, footer: this._store.footerColumnDef }; }
  /**
   * True when the component is initialized (after AfterViewInit)
   */
  readonly isInit: boolean;
  readonly columnApi: ColumnApi<T>;
  readonly rowsApi: RowsApi<T>;
  readonly contextApi: PblNgridContextApi<T>;

  get viewport() { return this._viewport; }
  get innerTableMinWidth() { return this._cdkTable?.minWidth }

  private _store: PblColumnStore;
  private _noDateEmbeddedVRef: EmbeddedViewRef<any>;
  private _paginatorEmbeddedVRef: EmbeddedViewRef<any>;
  private _pagination: PblNgridPaginatorKind | false;
  private _noCachePaginator = false;
  private _plugin: PblNgridPluginContext;
  private _extApi: PblNgridInternalExtensionApi<T>;
  private _cdkTable: PblCdkTableComponent<T>;
  private _viewport: PblCdkVirtualScrollViewportComponent;

  constructor(injector: Injector,
              vcRef: ViewContainerRef,
              private elRef: ElementRef<HTMLElement>,
              private ngZone: NgZone,
              private cdr: ChangeDetectorRef,
              private config: PblNgridConfigService,
              public registry: PblNgridRegistryService,
              @Attribute('id') public readonly id: string,
              @Optional() dir?: Directionality) {
    this._extApi = createApis(this, { config, ngZone, injector, vcRef, elRef, cdRef: cdr, dir });

    dir?.change
      .pipe(
        unrx(this, 'dir'),
        startWith(dir.value)
      )
      .subscribe(value => this._dir = value);

    const gridConfig = config.get('table');
    this.showHeader = gridConfig.showHeader;
    this.showFooter = gridConfig.showFooter;
    this.noFiller = gridConfig.noFiller;

    this._extApi.onConstructed(() => {
      this._viewport = this._extApi.viewport;
      this._cdkTable = this._extApi.cdkTable;
    });
    this.contextApi = this._extApi.contextApi;
    this._store = this._extApi.columnStore;
    this._plugin = this._extApi.plugin;
    this.columnApi = this._extApi.columnApi;
    this.rowsApi = this._extApi.rowsApi;
  }

  ngAfterContentInit(): void {
    // no need to unsubscribe, the reg service is per grid instance and it will destroy when this grid destroy.
    // Also, at this point initial changes from templates provided in the content are already inside so they will not trigger
    // the order here is very important, because component top of this grid will fire life cycle hooks AFTER this component
    // so if we have a top level component registering a template on top it will not show unless we listen.
    this.registry.changes.subscribe( changes => {
      let gridCell = false;
      let headerFooterCell = false;
      for (const c of changes) {
        switch (c.type) {
          case 'tableCell':
            gridCell = true;
            break;
          case 'headerCell':
          case 'footerCell':
            headerFooterCell = true;
            break;
          case 'noData':
            this.setupNoData();
            break;
          case 'paginator':
            this.setupPaginator();
            break;
        }
      }
      if (gridCell) {
        this._store.attachCustomCellTemplates();
      }
      if (headerFooterCell) {
        this._store.attachCustomHeaderCellTemplates();
      }
    });
  }

  ngAfterViewInit(): void {
    this.invalidateColumns();

    Object.defineProperty(this, 'isInit', { value: true });
    this._plugin.emitEvent({ source: 'grid', kind: 'onInit' });

    this.setupPaginator();
    this.listenToResize();

    this.contextApi.focusChanged
      .subscribe( event => {
        if (event.curr) {
          this.rowsApi
            .findDataRowByIdentity(event.curr.rowIdent)
            ?.getCellById(this.columnApi.columnIds[event.curr.colIndex])
            ?.focus();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    let processColumns = false;

    if (changes.focusMode) {
      this.rowFocus = this.focusMode === 'row' ? 0 : '';
      this.cellFocus = this.focusMode === 'cell' ? 0 : '';
    }

    if ( changes.columns && this.isInit ) {
      processColumns = true;
    }

    if ( processColumns === true ) {
      this.invalidateColumns();
      this.ngZone.onStable.pipe(take(1)).subscribe(() => this.rowsApi.syncRows('all', true));
    }
  }

  ngOnDestroy(): void {
    this._store.dispose();
    const destroy = () => {
      this._plugin.destroy();
      this.viewport.detachViewPort();
      unrx.kill(this);
    };

    let p: Promise<void>;
    this._plugin.emitEvent({ source: 'grid', kind: 'onDestroy', wait: (_p: Promise<void>) => p = _p });
    if (p) {
      p.then(destroy).catch(destroy);
    } else {
      destroy();
    }
  }

  trackBy(index: number, item: T): any {
    return index;
  }

  /**
   * Clear the current sort definitions.
   * This method is a proxy to `PblDataSource.setSort`, For more information see `PblDataSource.setSort`
   *
   * @param skipUpdate When true will not update the datasource, use this when the data comes sorted and you want to sync the definitions with the current data set.
   * default to false.
   */
  setSort(skipUpdate?: boolean): void;
  /**
   * Set the sorting definition for the current data set.
   *
   * This method is a proxy to `PblDataSource.setSort` with the added sugar of providing column by string that match the `id` or `alias` properties.
   * For more information see `PblDataSource.setSort`
   *
   * @param columnOrAlias A column instance or a string matching `PblColumn.alias` or `PblColumn.id`.
   * @param skipUpdate When true will not update the datasource, use this when the data comes sorted and you want to sync the definitions with the current data set.
   * default to false.
   */
  setSort(columnOrAlias: PblColumn | string, sort: PblNgridSortDefinition, skipUpdate?: boolean): void;
  setSort(columnOrAlias?: PblColumn | string | boolean, sort?: PblNgridSortDefinition, skipUpdate = false): void {
    if (!columnOrAlias || typeof columnOrAlias === 'boolean') {
      this.ds.setSort(!!columnOrAlias);
      return;
    }

    let column: PblColumn;
    if (typeof columnOrAlias === 'string') {
      column = this._store.visibleColumns.find( c => c.alias ? c.alias === columnOrAlias : (c.sort && c.id === columnOrAlias) );
      if (!column && isDevMode()) {
        console.warn(`Could not find column with alias "${columnOrAlias}".`);
        return;
      }
    } else {
      column = columnOrAlias;
    }
    this.ds.setSort(column, sort, skipUpdate);
  }

  /**
   * Clear the filter definition for the current data set.
   *
   * This method is a proxy to `PblDataSource.setFilter`, For more information see `PblDataSource.setFilter`.
   */
  setFilter(): void;
  /**
   * Set the filter definition for the current data set using a function predicate.
   *
  * This method is a proxy to `PblDataSource.setFilter` with the added sugar of providing column by string that match the `id` property.
   * For more information see `PblDataSource.setFilter`
   */
  setFilter(value: DataSourcePredicate, columns?: PblColumn[] | string[]): void;
  /**
   * Set the filter definition for the current data set using a value to compare with and a list of columns with the values to compare to.
   *
   * This method is a proxy to `PblDataSource.setFilter` with the added sugar of providing column by string that match the `id` property.
   * For more information see `PblDataSource.setFilter`
   */
  setFilter(value: any, columns: PblColumn[] | string[]): void;
  setFilter(value?: DataSourceFilterToken, columns?: PblColumn[] | string[]): void {
    if (arguments.length > 0) {
      let columnInstances: PblColumn[];
      if (Array.isArray(columns) && typeof columns[0] === 'string') {
        columnInstances = [];
        for (const colId of columns) {
          const column = this._store.visibleColumns.find( c => c.alias ? c.alias === colId : (c.id === colId) );
          if (!column && isDevMode()) {
            console.warn(`Could not find column with alias ${colId} "${colId}".`);
            return;
          }
          columnInstances.push(column);
        }
      } else {
        columnInstances = columns as any;
      }
      this.ds.setFilter(value, columnInstances);
    } else {
      this.ds.setFilter();
    }
  }

  setDataSource(value: PblDataSource<T>): void {
    if (this._dataSource !== value) {
      // KILL ALL subscriptions for the previous datasource.
      if (this._dataSource) {
        unrx.kill(this, this._dataSource);
      }

      const prev = this._dataSource;
      this._dataSource = value;
      this._cdkTable.dataSource = value as any;

      this.setupPaginator();
      this.setupNoData(false);

      if (prev?.hostGrid === this) {
        prev._detachGrid();
      }

      this._dataSource._attachGrid(this._plugin);
      this._plugin.emitEvent({
        source: 'ds',
        kind: 'onDataSource',
        prev,
        curr: value
      } as PblNgridOnDataSourceEvent);

      // clear the context, new datasource
      this._extApi.contextApi.clear();

      if ( value ) {
        if (isDevMode()) {
          value.onError.pipe(unrx(this, value)).subscribe(console.error.bind(console));
        }

        // We register to this event because it fires before the entire data-changing process starts.
        // This is required because `onRenderDataChanging` is fired async, just before the data is emitted.
        // Its not enough to clear the context when `setDataSource` is called, we also need to handle `refresh` calls which will not
        // trigger this method.
        value.onSourceChanging
          .pipe(unrx(this, value))
          .subscribe( () => {
            if (this.config.get('table').clearContextOnSourceChanging) {
              this._extApi.contextApi.clear();
            }
          });

        // Run CD, scheduled as a micro-task, after each rendering
        value.onRenderDataChanging
          .pipe(
            filter( ({event}) => !event.isInitial && (event.pagination.changed || event.sort.changed || event.filter.changed)),
            // Context between the operations are not supported at the moment
            // Event for client side operations...
            // TODO: can we remove this? we clear the context with `onSourceChanging`
            tap( () => !this._store.primary && this._extApi.contextApi.clear() ),
            switchMap( () => value.onRenderedDataChanged.pipe(take(1), mapTo(this.ds.renderLength)) ),
            observeOn(asapScheduler),
            unrx(this, value)
          )
          .subscribe( previousRenderLength => {
            // If the number of rendered items has changed the grid will update the data and run CD on it.
            // so we only update the rows.
            if (previousRenderLength === this.ds.renderLength) {
              this.rowsApi.syncRows(true);
            } else {
              this.rowsApi.syncRows('header', true);
              this.rowsApi.syncRows('footer', true);
            }
          });

        // Handling no data overlay
        // Handling fallback minimum height.
        value.onRenderedDataChanged
          .pipe(
            map( () => this.ds.renderLength ),
            startWith(null),
            pairwise(),
            tap( ([prev, curr]) => {
              const noDataShowing = !!this._noDateEmbeddedVRef;
              if ( (curr > 0 && noDataShowing) || (curr === 0 && !noDataShowing) ) {
                this.setupNoData();
              }
            }),
            observeOn(animationFrameScheduler), // ww want to give the browser time to remove/add rows
            unrx(this, value)
          )
          .subscribe(() => {
            const el = this.viewport.element;
            if (this.ds.renderLength > 0 && this._minDataViewHeight) {
              let h: number;
              if (this._minDataViewHeight > 0) {
                h = Math.min(this._minDataViewHeight, this.viewport.measureRenderedContentSize());
              } else {
                const rowHeight = this.findInitialRowHeight();
                const rowCount = Math.min(this.ds.renderLength, this._minDataViewHeight * -1);
                h = rowHeight * rowCount;
              }
              el.style.minHeight = h + 'px';
              // We need to trigger CD when not using virtual scroll or else the rows won't show on initial load, only after user interactions
              if (!this.viewport.enabled) {
                this.rowsApi.syncRows(true);
              }
            }
          });
      }
    }
  }

  /**
   * Invalidates the header, including a full rebuild of column headers
   */
  invalidateColumns(): void {
    this._plugin.emitEvent({ source: 'grid', kind: 'beforeInvalidateHeaders' });

    this._extApi.contextApi.clear();
    this._store.invalidate(this.columns);

    this._store.attachCustomCellTemplates();
    this._store.attachCustomHeaderCellTemplates();
    this._cdkTable.clearHeaderRowDefs();
    this._cdkTable.clearFooterRowDefs();
    // this.cdr.markForCheck();
    this.cdr.detectChanges();

    // after invalidating the headers we now have optional header/headerGroups/footer rows added
    // we need to update the template with this data which will create new rows (header/footer)
    this.resetHeaderRowDefs();
    this.resetFooterRowDefs();
    this.cdr.markForCheck();

    // Each row will rebuild it's own cells.
    // This will be done in the RowsApi, which listens to `onInvalidateHeaders`
    this._plugin.emitEvent({ source: 'grid', kind: 'onInvalidateHeaders' });
  }

  /**
   * Updates the column sizes for all columns in the grid based on the column definition metadata for each column.
   * The final width represent a static width, it is the value as set in the definition (except column without width, where the calculated global width is set).
   */
  resetColumnsWidth(): void {
    resetColumnWidths(this._store.getStaticWidth(), this._store.visibleColumns, this._store.metaColumns);
  }

  /**
   * Update the size of all group columns in the grid based on the size of their visible children (not hidden).
   * @param dynamicWidthLogic - Optional logic container, if not set a new one is created.
   */
  syncColumnGroupsSize(dynamicWidthLogic?: DynamicColumnWidthLogic): void {
    if (!dynamicWidthLogic) {
      dynamicWidthLogic = this._extApi.dynamicColumnWidthFactory();
    }

    // From all meta columns (header/footer/headerGroup) we filter only `headerGroup` columns.
    // For each we calculate it's width from all of the columns that the headerGroup "groups".
    // We use the same strategy and the same RowWidthDynamicAggregator instance which will prevent duplicate calculations.
    // Note that we might have multiple header groups, i.e. same columns on multiple groups with different row index.
    for (const g of this._store.getAllHeaderGroup()) {
      // We go over all columns because g.columns does not represent the current owned columns of the group
      // it is static, representing the initial state.
      // Only columns hold their group owners.
      // TODO: find way to improve iteration
      const colSizeInfos = this._store.visibleColumns.filter( c => !c.hidden && c.isInGroup(g)).map( c => c.sizeInfo );
      if (colSizeInfos.length > 0) {
        const groupWidth = dynamicWidthLogic.addGroup(colSizeInfos);
        g.minWidth = groupWidth;
        g.updateWidth(`${groupWidth}px`);
      } else {
        g.minWidth = undefined;
        g.updateWidth(`0px`);
      }
    }
  }

  resizeColumns(columns?: PblColumn[]): void {
    if (!columns) {
      columns = this._store.visibleColumns;
    }

    // protect from per-mature resize.
    // Will happen on additional header/header-group rows AND ALSO when vScrollNone is set
    // This will cause size not to populate because it takes time to render the rows, since it's not virtual and happens immediately.
    // TODO: find a better protection.
    if (!columns[0].sizeInfo) {
      return;
    }

    // stores and calculates width for columns added to it. Aggregate's the total width of all added columns.
    const rowWidth = this._extApi.dynamicColumnWidthFactory();
    this.syncColumnGroupsSize(rowWidth);

    // if this is a grid without groups
    if (rowWidth.minimumRowWidth === 0) {
      rowWidth.addGroup(columns.map( c => c.sizeInfo ));
    }

    // if the max lock state has changed we need to update re-calculate the static width's again.
    if (rowWidth.maxWidthLockChanged) {
      resetColumnWidths(this._store.getStaticWidth(), this._store.visibleColumns, this._store.metaColumns);
      this.resizeColumns(columns);
      return;
    }

    this._cdkTable.minWidth = rowWidth.minimumRowWidth;

    this.ngZone.run( () => {
      this.rowsApi.syncRows('header');
      this._plugin.emitEvent({ source: 'grid', kind: 'onResizeRow' });
    });
  }

  /**
   * Create an embedded view before or after the user projected content.
   */
  createView<C>(location: 'beforeTable' | 'beforeContent' | 'afterContent', templateRef: TemplateRef<C>, context?: C, index?: number): EmbeddedViewRef<C> {
    const vcRef = this.getInternalVcRef(location);
    const view = vcRef.createEmbeddedView(templateRef, context, index);
    view.detectChanges();
    return view;
  }

  /**
   * Remove an already created embedded view.
   * @param view - The view to remove
   * @param location - The location, if not set defaults to `before`
   * @returns true when a view was removed, false when not. (did not exist in the view container for the provided location)
   */
  removeView(view: EmbeddedViewRef<any>, location: 'beforeTable' | 'beforeContent' | 'afterContent'): boolean {
    const vcRef = this.getInternalVcRef(location);
    const idx = vcRef.indexOf(view);
    if (idx === -1) {
      return false;
    } else {
      vcRef.remove(idx);
      return true;
    }
  }

  /**
   * Resize all visible columns to fit content of the grid.
   * @param forceFixedWidth - When true will resize all columns with absolute pixel values, otherwise will keep the same format as originally set (% or none)
   */
  autoSizeColumnToFit(options?: AutoSizeToFitOptions): void {
    const { innerWidth, outerWidth } = this.viewport;

    // calculate auto-size on the width without scroll bar and take box model gaps into account
    // TODO: if no scroll bar exists the calc will not include it, next if more rows are added a scroll bar will appear...
    this.columnApi.autoSizeToFit(outerWidth - (outerWidth - innerWidth), options);
  }

  findInitialRowHeight(): number {
    let rowElement: HTMLElement;
    const row = this.rowsApi.findDataRowByIndex(0);
    if (row) {
      const height = getComputedStyle(row.element).height;
      return parseInt(height, 10);
    } else if (this._vcRefBeforeContent) {
      rowElement = this._vcRefBeforeContent.length > 0
        ? (this._vcRefBeforeContent.get(0) as EmbeddedViewRef<any>).rootNodes[0]
        : this._vcRefBeforeContent.element.nativeElement
      ;
      rowElement = rowElement.previousElementSibling as HTMLElement;
      rowElement.style.display = '';
      const height = getComputedStyle(rowElement).height;
      rowElement.style.display = 'none';
      return parseInt(height, 10);
    }
  }

  addClass(...cls: string[]): void {
    for (const c of cls) {
      this.elRef.nativeElement.classList.add(c);
    }
  }

  removeClass(...cls: string[]): void {
    for (const c of cls) {
      this.elRef.nativeElement.classList.remove(c);
    }
  }

  private listenToResize(): void {
    let resizeObserver: ResizeObserver;
    const ro$ = fromEventPattern<[ResizeObserverEntry[], ResizeObserver]>(
      handler => {
        if (!resizeObserver) {
          resizeObserver = new ResizeObserver(handler);
          resizeObserver.observe(this.elRef.nativeElement);
        }
      },
      handler => {
        if (resizeObserver) {
          resizeObserver.unobserve(this.elRef.nativeElement);
          resizeObserver.disconnect();
          resizeObserver = undefined;
        }
      }
    );

    // Skip the first emission
    // Debounce all resizes until the next complete animation frame without a resize
    // finally maps to the entries collection
    // SKIP:  We should skip the first emission (`skip(1)`) before we debounce, since its called upon calling "observe" on the resizeObserver.
    //        The problem is that some grid might require this because they do change size.
    //        An example is a grid in a mat-tab that is hidden, the grid will hit the resize one when we focus the tab
    //        which will require a resize handling because it's initial size is 0
    //        To workaround this, we only skip elements not yet added to the DOM, which means they will not trigger a resize event.
    let skipValue = document.body.contains(this.elRef.nativeElement) ? 1 : 0;

    ro$
      .pipe(
        skip(skipValue),
        debounceTime(0, animationFrameScheduler),
        unrx(this),
      )
      .subscribe( (args: [ResizeObserverEntry[], ResizeObserver]) => {
        if (skipValue === 0) {
          skipValue = 1;
          const columns = this._store.visibleColumns;
          columns.forEach( c => c.sizeInfo.updateSize() );
        }
        this.onResize(args[0]);
      });
  }

  private onResize(entries: ResizeObserverEntry[]): void {
    this.viewport?.checkViewportSize();
    // this.resetColumnsWidth();
    this.resizeColumns();
  }

  private setupNoData(force?: boolean): void {
    if (this._noDateEmbeddedVRef) {
      this.removeView(this._noDateEmbeddedVRef, 'beforeContent');
      this._noDateEmbeddedVRef = undefined;
    }
    if (force === false) {
      return;
    }

    const noData = this._dataSource && this._dataSource.renderLength === 0;
    if (noData) {
      this.addClass('pbl-ngrid-empty');
    } else {
      this.removeClass('pbl-ngrid-empty');
    }

    if (noData || force === true) {
      const noDataTemplate = this.registry.getSingle('noData');
      if (noDataTemplate) {
        this._noDateEmbeddedVRef = this.createView('beforeContent', noDataTemplate.tRef, { $implicit: this }, 0);
      }
    }
  }

  private getInternalVcRef(location: 'beforeTable' | 'beforeContent' | 'afterContent'): ViewContainerRef {
    return location === 'beforeTable'
      ? this._vcRefBeforeTable
      : location === 'beforeContent' ? this._vcRefBeforeContent : this._vcRefAfterContent
    ;
  }

  private setupPaginator(): void {
    const paginationKillKey = 'pblPaginationKillKey';
    const usePagination = this.ds && this.usePagination;

    if (usePagination) {
      this.ds.pagination = this._pagination;
      if (this.ds.paginator) {
        this.ds.paginator.noCacheMode = this._noCachePaginator;
      }
    }

    if (this.isInit) {
      unrx.kill(this, paginationKillKey);
      if (this._paginatorEmbeddedVRef) {
        this.removeView(this._paginatorEmbeddedVRef, 'beforeContent');
        this._paginatorEmbeddedVRef = undefined;
      }
      if (usePagination) {
        const paginatorTemplate = this.registry.getSingle('paginator');
        if (paginatorTemplate) {
          this._paginatorEmbeddedVRef = this.createView('beforeContent', paginatorTemplate.tRef, { $implicit: this });
        }
      }
    }
  }

  private resetHeaderRowDefs(): void {
    if (this._headerRowDefs) {
      // The grid header (main, with column names) is always the last row def (index 0)
      // Because we want it to show last (after custom headers, group headers...) we first need to pull it and then push.

      this._cdkTable.clearHeaderRowDefs();
      const arr = this._headerRowDefs.toArray();
      arr.push(arr.shift());

      for (const rowDef of arr) {
        this._cdkTable.addHeaderRowDef(rowDef);
      }
    }
  }

  private resetFooterRowDefs(): void {
    if (this._footerRowDefs) {
      this._cdkTable.clearFooterRowDefs();
      for (const rowDef of this._footerRowDefs.toArray()) {
        this._cdkTable.addFooterRowDef(rowDef);
      }
    }
  }
}
