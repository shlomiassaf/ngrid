import { SgPaginatorChangeEvent } from '../paginator';
import { SgTableDataSourceSortChange } from './types';
import { DataSourceFilter } from './filtering';

/** @internal */
export type RefreshDataWrapper<T> = { data: T };

/**
 * Data source event triggers map with triggers that the user can opt in a custom behaviour.
 * The properties represent the trigger name/key and the value represent the event input in it's raw form.
 */
export interface SgDataSourceConfigurableTriggers {
  filter?: DataSourceFilter;
  sort?: SgTableDataSourceSortChange;
  pagination?: SgPaginatorChangeEvent;
}

/**
 * Data source event triggers map.
 * The properties represent the trigger name/key and the value represent the event input in it's raw form.
 */
export interface SgDataSourceTriggers<T = any> extends SgDataSourceConfigurableTriggers {
  /**
   * Represents input from `refresh` emissions. T does not necessarily represents the type of the datasource.
   */
  data?: RefreshDataWrapper<T>;
}

export interface SgDataSourceTriggerCache<T = any> {
  filter?: DataSourceFilter;
  sort?: SgTableDataSourceSortChange;
  pagination?: {
    page?: any;
    perPage?: number;
  }
  data?: RefreshDataWrapper<T>;
}

export type SgDataSourceTriggerChange<T> = {
  changed: boolean;
  prev: T;
  curr?: T;
}

export interface SgDataSourceTriggerChangedEvent<T = any> {
  filter?: SgDataSourceTriggerChange<DataSourceFilter>;
  sort?: SgDataSourceTriggerChange<SgTableDataSourceSortChange>;
  pagination: {
    changed: boolean;
    page: SgDataSourceTriggerChange<any>;
    perPage: SgDataSourceTriggerChange<number>;
  }
  data: SgDataSourceTriggerChange<T>;

  /**
   * Set the total length of the paginator (for server-side rendering, client-side pagination is automatically set)
   */
  updateTotalLength(totalLength: number): void;
}

export type TriggerChangedEventResponse<T = any, TDate = any> = { event: SgDataSourceTriggerChangedEvent<TDate>; data: T[] };
