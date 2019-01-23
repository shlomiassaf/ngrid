import { Observable, BehaviorSubject, Subject, of, asapScheduler } from 'rxjs';
import { mapTo, skip, observeOn, tap } from 'rxjs/operators';

import { SelectionModel, CollectionViewer, ListRange } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { moveItemInArray } from '@angular/cdk/drag-drop';

import { UnRx } from '@neg/utils';

import { NegColumn } from '../table/columns';
import { NegTablePaginatorKind, NegPaginator, NegPagingPaginator, NegTokenPaginator } from '../paginator';
import { DataSourceFilter, DataSourceFilterToken, NegTableSortDefinition, NegTableDataSourceSortChange } from './types';
import { createFilter } from './filtering';
import { NegDataSourceAdapter } from './data-source-adapter';
import { NegDataSourceTriggerCache, NegDataSourceTriggerChangedEvent } from './data-source-adapter.types';

export type DataSourceOf<T> = T[] | Promise<T[]> | Observable<T[]>;

const PROCESSING_SUBSCRIPTION_GROUP = {};

export interface NegDataSourceOptions {
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

export class NegDataSource<T = any, TData = any> extends DataSource<T> {

  get pagination(): NegTablePaginatorKind | false { return this._pagination; }
  set pagination(value: NegTablePaginatorKind | false) {
    if (this._pagination !== value) {
      this._pagination = value;
      switch (value) {
        case 'pageNumber':
          this._paginator = new NegPagingPaginator();
          break;
        case 'token':
          this._paginator = new NegTokenPaginator();
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
  readonly onRenderDataChanging: Observable<{ event: NegDataSourceTriggerChangedEvent<TData>, data: T[] }>;
  readonly onRenderedDataChanged: Observable<void>;
  readonly onError: Observable<Error>;
  /**
   * An event that fires when the connection state to a table has changed.
   */
  readonly tableConnectionChange: Observable<boolean>;
  readonly sortChange: Observable<NegTableDataSourceSortChange>;

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

  get adapter(): NegDataSourceAdapter { return this._adapter; };
  set adapter(value: NegDataSourceAdapter) {
    if (this._adapter !== value) {
      this._adapter = value;
      if (this.pagination) {
        this._adapter.setPaginator(this._paginator);
      }
    }
  }

  get sort(): NegTableDataSourceSortChange { return this._sort$.value; }

  /** Returns the starting index of the rendered data */
  get renderStart(): number { return this._lastRange ? this._lastRange.start : 0; }

  get renderedData(): T[] { return this._renderData$.value; }

  get filter(): DataSourceFilter { return this._filter$.value; }

  get length(): number { return this.source.length; }

  get renderLength(): number { return this._renderData$.value.length; }

  get source(): T[] { return this._source || []; }

  get paginator(): NegPaginator<any> { return this._paginator; }

  get renderedRows(): T[] { return this._renderData$.value || []; }

  /**
   * Represents selected items on the data source.
   */
  get selection(): SelectionModel<T> { return this._selection; }

  protected readonly _selection = new SelectionModel<T>(true, []);
  protected readonly _tableConnectionChange$ = new Subject<boolean>();
  protected readonly _onRenderDataChanging = new Subject<{ event: NegDataSourceTriggerChangedEvent<TData>, data: T[] }>();
  protected readonly _renderData$ = new BehaviorSubject<T[]>([]);
  protected readonly _filter$: BehaviorSubject<DataSourceFilter> = new BehaviorSubject<DataSourceFilter>(undefined);
  protected readonly _sort$ = new BehaviorSubject<NegTableDataSourceSortChange>({ column: null, sort: null });
  protected _onError$ = new Subject<Error>();

  protected _paginator: NegPaginator<any>;

  private _pagination: NegTablePaginatorKind | false;
  private _adapter: NegDataSourceAdapter;
  private _source: T[];
  private _disposed: boolean;
  private _tableConnected: boolean;
  private _lastRefresh: TData;
  private _lastRange: ListRange;

  constructor(adapter: NegDataSourceAdapter<T, TData>, options?: NegDataSourceOptions) {
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

  setFilter(value: DataSourceFilterToken, columns: NegColumn[]): void {
    if (!columns || columns.length === 0) {
      throw new Error('Invalid filter definitions, columns are mandatory.');
    }
    this._filter$.next(createFilter(value, columns));
  }

  setSort(column: NegColumn, sort: NegTableSortDefinition): void {
    this._sort$.next({ column, sort });
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
      throw new Error('NegDataSource is disposed. Use `keepAlive` if you move datasource between tables.');
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
    const initialState: Partial<NegDataSourceTriggerCache<TData>> = { filter: this.filter,  sort: this.sort };
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

