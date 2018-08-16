import { Observable, Subject, combineLatest, of, from, isObservable } from 'rxjs';
import { filter, map, switchMap, skip, tap, debounceTime } from 'rxjs/operators';

import { DataSourceOf } from './data-source';
import { SgPaginator, SgPaginatorChangeEvent } from '../paginator';
import { SgTableDataSourceSortChange } from './types';
import { filter as filteringFn, DataSourceFilter } from './filtering';
import { applySort } from './sorting';

import {
  RefreshDataWrapper,
  SgDataSourceConfigurableTriggers,
  SgDataSourceTriggers,
  SgDataSourceTriggerCache,
  SgDataSourceTriggerChangedEvent
} from './data-source-adapter.types';

import { createChangeContainer, fromRefreshDataWrapper, EMPTY } from './data-source-adapter.helpers';

const CUSTOM_BEHAVIOUR_TRIGGER_KEYS: Array<keyof SgDataSourceConfigurableTriggers> = ['sort', 'filter', 'pagination'];
const TRIGGER_KEYS: Array<keyof SgDataSourceTriggers> = [...CUSTOM_BEHAVIOUR_TRIGGER_KEYS, 'data'];
const SOURCE_CHANGING_TOKEN = {};

/**
 * An adapter that handles changes
 */
export class SgDataSourceAdapter<T = any, TData = any> {
  onSourceChanged: Observable<T[]>;
  onSourceChanging: Observable<void>;
  protected paginator?: SgPaginator<any>;
  private readonly config: Partial<Record<keyof SgDataSourceConfigurableTriggers, boolean>>;
  private cache: SgDataSourceTriggerCache<TData> = { filter: EMPTY, sort: EMPTY, pagination: {}, data: EMPTY };
  private _onSourceChange$: Subject<any | T[]>;
  private _refresh$: Subject<RefreshDataWrapper<TData>>;
  private _lastSource: T[];
  private _lastSortedSource: T[];

  /**
   * A Data Source adapter contains flow logic for the datasource and subsequent emissions of datasource's.
   * The logic is determined by the combination of the config object and the souceFactory provided to this adapter, making this adapter actually a container.
   *
   * There are 4 triggers that are responsible for datasource emissions, when one of them is triggered it will invoke the `sourceFactory`
   * returning a new datasource, i.e. a new datasource emission.
   *
   * The triggeres are: filter, sort, pagination and refresh.
   *
   * The refresh trigger does not effect the input sent to the `sourceFactory` function, it is just a mean to initiate a call to create a new
   * datasource without changing previous flow variables.
   * It's important to note that calling `sourceFactory` with the same input 2 or more times does not gurantee identica response. For exapmle
   * calling a remote server that might change it's data between calls.
   *
   * All other triggeres (3) will change the input sent to the `sourceFactory` function which will use them to return a datasource.
   *
   * The input sent to `sourceFactory` is the values that each of the 3 triggeres yields, when one trigger changes a new value for it is sent
   * and the last values of the other 2 triggeres is sent with it. i.e. the combination of the last known value for all 3 triggeres is sent.
   *
   * To enable smart caching and data management `sourceFactory` does not get the raw values of each trigger. `sourceFactory` will get
   * an event object that contains metadata about each trigger, whether it triggered the change or not as well as old and new values.
   *
   * The returned value from `sourceFactory` is then used as the datasource, applying all triggeres that are not overriden by the user.
   * The returned value of `sourceFactory` can be a `DataSourceOf` or `false.
   *   - `DataSourceOf` means a valid datasource, either observable/promise of array or an array.
   *   - `false` means skip, returning false will instruct the adapter to skip execution for this trigger cycle.
   *
   * Using a trigger is a binary configuration option, when a trigger is turned on it means that changes to it will be passed to the `sourceFactory`.
   * When a trigger is turned off it is not listened to and `undefiend` will be sent as a value for it to the `sourceFactory`.
   *
   * The adapter comes with built in flow logic for all 3 triggers, when a trigger is turned off the adapter will take the result of `soruceFactory` and
   * apply the default behaviour to it.
   *
   * For all tirggers, the default behaviour means client implementation. For filtering, client side filtering. For sorting, client side sorting.
   * For Pagination, client side pagination.
   *
   * You can opt in to one or more triggeres and implement your own behaviour inside the `sourceFactory`
   * @param sourceFactory A function that returns the datasource based on flow instructions.
   * The instructions are optional, they might or might not exist depending on the configuraiton of the adapter.
   * When `sourceFactory` returns false the entire trigger cycle is skipped.
   * @param config A configuration object describing how this adapter should behave.
   * @param skipInitial When set to true, will ignore the initial emission and wait for next emission fro the stream.
   * Use this for late binding, usually with a call to refresh() on the data source.
   */
  constructor(private sourceFactory: (event: SgDataSourceTriggerChangedEvent) => (false | DataSourceOf<T>),
              config?: false | Partial<Record<keyof SgDataSourceConfigurableTriggers, boolean>>,
              private skipInitial: boolean = false) {
    this.config = Object.assign({}, config || {});
    this.initStreams();
  }

