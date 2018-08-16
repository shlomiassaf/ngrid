import { Observable, BehaviorSubject, Subscription, Subject, of } from 'rxjs';
import { mapTo, skip } from 'rxjs/operators';

import { SelectionModel, CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';

import { KillOnDestroy } from '../table/utils';
import { SgColumn } from '../table/columns';
import { SgTablePaginatorKind, SgPaginator, SgPagingPaginator, SgTokenPaginator } from '../paginator';
import { SgTableSortDefinition, SgTableDataSourceSortChange } from './types';
import { createFilter, DataSourceFilter, DataSourceFilterToken } from './filtering';
import { SgDataSourceAdapter } from './data-source-adapter';

export type DataSourceOf<T> = T[] | Promise<T[]> | Observable<T[]>;
const PROCESSING_SUBSCRIPTION_GROUP = {};

export interface SgDataSourceOptions {
  /**
   * When set to True will not disconnect upon table disconnection, otherwise does.
   */
  keepAlive?: boolean;
}

export class SgDataSource<T = any, TData = any> extends DataSource<T> {

  get pagination(): SgTablePaginatorKind | false { return this._pagination; }
  set pagination(value: SgTablePaginatorKind | false) {
    if (this._pagination !== value) {
      this._pagination = value;
      switch (value) {
        case 'pageNumber':
          this._paginator = new SgPagingPaginator();
          break;
        case 'token':
          this._paginator = new SgTokenPaginator();
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
  readonly onRenderedDataChanged: Observable<void>;
  readonly onError: Observable<Error>;
  /**
   * An event that fires when the connection state to a table has changed.
   */
  readonly tableConnectionChange: Observable<boolean>;
  readonly sortChange: Observable<SgTableDataSourceSortChange>;

  /**
   * When set to True will not disconnect upon table disconnection, otherwise unsubscribe from the
   * datatsource when the table disconnects.
   */
  readonly keepAlive: boolean;

  get adapter(): SgDataSourceAdapter { return this._adapter; };
  set adapter(value: SgDataSourceAdapter) {
    if (this._adapter !== value) {
      this._adapter = value;
      if (this.pagination) {
        this._adapter.setPaginator(this._paginator);
      }
    }
  }

  get sort(): SgTableDataSourceSortChange { return this._sort$.value; }

  get renderedData(): T[] { return this._renderData$.value; }

  get filter(): DataSourceFilter { return this._filter$.value; }

  get length(): number { return this.source.length; }

  get renderLength(): number { return this._renderData$.value.length; }

  get source(): T[] { return this._source || []; }

  get paginator(): SgPaginator<any> { return this._paginator; }

  get renderedRows(): T[] { return this._renderData$.value || []; }

  /**
   * Represents selected items on the data source.
   */
  get selection(): SelectionModel<T> { return this._selection; }

  protected readonly _selection = new SelectionModel<T>(true, []);
  protected readonly _tableConnectionChange$ = new Subject<boolean>();
  protected readonly _renderData$ = new BehaviorSubject<T[]>([]);
  protected readonly _filter$ = new BehaviorSubject<DataSourceFilter>(undefined);
  protected readonly _sort$ = new BehaviorSubject<SgTableDataSourceSortChange>({ column: null, sort: null });
  protected _onError$ = new Subject<Error>();

  protected _paginator: SgPaginator<any>;

  private _pagination: SgTablePaginatorKind | false;
  private _adapter: SgDataSourceAdapter;
  private _source: T[];
  private _disposed: boolean;
  private _tableConnected: boolean;

  constructor(adapter: SgDataSourceAdapter<T, TData>, options?: SgDataSourceOptions) {
    super();
    options = options || {};

    this.adapter = adapter;

    // emit source changed event everytime adapter get's new data
    this.onSourceChanged = this.adapter.onSourceChanged.pipe(mapTo(undefined));
    this.onRenderedDataChanged = this._renderData$.pipe(skip(1), mapTo(undefined));
    this.onError = this._onError$.asObservable();
    this.tableConnectionChange = this._tableConnectionChange$.asObservable();

    this.keepAlive = options.keepAlive || false;
    this.sortChange = this._sort$.asObservable();
  }

  // workaround to refresh the page since row header and row can't communicate
  refresh(data?: TData): void {
    this._adapter.refresh(data);
  }

  setFilter(value: DataSourceFilterToken, columns: SgColumn[]): void {
    if (!columns || columns.length === 0) {
      throw new Error('Invalid filter definitions, columns are mandatory.');
    }
    this._filter$.next(createFilter(value, columns));
  }

  setSort(column: SgColumn, sort: SgTableSortDefinition): void {
    this._sort$.next({ column, sort });
  }

  dispose(): void {
    if (!this._disposed) {
      KillOnDestroy.kill(this);
      this._adapter.dispose();
      this._renderData$.complete();
      this._filter$.complete();
      this._sort$.complete();
      this._onError$.complete();
      this._disposed = true;
    }
  }

  disconnect(cv: CollectionViewer): void {
    this._tableConnectionChange$.next(this._tableConnected = false);
    if (this.keepAlive === false) {
      this.dispose();
    }
  }

  connect(cv: CollectionViewer): Observable<T[]> {
    if (this._disposed) {
      throw new Error('SgDataSource is disposed. Use `keepAlive` if you move datasoruce between tables.');
    }
    this._updateProcessingLogic();
    this._tableConnectionChange$.next(this._tableConnected = true);
    return this._renderData$;
  }

  private _updateProcessingLogic(): void {
    const pagination = this._paginator ? this._paginator.onChange : of(undefined);
    const stream = this._adapter.updateProcessingLogic(this._filter$, this._sort$, pagination);

    KillOnDestroy.kill(this, PROCESSING_SUBSCRIPTION_GROUP)
    stream
      .pipe(KillOnDestroy(this, PROCESSING_SUBSCRIPTION_GROUP))
      .subscribe(
        data => this._renderData$.next(data),
        error => { this._onError$.next(error) }
      );

    this._adapter.onSourceChanged
      .pipe(KillOnDestroy(this, PROCESSING_SUBSCRIPTION_GROUP))
      .subscribe( source => this._source = source || [] );

    this._adapter.refresh(); // _refresh$ is a Subject, we must emit once so combineLatest will work
  }
}

