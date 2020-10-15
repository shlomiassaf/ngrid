import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, finalize, take, filter, map } from 'rxjs/operators';
import { PblDataSourceTriggerChangedEvent, DataSourceOf, PblDataSourceConfigurableTriggers } from '@pebula/ngrid';
import { PblInfiniteScrollFactoryOptions, PblInfiniteScrollDsOptions, PblInfiniteScrollTriggerChangedEvent } from './infinite-scroll-datasource.types';
import { PblInfiniteScrollDataSourceCache } from './infinite-scroll-datasource.cache';
import { normalizeOptions, shouldTriggerInvisibleScroll, tryAddVirtualRowsBlock, updateCacheAndDataSource, upgradeChangeEventToInfinite } from './utils';
import { PblInfiniteScrollDataSource } from './infinite-scroll-datasource';
import { SKIP_SOURCE_CHANGING_EVENT, PblInfiniteScrollDataSourceAdapter } from './infinite-scroll-datasource-adapter';
import { TriggerExecutionQueue } from './trigger-execution-queue';
import { CacheBlock } from './caching';
import { EventState } from './event-state';

// const LOG = msg => { console.log(msg); }

declare module '@pebula/ngrid/lib/data-source/data-source-adapter.types' {
  interface PblDataSourceTriggerChangedEventSource {
   /**
    * The source of the event was from a scroll that reached into a group of rows that the grid needs to fetch.
    */
    infiniteScroll: true;
  }
}

export class PblInfiniteScrollDSContext<T, TData = any> {

  options: PblInfiniteScrollDsOptions;
  totalLength: number;
  cache: PblInfiniteScrollDataSourceCache<T, TData>;

  private ds: PblInfiniteScrollDataSource<T, TData>;
  private adapter: PblInfiniteScrollDataSourceAdapter<T, TData>;
  private currentSessionToken: any;
  private queue: TriggerExecutionQueue<T, TData>;
  private onVirtualLoading = new BehaviorSubject<boolean>(false);
  private virtualLoadingSessions = 0;
  private pendingTrigger$: Observable<T[]>;
  private customTriggers: false | Partial<Record<keyof PblDataSourceConfigurableTriggers, boolean>>;
  private timeoutCancelTokens = new Set<number>();
  private ignoreScrolling: boolean = false;
  private lastEventState = new EventState<T>();

  constructor(private factoryOptions: PblInfiniteScrollFactoryOptions<T, TData>) {
    this.options = normalizeOptions(factoryOptions.infiniteOptions);
    if (this.options.initialVirtualSize > 0) {
      this.totalLength = this.options.initialVirtualSize;
    }
    this.queue = new TriggerExecutionQueue<T, TData>(this.factoryOptions.onTrigger);
  }

  onTrigger(rawEvent: PblDataSourceTriggerChangedEvent<TData>): false | DataSourceOf<T> {
    if (rawEvent.isInitial) {
      return this.invokeInitialOnTrigger(rawEvent);
    }

    rawEvent[SKIP_SOURCE_CHANGING_EVENT] = true;
    if (this.pendingTrigger$) {
      const pendingTrigger$ = this.pendingTrigger$;
      this.pendingTrigger$ = undefined;
      if (rawEvent.data.changed && (rawEvent.data.curr as any) === pendingTrigger$) {
        return pendingTrigger$
          .pipe(
            finalize(() => {
              // LOG(`PENDING - RESULT DONE`);
              this.deferSyncRows(16, () => this.tickVirtualLoading(-1));
              this.currentSessionToken = undefined;
            }));
      }
    }

    if (this.currentSessionToken && rawEvent.data.changed && rawEvent.data.curr === this.currentSessionToken) {
      if (this.ds.hostGrid.viewport.isScrolling) {
        this.handleScrolling(rawEvent);
        return of(this.ds.source);
      }

      const { result, event } = this.invokeRuntimeOnTrigger(rawEvent);
      if (!result || !event) { // !event for type gate, because if we have "result: then "event" is always set
        // LOG('NO SCROLL - FALSE TRIGGER!');
        this.currentSessionToken = undefined;
        return false;
      } else {
        const { source } = this.ds;
        if (tryAddVirtualRowsBlock(source, event, this.options.blockSize)) {
          this.pendingTrigger$ = result;
          this.tickVirtualLoading(1);
          // LOG('NO SCROLL - VIRTUAL ROWS ADDED');
          return of(source)
            .pipe(
              finalize(() => {
                this.deferSyncRows();
                // LOG('NO SCROLL - VIRTUAL ROWS RENDERED');
                this.currentSessionToken = undefined;
                this.ds.refresh(result as any);
              }));
        } else {
          // LOG('NO SCROLL - NO VIRTUAL ROWS ADDED');
          return result
            .pipe(
              finalize(() => {
                // LOG(`NO SCROLL - RESULT DONE`);
                this.deferSyncRows(16);
                this.currentSessionToken = undefined;
              }));
        }
      }
    }

    if (rawEvent.data.changed || (this.customTriggers && PblInfiniteScrollDataSourceAdapter.isCustomBehaviorEvent(rawEvent, this.customTriggers))) {
      this.cache.clear();
      delete rawEvent[SKIP_SOURCE_CHANGING_EVENT];
      return this.invokeInitialOnTrigger(rawEvent);
    }

    return false;
    // throw new Error('Invalid');
  }