  dispose(): void {
    this._refresh$.complete();
    this._onSourceChange$.complete();
  }

  refresh(data?: TData): void {
    this._refresh$.next({ data });
  }

  setPaginator(paginator: SgPaginator<any> | undefined): void {
    this.paginator = paginator;
  }

  updateProcessingLogic(filter$: Observable<DataSourceFilter>,
                        sort$: Observable<SgTableDataSourceSortChange>,
                        pagination$: Observable<SgPaginatorChangeEvent>): Observable<T[]> {
    this._lastSource = undefined;
    const changedFilter = e => !this._lastSource || e.changed;

    const refresh = this.skipInitial ? this._refresh$.pipe(skip(1)) : this._refresh$.asObservable();
    const combine: [
      Observable<SgDataSourceTriggerChangedEvent['filter']>,
      Observable<SgDataSourceTriggerChangedEvent['sort']>,
      Observable<SgDataSourceTriggerChangedEvent['pagination']>,
      Observable<SgDataSourceTriggerChangedEvent['data']>
    ] = [
      filter$.pipe( map( value => createChangeContainer('filter', value, this.cache) ), filter(changedFilter) ),
      sort$.pipe( map( value => createChangeContainer('sort', value, this.cache) ), filter(changedFilter) ),
      pagination$.pipe( map( value => createChangeContainer('pagination', value, this.cache) ), filter(changedFilter) ),
      refresh.pipe( map( value => fromRefreshDataWrapper(createChangeContainer('data', value, this.cache)) ), filter(changedFilter) )
    ];

    const hasCustomBehaviour = CUSTOM_BEHAVIOUR_TRIGGER_KEYS.some( key => !!this.config[key] );

    return combineLatest(combine[0], combine[1], combine[2], combine[3])
      .pipe(
        debounceTime(0), // defer to next loop cycle, until no more incoming
        switchMap( ([filter, sort, pagination, data ]) => {
          const event: SgDataSourceTriggerChangedEvent<TData> = {
            filter,
            sort,
            pagination,
            data,
            updateTotalLength: (totalLength) => {
              if (this.paginator) {
                this.paginator.total = totalLength;
              }
            }
          };

          const runHandle = data.changed
            || ( hasCustomBehaviour && CUSTOM_BEHAVIOUR_TRIGGER_KEYS.some( k => !!this.config[k] && event[k].changed) );

          if (runHandle) {
            return this.runHandle(event).pipe(
              tap( data => event.data.changed = true ), // if the user didn't return "false" from his handler, we infer data was changed!
              map( data => ({ event, data })),
            );
          } else {
            return of({ event, data: this._lastSource });
          }
        }),
        map( response => {
          const isFirst = !this._lastSource;
          const config = this.config;
          const event = response.event;

          // mark which of the tirggers has changes
          // The logic is based on the user's configuation and the incoming event
          const withChanges: Partial<Record<keyof SgDataSourceConfigurableTriggers, boolean>> = {};
          for (const key of CUSTOM_BEHAVIOUR_TRIGGER_KEYS) {
            if (!config[key] && (isFirst || event[key].changed)) {
              withChanges[key] = true;
            }
          }

          // When data changed, apply some logic (caching, opertaional, etc...)
          if (event.data.changed) {
            // cache the data when it has changed.
            this._lastSource = response.data;

            if (config.sort) {
              // When the user is sorting (i.e. server sorting), the last sort cached is always the last source we get from the user.
              this._lastSortedSource = this._lastSource;
            } else {
              // When user is NOT sorting (we sort locally) AND the data has changed we need to apply sorting on it
              // this might already be true (if sorting was the tirgger)...
              withChanges.sort = true;
            }
          }

          // When user is NOT applying pagination (we pagniate locally) AND if we (sort OR filter) locally we also need to paginate locally
          if (!config.pagination && (withChanges.sort || withChanges.filter)) {
            withChanges.pagination = true;
          }

          // Now, apply sort, filter, pagination -> ORDER MATTERS!

          if (withChanges.sort) {
            this._lastSortedSource = this.applySort(this._lastSource, event.sort.curr || event.sort.prev);
          }

          let data: T[] = this._lastSortedSource;

          if (withChanges.filter) {
            data = this.applyFilter(data, event.filter.curr || event.filter.prev);
          }

          if (withChanges.pagination) {
            data = this.applyPagination(data);
          }

          // mark everything as NOT CHANGED, for next events because we cache the last event!
          for (const k of TRIGGER_KEYS) {
            event[k].changed = false;
          }
          event.pagination.page.changed = event.pagination.perPage.changed = false;
          return data;
        })
      );
  }

