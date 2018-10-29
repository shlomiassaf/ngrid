import { SgDataSource, DataSourceOf, SgDataSourceOptions } from './data-source';
import { SgDataSourceAdapter } from './data-source-adapter';
import {
  SgDataSourceConfigurableTriggers,
  SgDataSourceTriggerChangedEvent,
 } from './data-source-adapter.types';

interface AdapterParams<T> {
  onTrigger?: (event: SgDataSourceTriggerChangedEvent) => (false | DataSourceOf<T>);
  customTriggers?: false | Partial<Record<keyof SgDataSourceConfigurableTriggers, boolean>>;
}

export class SgDataSourceFactory<T, TData = any> {
  private _adapter: AdapterParams<T> = { };
  private _dsOptions: SgDataSourceOptions = { };
  private _onCreated: (dataSource: SgDataSource<T, TData>) => void;

  /**
   * Set the main trigger handler.
   * The trigger handler is the core of the datasource, responsible for returning the data collection.
   *
   * By default the handler is triggered only when the datasource is required.
   * This can happend when:
   *   - The table connected to the datasource.
   *   - A manual call to `SgDataSource.refresh()` was invoked.
   *
   * There are additional triggers (filter/sort/pagiantion) which occur when their values change, e.g. when
   * a filter has change or when a page in the paginator was changed.
   *
   * By default, these triggeres are handled automatically, resulting in a client-side behaviour for each of them.
   * For example, a client side paginator will move to the next page based on an already existing data collection (no need to fetch from the server).
   *
   * To handle additional trigger you need to explicitly set them using `setCustomTriggers`.
   */
  onTrigger(handler: (event: SgDataSourceTriggerChangedEvent<TData>) => (false | DataSourceOf<T>)): this {
    this._adapter.onTrigger = handler;
    return this;
  }

  /**
   * A list of triggers that will be handled by the trigger handler.
   * By default all triggers are handled by the adapter, resulting in a client-side filter/sort/pagiantion that works out of the box.
   * To implement server side filtering, sorting and/or pagination specify which should be handled by the on trigger handler.
   *
   * You can mix and match, e.g. support only paging from the server, or only paging and sorting, and leave filtering for the client side.
   */
  setCustomTriggers(...triggers: Array<keyof SgDataSourceConfigurableTriggers>): this {
    if (triggers.length === 0) {
      this._adapter.customTriggers = false;
    } else {
      const customTriggers = this._adapter.customTriggers = {};
      for (const t of triggers) {
        customTriggers[t] = true;
      }
    }
    return this;
  }

  /**
   * Skip the first trigger emission.
   * Use this for late binding, usually with a call to refresh() on the data source.
   *
   * Note that only the internal trigger call is skipped, a custom calls to refresh will go through
   */
  skipInitialTrigger(): this {
    this._dsOptions.skipInitial = true;
    return this;
  }

  keepAlive(): this {
    this._dsOptions.keepAlive = true;
    return this;
  }

  onCreated(handler: (dataSource: SgDataSource<T, TData>) => void ): this {
    this._onCreated = handler;
    return this;
  }

  create(): SgDataSource<T, TData> {
    const _adapter = this._adapter;
    const adapter = new SgDataSourceAdapter<T, TData>(
      _adapter.onTrigger,
      _adapter.customTriggers || false,
    )
    const ds = new SgDataSource<T, TData>(adapter, this._dsOptions);
    if (this._onCreated) {
      this._onCreated(ds);
    }
    return ds;
  }
}

export function createDS<T, TData = T[]>(): SgDataSourceFactory<T, TData> {
  return new SgDataSourceFactory<T, TData>();
}
