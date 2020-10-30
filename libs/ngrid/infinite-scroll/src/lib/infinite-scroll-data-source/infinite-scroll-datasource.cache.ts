import { PblInfiniteScrollCacheOptions } from './infinite-scroll-datasource.types';
import { createCacheAdapter, PblNgridCacheAdapter, StartOrEnd } from './caching';
import { PblInfiniteScrollDSContext } from './infinite-scroll-datasource.context';

function normalizeCacheOptions(options?: PblInfiniteScrollCacheOptions): PblInfiniteScrollCacheOptions {
  if (!options) {
    options = { type: 'noOpCache' };
  }
  return options;
}

export class PblInfiniteScrollDataSourceCache<T, TData = any> {
  get maxSize(): number { return this.cacheAdapter.maxSize; }
  get size(): number { return this.cacheAdapter.size; }
  get empty() { return this.cacheAdapter.empty; }

  private cacheAdapter: PblNgridCacheAdapter<any>;

  constructor(private readonly context: PblInfiniteScrollDSContext<T, TData>, options?: PblInfiniteScrollCacheOptions) {
    this.cacheAdapter = createCacheAdapter(context, normalizeCacheOptions(options));
    this.setCacheSize(300);
  }

  setCacheSize(maxSize: number) {
    this.cacheAdapter.setCacheSize(maxSize);
  }

  matchNewBlock() {
    const ds = this.context.getDataSource();
    const totalLength = this.context.totalLength;

    const renderEnd = ds.renderStart + ds.renderLength;
    const start = ds.renderStart;
    const end = totalLength ? Math.min(renderEnd, totalLength) : renderEnd;
    return this.cacheAdapter.createBlock(start, end, totalLength);
  }

  createInitialBlock() {
    const ds = this.context.getDataSource();
    const totalLength = this.context.totalLength;
    const renderEnd = ds.renderLength;
    const start =0;
    const end = totalLength ? Math.min(renderEnd, totalLength) : renderEnd;
    return this.cacheAdapter.createBlock(start, end, totalLength);
  }

  update(startRow: number, endRow: number, direction: StartOrEnd) {
    return this.cacheAdapter.update(startRow, endRow, direction);
  }

  clear() {
    return this.cacheAdapter.clear();
  }
}
