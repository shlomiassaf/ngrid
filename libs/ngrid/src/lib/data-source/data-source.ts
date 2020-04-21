import { Observable, BehaviorSubject, Subject, of, asapScheduler } from 'rxjs';
import { mapTo, skip, observeOn, tap } from 'rxjs/operators';

import { SelectionModel, CollectionViewer, ListRange } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { moveItemInArray } from '@angular/cdk/drag-drop';

import { unrx } from '../grid/utils';
import { PblColumn } from '../grid/columns';
import { PblNgridPaginatorKind, PblPaginator, PblPagingPaginator, PblTokenPaginator } from '../paginator';
import { DataSourcePredicate, DataSourceFilter, DataSourceFilterToken, PblNgridSortDefinition, PblNgridDataSourceSortChange } from './types';
import { createFilter } from './filtering';
import { PblDataSourceAdapter } from './data-source-adapter';
import { PblDataSourceTriggerCache, PblDataSourceTriggerChangedEvent, PblDataSourceAdapterProcessedResult } from './data-source-adapter.types';

export type DataSourceOf<T> = T[] | Promise<T[]> | Observable<T[]>;

const PROCESSING_SUBSCRIPTION_GROUP = {};

export interface PblDataSourceOptions {
  /**
   * When set to True will not disconnect upon table disconnection, otherwise does.
   */
  keepAlive?: boolean;
  /**
   * Skip the first trigger emission.
   * Use this for late binding, usually with a call to refresh() on the data source.
   *
   * Note that only the internal trigger call is skipped, a custom calls to refresh will go through
   */
  skipInitial?: boolean;
}

export class PblDataSource<T = any, TData = any> extends DataSource<T> {

  get pagination(): PblNgridPaginatorKind | false { return this._pagination; }
  set pagination(value: PblNgridPaginatorKind | false) {
    if (this._pagination !== value) {
      this._pagination = value;
      switch (value) {
        case 'pageNumber':
          this._paginator = new PblPagingPaginator();
          break;
        case 'token':
          this._paginator = new PblTokenPaginator();
          break;
        default:
          this._paginator = undefined;
          break;
      }
      if (this._adapter) {
        this._adapter.setPaginator(this._paginator);
      }
    }
  }

  /**
   * An observable that emit events when an new incoming source is expected, before calling the trigger handler to get the new source.
   * This even is usually followed by the `onSourceChanged` event but not always. This is because the trigger handler
   * can cancel the operation (when it returns false) which means an `onSourceChanged` event will not fire.
   *
   * Emissions occur when the trigger handler is invoked and also when the trigger handler returned an observable and the observable emits.
   *
   * > Note that a micro-task delays is applied between the `onSourceChanging` subsequent `onSourceChanged` event (when emitted).
   */
  readonly onSourceChanging: Observable<void>;
  /**
   * An observable that emit events when a new source has been received from the trigger handler but before any processing is applied.
   * Emissions occur when the trigger handler is invoked and also when the trigger handler returned an observable and the observable emits.
   *
   * Examples: Calling `refresh()`, filter / sort / pagination events.
   *
   * > Note that the `onSourceChanged` fired before the data is rendered ane before any client-side filter/sort/pagination are applied.
   * It only indicates that the source data-set is now updated and the grid is about to apply logic on the data-set and then render it.
   */
  readonly onSourceChanged: Observable<void>;
  /**
   * An observable that emit events when new source has been received from the trigger handler and after it was processed.
   * Emissions will occur after `onSourceChanged` event has been fired.
   *
   * The main difference between `onSourceChanged` and `onRenderDataChanging` is local processing performed in the datasource.
   * These are usually client-side operations like filter/sort/pagination. If all of these events are handled manually (custom)
   * in the trigger handler then `onSourceChanged` and `onRenderDataChanging` have no difference.
   *
   * > Note that `onRenderDataChanging` and `onRenderedDataChanged` are not closely related as `onRenderedDataChanged` fires at
   * a much more rapid pace (virtual scroll). The name `onRenderDataChanging` might change in the future.
   */
  readonly onRenderDataChanging: Observable<{ event: PblDataSourceTriggerChangedEvent<TData>, data: T[] }>;
  /**
   * An observable that emit events when the grid is about to render data.
   * The rendered data is updated when the source changed or when the grid is in virtual scroll mode and the user is scrolling.
   *
   * Each emission reflects a change in the data that the grid is rendering.
   */
  readonly onRenderedDataChanged: Observable<void>;
  readonly onError: Observable<Error>;
  /**
   * An event that fires when the connection state to a table has changed.
   */
  readonly tableConnectionChange: Observable<boolean>;
  readonly sortChange: Observable<PblNgridDataSourceSortChange>;

