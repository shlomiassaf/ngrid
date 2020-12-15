import { PblDataSource } from './data-source';
import { PblDataSourceAdapter } from './adapter/adapter';
import { PblDataSourceBaseFactory } from './base/factory';

export class PblDataSourceFactory<T, TData = any> extends PblDataSourceBaseFactory<T, TData> {
  protected createAdapter(): PblDataSourceAdapter<T, TData> {
    return new PblDataSourceAdapter<T, TData>(this._adapter.onTrigger, this._adapter.customTriggers || false);
  }

  protected createDataSource(adapter: PblDataSourceAdapter<T, TData>): PblDataSource<T, TData> {
    return new PblDataSource<T, TData>(adapter, this._dsOptions);
  }
}

export function createDS<T, TData = T[]>(): PblDataSourceFactory<T, TData> {
  return new PblDataSourceFactory<T, TData>();
}
