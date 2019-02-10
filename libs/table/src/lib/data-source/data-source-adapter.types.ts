import { PblPaginatorChangeEvent } from '../paginator';
import { PblTableDataSourceSortChange, DataSourceFilter } from './types';

/** @internal */
export type RefreshDataWrapper<T> = { data: T };

/**
 * Data source event triggers map with triggers that the user can opt in a custom behaviour.
 * The properties represent the trigger name/key and the value represent the event input in it's raw form.
 */
export interface PblDataSourceConfigurableTriggers {
  filter?: DataSourceFilter;
  sort?: PblTableDataSourceSortChange;
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
  sort?: PblTableDataSourceSortChange;
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

export interface PblDataSourceTriggerChangedEvent<T = any> {
  filter: PblDataSourceTriggerChange<DataSourceFilter>;
  sort: PblDataSourceTriggerChange<PblTableDataSourceSortChange>;
  pagination: {
    changed: boolean;
    page: PblDataSourceTriggerChange<any>;
    perPage: PblDataSourceTriggerChange<number>;
  }
  data: PblDataSourceTriggerChange<T>;


  /**
   * When true this is the first emission of data since the last connection.
   */
  isInitial: boolean;

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
