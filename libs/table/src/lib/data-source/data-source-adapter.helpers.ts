import { PblNgridDataSourceSortChange, DataSourceFilter } from './types';

import {
  RefreshDataWrapper,
  PblDataSourceTriggerChange,
  PblDataSourceTriggers,
  PblDataSourceTriggerCache,
  PblDataSourceTriggerChangedEvent,
  TriggerChangedEventFor,
} from './data-source-adapter.types';

export const EMPTY: any = Object.freeze({});

/** @internal */
export type DEEP_COMPARATORS<K extends keyof PblDataSourceTriggerCache> = {
  [P in K]?: (prev: PblDataSourceTriggerCache[P], curr: PblDataSourceTriggerCache[P]) => boolean;
};

export const DEEP_COMPARATORS: DEEP_COMPARATORS<keyof PblDataSourceTriggerCache> = {
  filter(prev: DataSourceFilter, curr: DataSourceFilter): boolean {
    return prev.filter === curr.filter
      && prev.type == curr.type;
      // TODO: deep compare columns
      // && (prev.columns || []).join() === (curr.columns || []).join();
  },
  sort(prev: PblNgridDataSourceSortChange, curr: PblNgridDataSourceSortChange): boolean {
    if (prev.column === curr.column) {
      const pSort = prev.sort || {};
      const cSort = curr.sort || {};
      return pSort.order === cSort.order && pSort.sortFn === cSort.sortFn;
    }
  },
  data(prev: RefreshDataWrapper<any>, curr: RefreshDataWrapper<any>): boolean {
    return prev === curr;
  }
};

export function fromRefreshDataWrapper<T>(change: PblDataSourceTriggerChange<RefreshDataWrapper<T>>): PblDataSourceTriggerChange<T> {
  return {
    changed: change.changed,
    prev: change.prev.data,
    curr: change.hasOwnProperty('curr') ? change.curr.data : change.prev.data,
  };
}

export type CoValue<P extends keyof PblDataSourceTriggerCache> = P extends keyof PblDataSourceTriggers ? PblDataSourceTriggers[P] : PblDataSourceTriggerCache[P];

export function createChangeContainer<P extends keyof PblDataSourceTriggerCache>(type: P,
                                                                                value: CoValue<P>,
                                                                                cache: PblDataSourceTriggerCache): TriggerChangedEventFor<P> {
  if (type === 'pagination') {
    const pagination: PblDataSourceTriggers['pagination'] = (value || {}) as any;
    const cached = cache['pagination'];
    // we compare weak because we dont want changes from undefined to null etc...
    const changedKeys: Array<keyof PblDataSourceTriggers['pagination']> = Object.keys(pagination).filter( k => cached[k] != pagination[k][1] && k !== 'total') as any;

    const event: PblDataSourceTriggerChangedEvent['pagination'] = {
      changed: changedKeys.length > 0,
      page: createNotChangedEvent(cached.page),
      perPage: createNotChangedEvent(cached.perPage),
    };
    if (event.changed) {
      for (const k of changedKeys) {
        event[k].changed = true;
        event[k].prev = pagination[k][0];
        event[k].curr = cached[k] = pagination[k][1];
      }
    }
    return event as TriggerChangedEventFor<P>;
  } else {
    value = value || EMPTY;
    const cachedValue = cache[type];
    if (value === cachedValue) {
      return createNotChangedEvent(cachedValue) as any;
    } else if (value !== EMPTY && cachedValue !== EMPTY) {
      const fn: (prev: PblDataSourceTriggerCache[P], curr: PblDataSourceTriggerCache[P]) => boolean = DEEP_COMPARATORS[type];
      if (fn(cachedValue, value as any)) {
        return createNotChangedEvent(cachedValue) as any;
      }
    }
    cache[type] = value as any;
    return { changed: true, prev: cachedValue, curr: value } as any;
  }
}

function createNotChangedEvent<T>(value: T): PblDataSourceTriggerChange<T> {
  return { changed: false, prev: value, curr: value };
}