  /**
   * When set to True will not disconnect upon table disconnection, otherwise unsubscribe from the
   * datasource when the table disconnects.
   */
  readonly keepAlive: boolean;
  /**
   * Skip the first trigger emission.
   * Use this for late binding, usually with a call to refresh() on the data source.
   *
   * Note that only the internal trigger call is skipped, a custom calls to refresh will go through
   */
  readonly skipInitial: boolean;

  get adapter(): PblDataSourceAdapter { return this._adapter; };
  set adapter(value: PblDataSourceAdapter) {
    if (this._adapter !== value) {
      this._adapter = value;
      if (this.pagination) {
        this._adapter.setPaginator(this._paginator);
      }
    }
  }

  // TODO(1.0.0): remove
  /** @deprecated BREAKING CHANGE: removed in 1.0.0 - Use renderedData instead. */
  get renderedRows(): T[] { return this._renderData$.value || []; }
  /** Returns the starting index of the rendered data */
  get renderStart(): number { return this._lastRange ? this._lastRange.start : 0; }
  get renderLength(): number { return this._renderData$.value.length; }
  get renderedData(): T[] { return this._renderData$.value || []; }
  /**
   * The `source` with sorting applied.
   * Valid only when sorting is performed client-side.
   *
   * To get real-time notifications use `onRenderDataChanging`.
   * The sorted data is updated just before `onRenderDataChanging` fire.
   */
  get sortedData(): T[] { return (this._lastAdapterEvent && this._lastAdapterEvent.sorted) || []; };
  /**
   * The `source` with filtering applied.
   * Valid only when filtering is performed client-side.
   * If sorting is applied as well, the filtered results are also sorted.
   *
   * To get real-time notifications use `onRenderDataChanging`.
   * The filtered data is updated just before `onRenderDataChanging` fire.
   */
  get filteredData(): T[] { return (this._lastAdapterEvent && this._lastAdapterEvent.filtered) || []; };

  get filter(): DataSourceFilter { return this._filter$.value; }
  get sort(): PblNgridDataSourceSortChange { return this._sort$.value; }
  get paginator(): PblPaginator<any> { return this._paginator; }

  get length(): number { return this.source.length; }
  get source(): T[] { return this._source || []; }

  /** Represents selected items on the data source. */
  get selection(): SelectionModel<T> { return this._selection; }

  protected readonly _selection = new SelectionModel<T>(true, []);
  protected readonly _tableConnectionChange$ = new Subject<boolean>();
  protected readonly _onRenderDataChanging = new Subject<{ event: PblDataSourceTriggerChangedEvent<TData>, data: T[] }>();
  protected readonly _renderData$ = new BehaviorSubject<T[]>([]);
  protected readonly _filter$: BehaviorSubject<DataSourceFilter> = new BehaviorSubject<DataSourceFilter>(undefined);
  protected readonly _sort$ = new BehaviorSubject<PblNgridDataSourceSortChange & { skipUpdate: boolean }>({ column: null, sort: null, skipUpdate: false });
  protected _onError$ = new Subject<Error>();

  protected _paginator: PblPaginator<any>;

  private _pagination: PblNgridPaginatorKind | false;
  private _adapter: PblDataSourceAdapter;
  private _source: T[];
  private _disposed: boolean;
  private _tableConnected: boolean;
  private _lastRefresh: TData;
  private _lastRange: ListRange;
  private _lastAdapterEvent: PblDataSourceAdapterProcessedResult<T, TData>;

