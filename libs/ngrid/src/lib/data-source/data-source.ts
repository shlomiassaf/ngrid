import { Observable, BehaviorSubject, Subject, of, asapScheduler } from 'rxjs';
import { mapTo, skip, observeOn, tap } from 'rxjs/operators';

import { SelectionModel, CollectionViewer, ListRange } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { moveItemInArray } from '@angular/cdk/drag-drop';

import { UnRx } from '@pebula/utils';

import { PblColumn } from '../table/columns';
import { PblNgridPaginatorKind, PblPaginator, PblPagingPaginator, PblTokenPaginator } from '../paginator';
import { DataSourceFilter, DataSourceFilterToken, PblNgridSortDefinition, PblNgridDataSourceSortChange } from './types';
import { createFilter } from './filtering';
import { PblDataSourceAdapter } from './data-source-adapter';
import { PblDataSourceTriggerCache, PblDataSourceTriggerChangedEvent } from './data-source-adapter.types';

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
   * Notification stream for source changes.
   */
  readonly onSourceChanged: Observable<void>;
  get onSourceChanging(): Observable<void> { return this._adapter.onSourceChanging; }
  readonly onRenderDataChanging: Observable<{ event: PblDataSourceTriggerChangedEvent<TData>, data: T[] }>;
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

  get sort(): PblNgridDataSourceSortChange { return this._sort$.value; }

  /** Returns the starting index of the rendered data */
  get renderStart(): number { return this._lastRange ? this._lastRange.start : 0; }

  get renderedData(): T[] { return this._renderData$.value; }

  get filter(): DataSourceFilter { return this._filter$.value; }

  get length(): number { return this.source.length; }

  get renderLength(): number { return this._renderData$.value.length; }

  get source(): T[] { return this._source || []; }

  get paginator(): PblPaginator<any> { return this._paginator; }

  get renderedRows(): T[] { return this._renderData$.value || []; }

  /**
   * Represents selected items on the data source.
   */
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

  constructor(adapter: PblDataSourceAdapter<T, TData>, options?: PblDataSourceOptions) {
    super();
    options = options || {};

    this.adapter = adapter;

    // emit source changed event every time adapter gets new data
    this.onSourceChanged = this.adapter.onSourceChanged
    .pipe(
      observeOn(asapScheduler, 0), // emit on the end of the current turn (microtask) to ensure `onSourceChanged` emission in `_updateProcessingLogic` run's first.
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

  setFilter(value: DataSourceFilterToken, columns: PblColumn[]): void {
    if (!columns || columns.length === 0) {
      throw new Error('Invalid filter definitions, columns are mandatory.');
    }
    this._filter$.next(createFilter(value, columns));
  }

  /**
   * Set the sorting definition for the current data set.
   * @param column
   * @param sort
   * @param skipUpdate When true will not update the datasource, use this when the data comes sorted and you want to sync the definitions with the current data set.
   * default to false.
   */
  setSort(column: PblColumn, sort: PblNgridSortDefinition, skipUpdate = false): void {
    this._sort$.next({ column, sort, skipUpdate });
  }

  dispose(): void {
    if (!this._disposed) {
      UnRx.kill(this);
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
   * Note that if the rendered data is a subset of the entire source (i.e virtual scroll & range) the indices are considered
   * local to the rendered view and are translated to fir the entire source.
   */
  moveItem(fromIndex: number, toIndex: number): void {
    if (this._lastRange) {
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

    UnRx.kill(this, PROCESSING_SUBSCRIPTION_GROUP)

    const trimToRange = (range: ListRange, data: any[]) => data.slice(range.start, range.end) ;

    let skipViewChange: boolean;
    let lastEmittedSource: T[];

    cv.viewChange
      .pipe(UnRx(this, PROCESSING_SUBSCRIPTION_GROUP))
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
        UnRx(this, PROCESSING_SUBSCRIPTION_GROUP),
        tap( result => {
          lastEmittedSource = result.data;
          skipViewChange = true;
          this._onRenderDataChanging.next(result);
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
      .pipe(UnRx(this, PROCESSING_SUBSCRIPTION_GROUP))
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