  getAdapter(): PblInfiniteScrollDataSourceAdapter<T, TData> {
    if (!this.adapter) {
      this.customTriggers = this.factoryOptions.customTriggers || false;
      // we can't allow any internal trigger handlers to run
      // It will throw the entire datasource out of sync, infinite ds can't do that
      this.adapter = new PblInfiniteScrollDataSourceAdapter<T, TData>(this, { filter: true, sort: true, pagination: true }, this.onVirtualLoading);
    }
    return this.adapter;
  }

  getDataSource(): PblInfiniteScrollDataSource<T, TData> {
    if (!this.ds) {
      this.ds = new PblInfiniteScrollDataSource<T, TData>(this, this.factoryOptions.dsOptions)
      this.cache = new PblInfiniteScrollDataSourceCache<T, TData>(this, this.factoryOptions.cacheOptions);
      this.ds.onRenderedDataChanged.subscribe(() => this.onRenderedDataChanged() );
      if (this.factoryOptions.onCreated) {
        this.factoryOptions.onCreated(this.ds);
      }
    }
    return this.ds;
  }

  dispose() {
    this.onVirtualLoading.complete();
    for (const t of this.timeoutCancelTokens.values()) {
      clearTimeout(t);
    }
  }

  /**
   * This is where we detect if we need to internally invoke a trigger because we've reached an area
   * in the grid where row's does not exists but we show the dummy row, hence we need to fetch them.
   * The grid will never trigger an event here since from the grid's perspective a row is showing...
   * This detection also handle's scrolling and session so we don't invoke the trigger to much.
   */
  private onRenderedDataChanged() {
    if (this.lastEventState.skipNextRender()) {
      // if the current event returned items that did not occupy the whole range of the event
      // stop, we don't want to check anything cause we already know we are missing items.
      // since we know we're missing items, we also know we're going to call the same range again which
      // did not return anyway, so it is useless and in the worst case might cause infinite loop
      return;
    }
    if (!this.currentSessionToken) {
      if (shouldTriggerInvisibleScroll(this)) {
        // LOG(`RENDER DATA CHANGED FROM ROW ${this.ds.renderStart}`);
        const t = this.currentSessionToken = {};
        this.safeAsyncOp(() => {
          if (this.currentSessionToken === t) {
            this.ds.refresh(t as any);
          }
        }, 16);
      }
    } else {
      // LOG(`RENDER DATA WITH SESSION FROM ROW ${this.ds.renderStart}`);
      if (!this.ds.hostGrid.viewport.isScrolling) {
        // LOG(`SESSION OVERRIDE`);
        this.ds.refresh(this.currentSessionToken = {} as any);
      } else {
        if (!this.ignoreScrolling) {
          this.ignoreScrolling = true;
          this.ds.hostGrid.viewport.scrolling
            .pipe(
              filter( d => d === 0),
              take(1),
            )
            .subscribe(d => {
              this.ignoreScrolling = false;
              if (shouldTriggerInvisibleScroll(this)) {
                // LOG(`OVERRIDING AFTER SCROLL SESSION`);
                this.currentSessionToken = undefined;
                this.onRenderedDataChanged();
              }
            });
        }
      }
    }
  }

  /**
   * Create a new event state for the given event, store it in the lastEventState property
   * and returns a pipe that will sync the state of the event as the call progress.
   * @param event
   */
  private wrapEventState(event: PblInfiniteScrollTriggerChangedEvent<TData>) {
    return (this.lastEventState = new EventState<T>(event)).pipe();
  }