  constructor(adapter: PblDataSourceAdapter<T, TData>, options?: PblDataSourceOptions) {
    super();
    options = options || {};

    this.adapter = adapter;

    this.onSourceChanging = this._adapter.onSourceChanging;
    // emit source changed event every time adapter gets new data
    this.onSourceChanged = this.adapter.onSourceChanged
    .pipe(
      observeOn(asapScheduler, 0), // emit on the end of the current turn (micro-task) to ensure `onSourceChanged` emission in `_updateProcessingLogic` run's first.
      mapTo(undefined)
    );
    this.onRenderDataChanging = this._onRenderDataChanging.asObservable();
    this.onRenderedDataChanged = this._renderData$.pipe(skip(1), mapTo(undefined));
    this.onError = this._onError$.asObservable();
    this.tableConnectionChange = this._tableConnectionChange$.asObservable();

    this.keepAlive = options.keepAlive || false;
    this.skipInitial = options.skipInitial || false;
    this.sortChange = this._sort$.asObservable();
  }

  /**
   * A custom trigger that invokes a manual data source change with the provided data value in the `data` property at tht event.
   */
  refresh(data?: TData): void {
    if (this._tableConnected) {
      this._adapter.refresh(data);
    } else {
      this._lastRefresh = data;
    }
  }

  /**
   * Clear the filter definition for the current data set.
   */
  setFilter(): void;
  /**
   * Set the filter definition for the current data set using a function predicate.
   *
   * > Note that when using a custom predicate function all logic is passed to the predicate and the datasource / grid does not handle the filtering process.
   * This means that any column specific filter, set in the column definitions is ignored, if you want to take these filters into consideration
   * use the column instance provided to identify and use these filters (the `filter` property in `PblColumn`).
   */
  setFilter(value: DataSourcePredicate, columns?: PblColumn[]): void;
  /**
   * Set the filter definition for the current data set using a value to compare with and a list of columns with the values to compare to.
   *
   * When a column instance has a specific predicate set (`PblColumn.filter`) then it will be used, otherwise
   * the `genericColumnPredicate` will be used.
   */
  setFilter(value: any, columns: PblColumn[]): void;
  setFilter(value?: DataSourceFilterToken, columns?: PblColumn[]): void {
    if (value && typeof value !== 'function' && (!columns || columns.length === 0)) {
      throw new Error('Invalid filter definitions, columns are mandatory when using a single value input.');
    }
    this._filter$.next(createFilter(value, columns || []));
  }

  /**
   * Refresh the filters result.
   *
   * Note that this should only be used when using a predicate function filter and not the simple value filter.
   * In general the filter is refreshed every time it is set and each time the data is updated so manually refreshing a value filter
   * has no impact.
   *
   * For custom predicate function filters this might be useful.
   *
   */
  syncFilter(): void {
    const currentFilter = this._adapter.clearCache('filter');
    if (currentFilter) {
      this.setFilter(currentFilter.filter, currentFilter.columns);
    }
  }

  /**
   * Clear the current sort definitions.
   * @param skipUpdate When true will not update the datasource, use this when the data comes sorted and you want to sync the definitions with the current data set.
   * default to false.
   */
  setSort(skipUpdate?: boolean): void;
  /**
   * Set the sorting definition for the current data set.
   * @param column
   * @param sort
   * @param skipUpdate When true will not update the datasource, use this when the data comes sorted and you want to sync the definitions with the current data set.
   * default to false.
   */
  setSort(column: PblColumn, sort: PblNgridSortDefinition, skipUpdate?: boolean): void;
  setSort(column?: PblColumn | boolean, sort?: PblNgridSortDefinition, skipUpdate = false): void {
    if (!column || typeof column === 'boolean') {
      this._sort$.next({ column: null, sort: {}, skipUpdate: !!column });
    } else {
      this._sort$.next({ column, sort, skipUpdate });
    }
  }

