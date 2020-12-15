import { Observable, Subject, combineLatest, of, from, isObservable, asapScheduler } from 'rxjs';
import { filter, map, switchMap, tap, debounceTime, observeOn } from 'rxjs/operators';

import { PblPaginator, PblPaginatorChangeEvent } from '../paginator/types';
import { PblNgridDataSourceSortChange, DataSourceFilter } from './types';
import { filter as filteringFn } from './filtering';
import { applySort } from './sorting';

import {
  RefreshDataWrapper,
  PblDataSourceConfigurableTriggers,
  PblDataSourceTriggers,
  PblDataSourceTriggerCache,
  PblDataSourceTriggerChangedEvent,
  TriggerChangedEventFor,
  PblDataSourceAdapterProcessedResult,
  PblDataSourceTriggerChangeHandler,
} from './data-source-adapter.types';

import { createChangeContainer, fromRefreshDataWrapper, EMPTY } from './data-source-adapter.helpers';

const CUSTOM_BEHAVIOR_TRIGGER_KEYS: Array<keyof PblDataSourceConfigurableTriggers> = ['sort', 'filter', 'pagination'];
const TRIGGER_KEYS: Array<keyof PblDataSourceTriggers> = [...CUSTOM_BEHAVIOR_TRIGGER_KEYS, 'data'];
const SOURCE_CHANGING_TOKEN = {};

const DEFAULT_INITIAL_CACHE_STATE: PblDataSourceTriggerCache<any> = { filter: EMPTY, sort: EMPTY, pagination: {}, data: EMPTY };

/**
 * An adapter that handles changes
 */
export class PblDataSourceAdapter<T = any, TData = any, TEvent extends PblDataSourceTriggerChangedEvent<TData> = PblDataSourceTriggerChangedEvent<TData>> {

  static hasCustomBehavior(config: Partial<Record<keyof PblDataSourceConfigurableTriggers, boolean>>): boolean {
    for (const key of CUSTOM_BEHAVIOR_TRIGGER_KEYS) {
      if (!!config[key]) {
        return true;
      }
    }
    return false;
  }

  /** Returns true if the event is triggered from a custom behavior (filter, sort and/or pagination and the configuration allows it) */
  static isCustomBehaviorEvent(event: PblDataSourceTriggerChangedEvent, config: Partial<Record<keyof PblDataSourceConfigurableTriggers, boolean>>) {
    for (const key of CUSTOM_BEHAVIOR_TRIGGER_KEYS) {
      if (!!config[key] && event[key].changed) {
        return true;
      }
    }
    return false;
  }

  onSourceChanged: Observable<T[]>;
  onSourceChanging: Observable<void>;

  get inFlight() { return this._inPreFlight || this._inFlight.size > 0; }

  protected paginator?: PblPaginator<any>;
  private readonly config: Partial<Record<keyof PblDataSourceConfigurableTriggers, boolean>>;
  private cache: PblDataSourceTriggerCache<TData>;
  private _onSourceChange$: Subject<any | T[]>;
  private _refresh$: Subject<RefreshDataWrapper<TData>>;
  private _lastSource: T[];
  private _lastSortedSource: T[];
  private _lastFilteredSource: T[];
  private _inFlight = new Set<TEvent>();
  private _inPreFlight = false;