  protected applyFilter(data: T[], dataSourcefilter: DataSourceFilter): T[] {
    data = filteringFn(data, dataSourcefilter);
    if (!this.config.pagination) {
      this.resetPagination(data.length);
    }
    return data;
  }

  protected applySort(data: T[], event: SgTableDataSourceSortChange): T[] {
    return applySort(event.column, event.sort, data);
  }

  protected applyPagination(data: T[]):  T[] {
    if (this.paginator) {
      // Set the rendered rows length to the virtual page size. Fill in the data provided
      // from the index start until the end index or pagination size, whichever is smaller.
      const range = this.paginator.range;
      return data.slice(range[0], range[1]);
    }
    return data;
  }

  protected resetPagination(totalLength: number): void {
    if (this.paginator) {
      this.paginator.total = totalLength;
      this.paginator.page = totalLength > 0 ? 1 : 0;
    }
  }

  private initStreams(): void {
    this._onSourceChange$ = new Subject<T[]>();
    this.onSourceChanged =  this._onSourceChange$.pipe(filter( d => d !== SOURCE_CHANGING_TOKEN ));
    this.onSourceChanging =  this._onSourceChange$.pipe(filter( d => d === SOURCE_CHANGING_TOKEN ));
    this._refresh$ = new Subject<RefreshDataWrapper<TData>>();
    this._lastSource = undefined;
  }

  /**
   * Execute the user-provded function that returns the data collection.
   * This method wraps each of the triggers with a container providing metadata for the trigger. (Old value, was changed? and new value if changed)
   * This is where all cache logic is managed (createChangeContainer).
   *
   * To build a data collection the information from all triggers is required, even if it was not changed.
   * When a trigger is fired with a new value the new value replaces the old value for the trigger and all other triggers will keep their old value.
   * Sending the triggers to the handlers is not enough, we also need to the handlers which of the trigger's have change so they can return
   * data without doing redundant work.
   * For example, fetching paginated data from the server requires a call whenever the pages changes but if the filtering is local for the current page
   * and the filter trigger is fired the handler needs to know that pagination did not change so it will not go and fetch data from the server.
   *
   * The handler can return several data structures, observable, promise, array or false.
   * This method will normalize the response into an observable and notify that the source changed (onSourceChanged).
   *
   * When the response is false that handler wants to skip this cycle, this means that onSourceChanged will not emit and
   * a dead-end observable is returned (observable that will never emit).
   */
  private runHandle(event: SgDataSourceTriggerChangedEvent<TData>): Observable<T[]> {
    this._onSourceChange$.next(SOURCE_CHANGING_TOKEN);

    const result = this.sourceFactory(event);
    if (result === false) {
      return of(false).pipe(filter( () => false )) as any; // stop emissions if got false.
    }

    const obs: Observable<T[]> = isObservable(result)
      ? result
      : Array.isArray(result)
        ? of(result)
        : from(result) // promise...
    ;

    return obs.pipe(
      map( data => Array.isArray(data) ? data : [] ),
      tap( data => setTimeout(() => this._onSourceChange$.next(data) ) )
    );
  }
}