  dispose(): void {
    if (!this._disposed) {
      unrx.kill(this);
      this._adapter.dispose();
      this._onRenderDataChanging.complete();
      this._renderData$.complete();
      this._filter$.complete();
      this._sort$.complete();
      this._onError$.complete();
      this._disposed = true;
    }
  }

  disconnect(cv: CollectionViewer): void {
    this._lastRefresh = undefined;
    this._tableConnectionChange$.next(this._tableConnected = false);
    if (this.keepAlive === false) {
      this.dispose();
    }
  }

  connect(cv: CollectionViewer): Observable<T[]> {
    if (this._disposed) {
      throw new Error('PblDataSource is disposed. Use `keepAlive` if you move datasource between tables.');
    }
    this._tableConnected = true
    this._updateProcessingLogic(cv);
    this._tableConnectionChange$.next(this._tableConnected);
    return this._renderData$;
  }

  /**
   * Move's an item (in the entire source) from one index to the other, pushing the item in the destination one item backwards.
   *
   * Note that if the rendered data is a subset of the entire source (i.e virtual scroll & range) the indices are considered
   * local to the rendered view and are translated to fit the entire source.
   *
   * Tp disable this behavior, set the `absolute` parameter to `true`
   */
  moveItem(fromIndex: number, toIndex: number, absolute = false): void {
    if (absolute !== true && this._lastRange) {
      fromIndex = this._lastRange.start + fromIndex;
      toIndex = this._lastRange.start + toIndex;
    }

    if (this.length > 0) {
      moveItemInArray(this._source, fromIndex, toIndex)
      const data = this._lastRange
        ? this._source.slice(this._lastRange.start, this._lastRange.end)
        : this._source
      ;
      this._renderData$.next(data);
    }
  }

  private _updateProcessingLogic(cv: CollectionViewer): void {
    const initialState: Partial<PblDataSourceTriggerCache<TData>> = { filter: this.filter,  sort: this.sort };
    const paginator = this._paginator;
    if (paginator) {
      initialState.pagination = { page: paginator.page, perPage: paginator.perPage };
    }
    const stream = this._adapter.updateProcessingLogic(
      this._filter$,
      this._sort$,
      paginator ? paginator.onChange : of(undefined),
      initialState,
    );

    unrx.kill(this, PROCESSING_SUBSCRIPTION_GROUP)

    const trimToRange = (range: ListRange, data: any[]) => data.slice(range.start, range.end) ;

    let skipViewChange: boolean;
    let lastEmittedSource: T[];

    cv.viewChange
      .pipe(unrx(this, PROCESSING_SUBSCRIPTION_GROUP))
      .subscribe( range => {
        if (this._lastRange && this._lastRange.start === range.start && this._lastRange.end === range.end) {
          return;
        }
        this._lastRange = range;
        if (!skipViewChange) {
          if (range && lastEmittedSource && lastEmittedSource.length) {
            this._renderData$.next(trimToRange(this._lastRange, lastEmittedSource));
          }
        }
      });

    stream
      .pipe(
        unrx(this, PROCESSING_SUBSCRIPTION_GROUP),
        tap( result => {
          lastEmittedSource = result.data;
          skipViewChange = true;
          this._onRenderDataChanging.next(this._lastAdapterEvent = result);
        })
      )
      .subscribe(
        ({data}) => {
          if (this._lastRange && data && data.length) {
            data = trimToRange(this._lastRange, data);
          }
          this._renderData$.next(data);
          skipViewChange = false;
        },
        error => { this._onError$.next(error) }
      );

    this._adapter.onSourceChanged
      .pipe(unrx(this, PROCESSING_SUBSCRIPTION_GROUP))
      .subscribe( source => this._source = source || [] );

    if (this._lastRefresh !== undefined) {
      this._adapter.refresh(this._lastRefresh);
      this._lastRefresh = undefined;
    } else if (!this.skipInitial) {
      // _refresh$ is a Subject, we must emit once so combineLatest will work
      this.refresh();
    }
  }
}