  /**
   * A Data Source adapter contains flow logic for the datasource and subsequent emissions of datasource instances.
   * The logic is determined by the combination of the config object and the sourceFactory provided to this adapter, making this adapter actually a container.
   *
   * There are 4 triggers that are responsible for datasource emissions, when one of them is triggered it will invoke the `sourceFactory`
   * returning a new datasource, i.e. a new datasource emission.
   *
   * The triggers are: filter, sort, pagination and refresh.
   *
   * The refresh trigger does not effect the input sent to the `sourceFactory` function, it is just a mean to initiate a call to create a new
   * datasource without changing previous flow variables.
   * It's important to note that calling `sourceFactory` with the same input 2 or more times does not guarantee identical response. For example
   * calling a remote server that might change it's data between calls.
   *
   * All other triggers (3) will change the input sent to the `sourceFactory` function which will use them to return a datasource.
   *
   * The input sent to `sourceFactory` is the values that each of the 3 triggers yields, when one trigger changes a new value for it is sent
   * and the last values of the other 2 triggers is sent with it. i.e. the combination of the last known value for all 3 triggers is sent.
   *
   * To enable smart caching and data management `sourceFactory` does not get the raw values of each trigger. `sourceFactory` will get
   * an event object that contains metadata about each trigger, whether it triggered the change or not as well as old and new values.
   *
   * The returned value from `sourceFactory` is then used as the datasource, applying all triggers that are not overridden by the user.
   * The returned value of `sourceFactory` can be a `DataSourceOf` or `false`.
   *   - `DataSourceOf` means a valid datasource, either observable/promise of array or an array.
   *   - `false` means skip, returning false will instruct the adapter to skip execution for this trigger cycle.
   *
   * Using a trigger is a binary configuration option, when a trigger is turned on it means that changes to it will be passed to the `sourceFactory`.
   * When a trigger is turned off it is not listened to and `undefined` will be sent as a value for it to the `sourceFactory`.
   *
   * The adapter comes with built in flow logic for all 3 triggers, when a trigger is turned off the adapter will take the result of `sourceFactory` and
   * apply the default behavior to it.
   *
   * For all triggers, the default behavior means client implementation. For filtering, client side filtering. For sorting, client side sorting.
   * For Pagination, client side pagination.
   *
   * You can opt in to one or more triggers and implement your own behavior inside the `sourceFactory`
   * @param sourceFactory - A function that returns the datasource based on flow instructions.
   * The instructions are optional, they might or might not exist depending on the configuration of the adapter.
   * When `sourceFactory` returns false the entire trigger cycle is skipped.
   * @param config - A configuration object describing how this adapter should behave.
   */
  constructor(public sourceFactory: PblDataSourceTriggerChangeHandler<T, TEvent>,
              config?: false | Partial<Record<keyof PblDataSourceConfigurableTriggers, boolean>>) {
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

  /**
   * Clears the cache from any existing datasource trigger such as filter, sort etc.
   * @returns The cached value or null if not there.
   */
  clearCache<P extends keyof PblDataSourceTriggerCache>(cacheKey: P): PblDataSourceTriggerCache<TData>[P] | null {
    if (cacheKey in this.cache) {
      const prev = this.cache[cacheKey];
      this.cache[cacheKey] = DEFAULT_INITIAL_CACHE_STATE[cacheKey];
      return prev;
    } else {
      return null;
    }
  }

  setPaginator(paginator: PblPaginator<any> | undefined): void {
    this.paginator = paginator;
  }

  updateProcessingLogic(filter$: Observable<DataSourceFilter>,
                        sort$: Observable<PblNgridDataSourceSortChange & { skipUpdate: boolean }>,
                        pagination$: Observable<PblPaginatorChangeEvent>,
                        initialState: Partial<PblDataSourceTriggerCache<TData>> = {}): Observable<PblDataSourceAdapterProcessedResult<T, TData>> {
    let updates = -1;
    const changedFilter = e => updates === -1 || e.changed;
    const skipUpdate = (o: PblNgridDataSourceSortChange & { skipUpdate: boolean }) => o.skipUpdate !== true;

    this._lastSource = undefined;

    this.cache = { ...DEFAULT_INITIAL_CACHE_STATE, ...initialState };

    const combine: [
      Observable<TriggerChangedEventFor<'filter'>>,
      Observable<TriggerChangedEventFor<'sort'>>,
      Observable<TriggerChangedEventFor<'pagination'>>,
      Observable<TriggerChangedEventFor<'data'>>
    ] = [
      filter$.pipe( map( value => createChangeContainer('filter', value, this.cache) ), filter(changedFilter) ),
      sort$.pipe( filter(skipUpdate), map( value => createChangeContainer('sort', value, this.cache) ), filter(changedFilter) ),
      pagination$.pipe( map( value => createChangeContainer('pagination', value, this.cache) ), filter(changedFilter) ),
      this._refresh$.pipe( map( value => fromRefreshDataWrapper(createChangeContainer('data', value, this.cache)) ), filter(changedFilter) ),
    ];

    const hasCustomBehavior = PblDataSourceAdapter.hasCustomBehavior(this.config);

    return combineLatest([combine[0], combine[1], combine[2], combine[3]])
      .pipe(
        tap( () => this._inPreFlight = true),
        // Defer to next loop cycle, until no more incoming.
        // We use an async schedular here (instead of asapSchedular) because we want to have the largest debounce window without compromising integrity
        // With an async schedular we know we will run after all micro-tasks but before "real" async operations.
        debounceTime(0),
        switchMap( ([filterInput, sort, pagination, data ]) => {
          this._inPreFlight = false;

          updates++; // if first, will be 0 now (starts from -1).
          const event: TEvent = {
            id: Math.random() * 10,
            filter: filterInput,
            sort,
            pagination,
            data,
            eventSource: data.changed ? 'data' : 'customTrigger',
            isInitial: updates === 0,
            updateTotalLength: (totalLength) => {
              if (this.paginator) {
                this.paginator.total = totalLength;
              }
            }
          } as TEvent;
          this.onStartOfEvent(event);

          const runHandle = data.changed
            || ( hasCustomBehavior && PblDataSourceAdapter.isCustomBehaviorEvent(event, this.config) );

          const response$ = runHandle
            ? this.runHandle(event as TEvent)
                .pipe(
                  map( data => {
                    if (data !== false) { // if the user didn't return "false" from his handler, we infer data was changed!
                      event.data.changed = true;
                    }
                    return { event, data };
                  }),
                )
              : of({ event, data: this._lastSource })
            ;

          return response$
            .pipe(
              map( response => {
                // If runHandle() returned false, we do not process and return undefined.
                if (response.data === false) {
                  return;
                }
                const config = this.config;
                const event = response.event;

                // mark which of the triggers has changes
                // The logic is based on the user's configuration and the incoming event
                const withChanges: Partial<Record<keyof PblDataSourceConfigurableTriggers, boolean>> = {};
                for (const key of CUSTOM_BEHAVIOR_TRIGGER_KEYS) {
                  if (!config[key] && (event.isInitial || event[key].changed)) {
                    withChanges[key] = true;
                  }
                }

                // When data changed, apply some logic (caching, operational, etc...)
                if (event.data.changed) {
                  // cache the data when it has changed.
                  this._lastSource = response.data;

                  if (config.sort) {
                    // When the user is sorting (i.e. server sorting), the last sort cached is always the last source we get from the user.
                    this._lastSortedSource = this._lastSource;
                  } else {
                    // When user is NOT sorting (we sort locally) AND the data has changed we need to apply sorting on it
                    // this might already be true (if sorting was the trigger)...
                    withChanges.sort = true;

                    // because we sort and then filter, filtering updates are also triggered by sort updated
                    withChanges.filter = true;
                  }

                  if (config.filter) {
                    // When the user is filtering (i.e. server filtering), the last filter cached is always the last source we get from the user.
                    this._lastFilteredSource = this._lastSource;
                  } else {
                    // When user is NOT filtering (we filter locally) AND the data has changed we need to apply filtering on it
                    // this might already be true (if filtering was the trigger)...
                    withChanges.filter = true;
                  }
                }

                // When user is NOT applying pagination (we paginate locally) AND if we (sort OR filter) locally we also need to paginate locally
                if (!config.pagination && (withChanges.sort || withChanges.filter)) {
                  withChanges.pagination = true;
                }

                // Now, apply: sort --> filter --> pagination     ( ORDER MATTERS!!! )

                if (withChanges.sort) {
                  this._lastSortedSource = this.applySort(this._lastSource, event.sort.curr || event.sort.prev);
                }

                let data: T[] = this._lastSortedSource;

                // we check if filter was asked, but also if we have a filter we re-run
                // Only sorting is cached at this point filtering is always calculated
                if (withChanges.filter || (!config.filter && event.filter.curr && event.filter.curr.filter)) {
                  data = this._lastFilteredSource = this.applyFilter(data, event.filter.curr || event.filter.prev);
                }

                if (withChanges.pagination) {
                  data = this.applyPagination(data);
                }

                const clonedEvent: TEvent = { ...event };

                // We use `combineLatest` which caches pervious events, only new events are replaced.
                // We need to mark everything as NOT CHANGED, so subsequent calls will not have their changed flag set to true.
                //
                // We also clone the object so we can pass on the proper values.
                // We create shallow clones so complex objects (column in sort, user data in data) will not throw on circular.
                // For pagination we deep clone because it contains primitives and we need to also clone the internal change objects.
                for (const k of TRIGGER_KEYS) {
                  clonedEvent[k] = k === 'pagination'
                    ? JSON.parse(JSON.stringify(event[k]))
                    : { ...event[k] }
                  ;
                  event[k].changed = false;
                }
                event.pagination.page.changed = event.pagination.perPage.changed = false;

                return {
                  event: clonedEvent,
                  data,
                  sorted: this._lastSortedSource,
                  filtered: this._lastFilteredSource,
                };
              }),
              tap( () => this.onEndOfEvent(event) ),
              // If runHandle() returned false, we will get undefined here, we do not emit these to the grid, nothing to do.
              filter( r => !!r ),
            );
        }),
      );
  }

  protected applyFilter(data: T[], dataSourceFilter: DataSourceFilter): T[] {
    data = filteringFn(data, dataSourceFilter);
    if (!this.config.pagination) {
      this.resetPagination(data.length);
    }
    return data;
  }

  protected applySort(data: T[], event: PblNgridDataSourceSortChange): T[] {
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

  protected onStartOfEvent(event: TEvent): void {
    this._inFlight.add(event);
  }

  protected onEndOfEvent(event: TEvent): void {
    this._inFlight.delete(event);
  }

  protected emitOnSourceChanging(event: TEvent) {
    this._onSourceChange$.next(SOURCE_CHANGING_TOKEN);
  }

  protected emitOnSourceChanged(event: TEvent, data: T[]) {
    this._onSourceChange$.next(data);
  }

  /**
   * Execute the user-provided function that returns the data collection.
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
  private runHandle(event: TEvent): Observable<false | T[]> {

    const result = this.sourceFactory(event);
    if (result === false) {
      return of(false);
    }

    this.emitOnSourceChanging(event);

    const obs: Observable<T[]> = Array.isArray(result)
      ? of(result)
      // else ->            observable : promise
      : (isObservable(result) ? result : from(result))
          .pipe(map( data => Array.isArray(data) ? data : [] )) // TODO: should we error? warn? notify?
    ;

    return obs.pipe(
      observeOn(asapScheduler, 0), // run as a micro-task
      tap( data => this.emitOnSourceChanged(event, data as T[]) ),
    );
  }

  /* Note:  Currently this is only used in the constructor.
            However, if called elsewhere (i.e. if we can re-init the adapter) we need to track all code that is using
            `onSourceChanged` and or `onSourceChanging` and make it support the replacement of the observable.
            Because the API is public it will probably won't work so the best solution might be to switch
            `onSourceChanged` and `onSourceChanging` to subjects that are alive always and emit them internally in this class. */
  private initStreams(): void {
    this._onSourceChange$ = new Subject<T[]>();
    this.onSourceChanged = this._onSourceChange$.pipe(filter( d => d !== SOURCE_CHANGING_TOKEN ));
    this.onSourceChanging = this._onSourceChange$.pipe(filter( d => d === SOURCE_CHANGING_TOKEN ));
    this._refresh$ = new Subject<RefreshDataWrapper<TData>>();
    this._lastSource = undefined;
  }
}