  private deferSyncRows(ms = 0, runBefore?: () => void, runAfter?: () => void) {
    this.safeAsyncOp(() => {
      runBefore && runBefore();
      this.ds.hostGrid.rowsApi.syncRows('data', true);
      runAfter && runAfter();
    }, ms);
  }

  private safeAsyncOp(fn: () => void, delay: number) {
    const cancelToken = setTimeout(() => {
      this.timeoutCancelTokens.delete(cancelToken);
      fn();
    }, delay) as unknown as number;
    this.timeoutCancelTokens.add(cancelToken);
  }

  private tickVirtualLoading(value: -1 | 1) {
    this.virtualLoadingSessions = this.virtualLoadingSessions + value;
    const inVirtualLoad = this.onVirtualLoading.value;
    switch (this.virtualLoadingSessions) {
      case 0:
        inVirtualLoad && this.onVirtualLoading.next(false);
        break;
      case 1:
        !inVirtualLoad && this.onVirtualLoading.next(true);
        break;
      default:
        if (this.virtualLoadingSessions < 0) {
          this.virtualLoadingSessions = 0;
        }
        break;
    }
  }

  private handleScrolling(rawEvent: PblDataSourceTriggerChangedEvent<TData>) {
    this.tickVirtualLoading(1);
    const newBlock = this.cache.matchNewBlock();
    const event = newBlock ? this.tryGetInfiniteEvent(rawEvent, newBlock) : false as const;
    if (event !== false) {
      if (tryAddVirtualRowsBlock(this.ds.source, event, this.options.blockSize)) {
        // LOG('SCROLL - VIRTUAL ROWS ADDED');
      }
    }

    this.ds.hostGrid.viewport.scrolling
      .pipe(
        filter( d => d === 0),
        take(1),
      )
      .subscribe(d => {
        const { result } = this.invokeRuntimeOnTrigger(rawEvent);
        if (!!result) {
          if (this.pendingTrigger$) {
            this.tickVirtualLoading(-1);
          }
          this.ds.refresh(this.pendingTrigger$ = result as any);
        } else if (!this.pendingTrigger$) {
          this.ds.refresh(this.pendingTrigger$ = of(this.ds.source) as any);
        } else {
          this.tickVirtualLoading(-1);
        }
      });
  }

  private invokeInitialOnTrigger(rawEvent: PblDataSourceTriggerChangedEvent<TData>): false | DataSourceOf<T> {
    const event = this.tryGetInfiniteEvent(rawEvent, rawEvent.isInitial ? this.cache.createInitialBlock() : this.cache.createInitialBlock());
    const result = this.queue.execute(event);
    return result && result.pipe(
      this.wrapEventState(event),
      tap( values => {
        this.cache.clear();
        if(values.length > 1) {
          this.cache.update(0, values.length - 1, 1);
        }

        PblInfiniteScrollDataSource.updateVirtualSize(this.options.initialVirtualSize, values);
        if (!rawEvent.isInitial) {
          this.ds.hostGrid.viewport.scrollToOffset(0);
        }
      }),
    );
  }

  private invokeRuntimeOnTrigger(rawEvent: PblDataSourceTriggerChangedEvent<TData>): { result?: Observable<T[]>; event: false | PblInfiniteScrollTriggerChangedEvent<TData> } {
    const newBlock = this.cache.matchNewBlock();
    const event = newBlock ? this.tryGetInfiniteEvent(rawEvent, newBlock) : false as const;

    if(event !== false) {
      if (this.lastEventState.isDone() && this.lastEventState.rangeEquals(event)) {
        return { event: false };
      }
      event.eventSource = 'infiniteScroll';
      const triggerResult = this.queue.execute(event, true);
      if (triggerResult !== false) {
        return {
          event,
          result: triggerResult
            .pipe(
              // tap( () => LOG(`TRIGGER[${event.id}]: ${event.fromRow} - ${event.toRow}`)),
              this.wrapEventState(event),
              map( values => updateCacheAndDataSource(this, event, values) ),
            ),
        };
      }
    }

    return { event };
  }

  private tryGetInfiniteEvent(rawEvent: PblDataSourceTriggerChangedEvent<TData>, block: CacheBlock) {
    const totalLength = this.totalLength || 0;
    rawEvent.updateTotalLength = (totalLength: number) => { this.totalLength = totalLength; };
    (rawEvent as PblInfiniteScrollTriggerChangedEvent).totalLength = totalLength;
    return upgradeChangeEventToInfinite<T, TData>(totalLength, rawEvent, block);
  }

}
