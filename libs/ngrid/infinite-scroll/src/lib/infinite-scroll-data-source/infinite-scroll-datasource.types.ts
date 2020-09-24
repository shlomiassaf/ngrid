import {
  PblDataSourceTriggerChangedEvent,
  PblDataSourceTriggerChangeHandler,
  PblDataSource,
  PblDataSourceConfigurableTriggers,
  PblDataSourceOptions
} from '@pebula/ngrid';
import { PblNgridCacheAdaptersMap } from './caching';
import { PblNgridCacheAdapter } from './caching/cache-adapter';

export interface PblInfiniteScrollFactoryOptions<T, TData = any> {
  onTrigger: PblDataSourceTriggerChangeHandler<T, PblInfiniteScrollTriggerChangedEvent<TData>>;
  onCreated?: (dataSource: PblDataSource<T, TData>) => void;
  customTriggers?: false | Partial<Record<keyof PblDataSourceConfigurableTriggers, boolean>>;
  dsOptions?: PblDataSourceOptions;
  infiniteOptions?: PblInfiniteScrollDsOptions;
  cacheOptions: PblInfiniteScrollCacheOptions;
}

export interface PblInfiniteScrollCacheOptions<P extends keyof PblNgridCacheAdaptersMap = keyof PblNgridCacheAdaptersMap> {
  type: P;
  options?: PblNgridCacheAdaptersMap[P] extends PblNgridCacheAdapter<infer U> ? U : never;
}

export interface PblInfiniteScrollDsOptions {

  /**
   * The block size of pages.
   * When reaching the end of the data available, the datasource will fire an event to fetch the next block / page.
   * The size of that block is set in this property.
   * The datasource will provide "fromRow" and "toRow" in the event as well as "offset", where the toRow and offset are calculated based on he "fromRow" and block size.
   *
   * It is also important to note that the totalLength defined will effect this value, when calculating the last block based on the totalLength.\
   * @default 50ß
   */
  blockSize?: number;

  /**
   * The initial size of the datasource as reflected to the user through the scrollable size of the grid.
   * With initial virtual size you can create a smoother feeling when scrolling as all virtual rows will be used as a placeholder
   * until actual rows are fetched.
   * If no virtual size is set or virtual rows are all populated the next fetch will add to the scrollable size and
   * the fluent scrolling effect will be limited.
   *
   * You can also set this value at runtime, see `PblInfiniteScrollDataSource.updateVirtualSize`
   *
   * Make sure you are not assigning a very high value here (e.g. 500K) as it will take
   * some time to generate. If you have a large value, set the initial size to somewhere reasonable and add virtual rows later
   * as the user scrolls.
   */
  initialVirtualSize?: number;

}

export interface PblInfiniteScrollTriggerChangedEvent<TData = any> extends PblDataSourceTriggerChangedEvent<TData> {
  /**
   * The total length currently defined
   */
  totalLength: number;

  /**
   * When true, indicates that the fetching is done for the last block / page in the datasource.
   * It means that the this trigger event will fetch the items located at the end of the data source.
   *
   * This situation depends on the block size and `PblInfiniteScrollDsOptions.minBlockSize` definition and
   * the fact that a datasource size is defined either through `PblInfiniteScrollDsOptions.initialDataSourceSize` or
   * dynamically through `PblDataSourceTriggerChangedEvent.updateTotalLength()`.
   *
   * You can use this flag to detect this scenario and extend / enlarge the datasource total size if needed.
   *
   * > Note that, on top of all of the above, this will only fire when `direction` is 1.
   */
  isLastBlock?: boolean;

  /** The starting row index of the items to fetch */
  fromRow: number;
  /** The ending row index of the items to fetch */
  toRow: number;
  /** The total amount of new items to fetch */
  offset: number;
  /**
   * The direction of scrolling.
   * Where 1 means scrolling down and -1 means scrolling up.
   */
  direction: -1 | 1;

}
