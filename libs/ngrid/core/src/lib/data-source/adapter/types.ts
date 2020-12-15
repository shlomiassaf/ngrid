import { DataSourceOf } from '../types';
import { PblPaginatorChangeEvent } from '../triggers/pagination/types';
import { DataSourceFilter } from '../triggers/filter/types';
import { PblNgridDataSourceSortChange } from '../triggers/sort/types';

/** @internal */
export type RefreshDataWrapper<T> = { data: T };

/**
 * Data source event triggers map with triggers that the user can opt in a custom behavior.
 * The properties represent the trigger name/key and the value represent the event input in it's raw form.
 */
export interface PblDataSourceConfigurableTriggers {
  filter?: DataSourceFilter;
  sort?: PblNgridDataSourceSortChange;
  pagination?: PblPaginatorChangeEvent;
}

/**
 * Data source event triggers map.
 * The properties represent the trigger name/key and the value represent the event input in it's raw form.
 */
export interface PblDataSourceTriggers<T = any> extends PblDataSourceConfigurableTriggers {
  /**
   * Represents input from `refresh` emissions. T does not necessarily represents the type of the datasource.
   */
  data?: RefreshDataWrapper<T>;
}

export interface PblDataSourceTriggerCache<T = any> {
  filter?: DataSourceFilter;
  sort?: PblNgridDataSourceSortChange;
  pagination?: {
    page?: any;
    perPage?: number;
  }
  data?: RefreshDataWrapper<T>;
}

export interface PblDataSourceTriggerChange<T> {
  changed: boolean;
  prev: T;
  curr?: T;
}

export interface PblDataSourceTriggerChangedEventSource {
  /**
   * The source of the event was a data request. Either via `refresh()` or the initial data request.
   */
  data: true;
  /**
   * The source of the event was a change in the filter, sort, pagination or a combination of them.
   */
  customTrigger: true;
}

export interface PblDataSourceTriggerChangedEvent<TData = any> {
  id: number,
  filter: PblDataSourceTriggerChange<DataSourceFilter>;
  sort: PblDataSourceTriggerChange<PblNgridDataSourceSortChange>;
  pagination: {
    changed: boolean;
    page: PblDataSourceTriggerChange<any>;
    perPage: PblDataSourceTriggerChange<number>;
  }
  data: PblDataSourceTriggerChange<TData>;


  /**
   * When true this is the first emission of data since the last connection.
   */
  isInitial: boolean;

  /**
   * The origin of this event, whether it is from a data request or from a custom trigger request (filter, sort and/or pagination).
   * Additional types might be added by plugins.
   */
  eventSource: keyof PblDataSourceTriggerChangedEventSource;

  /**
   * Set the total amount of data items.
   * For use with the paginator, update the total length of data items that the current returned source is part of.
   *
   * Use when custom trigger for pagination is enabled (server side mode, in client side mode the length is automatically set)
   */
  updateTotalLength(totalLength: number): void;
}

export type TriggerChangedEventResponse<T = any, TDate = any> = { event: PblDataSourceTriggerChangedEvent<TDate>; data: T[] };

export type TriggerChangedEventFor<P extends keyof PblDataSourceTriggerCache> = P extends keyof PblDataSourceTriggerChangedEvent ? PblDataSourceTriggerChangedEvent[P] :  PblDataSourceTriggerChange<PblDataSourceTriggerCache[P]>;

export interface PblDataSourceAdapterProcessedResult<T = any, TData = any>  {
  event: PblDataSourceTriggerChangedEvent<TData>;
  data: T[];
  sorted?: T[];
  filtered?: T[];
}

export type PblDataSourceTriggerChangeHandler<T, TEvent extends PblDataSourceTriggerChangedEvent<any>> = (event: TEvent) => (false | DataSourceOf<T>)
