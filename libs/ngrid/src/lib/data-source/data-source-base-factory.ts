import { PblDataSource, DataSourceOf, PblDataSourceOptions } from './data-source';
import { PblDataSourceAdapter } from './data-source-adapter';
import {
  PblDataSourceConfigurableTriggers,
  PblDataSourceTriggerChangedEvent,
  PblDataSourceTriggerChangeHandler,
 } from './data-source-adapter.types';

interface AdapterParams<T, TEvent extends PblDataSourceTriggerChangedEvent<any> = PblDataSourceTriggerChangedEvent<any>> {
  onTrigger?: PblDataSourceTriggerChangeHandler<T, TEvent>;
  customTriggers?: false | Partial<Record<keyof PblDataSourceConfigurableTriggers, boolean>>;
}

export abstract class PblDataSourceBaseFactory<T,
                                               TData = any,
                                               TEvent extends PblDataSourceTriggerChangedEvent<TData> = PblDataSourceTriggerChangedEvent<TData>,
                                               TDataSourceAdapter extends PblDataSourceAdapter<T, TData, TEvent> = PblDataSourceAdapter<T, TData, TEvent>,
                                               TDataSource extends PblDataSource<T, TData, TEvent> = PblDataSource<T, TData, TEvent>,
                                              > {
  protected _adapter: AdapterParams<T, TEvent> = { };
  protected _dsOptions: PblDataSourceOptions = { };
  protected _onCreated: (dataSource: TDataSource) => void;

  /**
   * Set the main trigger handler.
   * The trigger handler is the core of the datasource, responsible for returning the data collection.
   *
   * By default the handler is triggered only when the datasource is required.
   * This can happened when:
   *   - The table connected to the datasource.
   *   - A manual call to `PblDataSource.refresh()` was invoked.
   *
   * There are additional triggers (filter/sort/pagination) which occur when their values change, e.g. when
   * a filter has change or when a page in the paginator was changed.
   *
   * By default, these triggers are handled automatically, resulting in a client-side behavior for each of them.
   * For example, a client side paginator will move to the next page based on an already existing data collection (no need to fetch from the server).
   *
   * To handle additional trigger you need to explicitly set them using `setCustomTriggers`.
   */
  onTrigger(handler: PblDataSourceTriggerChangeHandler<T, TEvent>): this {
    this._adapter.onTrigger = handler;
    return this;
  }

  /**
   * A list of triggers that will be handled by the trigger handler.
   * By default all triggers are handled by the adapter, resulting in a client-side filter/sort/pagination that works out of the box.
   * To implement server side filtering, sorting and/or pagination specify which should be handled by the on trigger handler.
   *
   * You can mix and match, e.g. support only paging from the server, or only paging and sorting, and leave filtering for the client side.
   */
  setCustomTriggers(...triggers: Array<keyof PblDataSourceConfigurableTriggers>): this {
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

  onCreated(handler: (dataSource: TDataSource) => void ): this {
    this._onCreated = handler;
    return this;
  }

  create(): TDataSource {
    const ds = this.createDataSource(this.createAdapter());
    if (this._onCreated) {
      this._onCreated(ds);
    }
    return ds;
  }

  protected abstract createAdapter(): TDataSourceAdapter;
  protected abstract createDataSource(adapter: TDataSourceAdapter): TDataSource;
}

