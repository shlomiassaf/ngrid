import { NegPaginatorChangeEvent } from '../paginator';
import { NegTableDataSourceSortChange, DataSourceFilter } from './types';

/** @internal */
export type RefreshDataWrapper<T> = { data: T };

/**
 * Data source event triggers map with triggers that the user can opt in a custom behaviour.
 * The properties represent the trigger name/key and the value represent the event input in it's raw form.
 */
export interface NegDataSourceConfigurableTriggers {
  filter?: DataSourceFilter;
  sort?: NegTableDataSourceSortChange;
  pagination?: NegPaginatorChangeEvent;
}

/**
 * Data source event triggers map.
 * The properties represent the trigger name/key and the value represent the event input in it's raw form.
 */
export interface NegDataSourceTriggers<T = any> extends NegDataSourceConfigurableTriggers {
  /**
   * Represents input from `refresh` emissions. T does not necessarily represents the type of the datasource.
   */
  data?: RefreshDataWrapper<T>;
}

export interface NegDataSourceTriggerCache<T = any> {
  filter?: DataSourceFilter;
  sort?: NegTableDataSourceSortChange;
  pagination?: {
    page?: any;
    perPage?: number;
  }
  data?: RefreshDataWrapper<T>;
}

export type NegDataSourceTriggerChange<T> = {
  changed: boolean;
  prev: T;
  curr?: T;
}

export interface NegDataSourceTriggerChangedEvent<T = any> {
  filter?: NegDataSourceTriggerChange<DataSourceFilter>;
  sort?: NegDataSourceTriggerChange<NegTableDataSourceSortChange>;
  pagination: {
    changed: boolean;
    page: NegDataSourceTriggerChange<any>;
    perPage: NegDataSourceTriggerChange<number>;
  }
  data: NegDataSourceTriggerChange<T>;

  /**
   * Set the total length of the paginator (for server-side rendering, client-side pagination is automatically set)
   */
  updateTotalLength(totalLength: number): void;
}

export type TriggerChangedEventResponse<T = any, TDate = any> = { event: NegDataSourceTriggerChangedEvent<TDate>; data: T[] };

export type TriggerChangedEventFor<P extends keyof NegDataSourceTriggerCache> = P extends keyof NegDataSourceTriggerChangedEvent ? NegDataSourceTriggerChangedEvent[P] :  NegDataSourceTriggerChange<NegDataSourceTriggerCache[P]>;
