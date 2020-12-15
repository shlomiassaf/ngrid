import { PblDataSourceBaseFactory, PblDataSourceAdapter } from '@pebula/ngrid/core';
import { PblInfiniteScrollFactoryOptions, PblInfiniteScrollDsOptions, PblInfiniteScrollTriggerChangedEvent, PblInfiniteScrollCacheOptions } from './infinite-scroll-datasource.types';
import { PblInfiniteScrollDSContext } from './infinite-scroll-datasource.context';
import { PblInfiniteScrollDataSource } from './infinite-scroll-datasource';
import { PblInfiniteScrollDataSourceAdapter } from './infinite-scroll-datasource-adapter';
import { PblNgridCacheAdapter, PblNgridCacheAdaptersMap } from './caching';

export class PblInfiniteScrollDSFactory<T, TData = any> extends PblDataSourceBaseFactory<T,
                                                                                         TData,
                                                                                         PblInfiniteScrollTriggerChangedEvent<TData>,
                                                                                         PblInfiniteScrollDataSourceAdapter<T, TData>,
                                                                                         PblInfiniteScrollDataSource<T, TData>> {
  private infiniteScrollOptions: PblInfiniteScrollDsOptions;
  private cacheOptions: PblInfiniteScrollCacheOptions;

  private context: PblInfiniteScrollDSContext<T, TData>;

  withInfiniteScrollOptions(options: PblInfiniteScrollDsOptions): this {
    this.infiniteScrollOptions = options;
    return this;
  }

  withCacheOptions<P extends keyof PblNgridCacheAdaptersMap>(type: P, options?: PblNgridCacheAdaptersMap[P] extends PblNgridCacheAdapter<infer U> ? U : never): this {
    this.cacheOptions = { type, options: options as any };
    return this;
  }

  create(): PblInfiniteScrollDataSource<T, TData> {
    const factoryOptions: PblInfiniteScrollFactoryOptions<T, TData> = {
      onTrigger: this._adapter.onTrigger,
      customTriggers: this._adapter.customTriggers,
      onCreated: this._onCreated,
      dsOptions: this._dsOptions,
      infiniteOptions: this.infiniteScrollOptions,
      cacheOptions: this.cacheOptions,
    };

    this.context = new PblInfiniteScrollDSContext(factoryOptions);
    super.onCreated(null);

    return super.create();
  }

  protected createAdapter(): PblInfiniteScrollDataSourceAdapter<T, TData> {
    return this.context.getAdapter();
  }

  protected createDataSource(adapter: PblDataSourceAdapter<T, TData, PblInfiniteScrollTriggerChangedEvent<TData>>): PblInfiniteScrollDataSource<T, TData> {
    return this.context.getDataSource();
  }
}

export function createInfiniteScrollDS<T, TData = T[]>(): PblInfiniteScrollDSFactory<T, TData> {
  return new PblInfiniteScrollDSFactory<T, TData>();
}
