import { take } from 'rxjs/operators';
import { PblDataSource, PblDataSourceOptions, PblNgridRowContext } from '@pebula/ngrid';
import { PblInfiniteScrollDSContext } from './infinite-scroll-datasource.context';
import { INFINITE_SCROLL_DEFFERED_ROW } from './infinite-scroll-deffered-row';
import { PblInfiniteScrollDataSourceAdapter } from './infinite-scroll-datasource-adapter';

export class PblInfiniteScrollDataSource<T = any, TData = any> extends PblDataSource<T, TData, PblInfiniteScrollDataSourceAdapter<T, TData>> {

  get maxCacheSize() { return this.context.cache.maxSize; }
  get cacheSize() { return this.context.cache.size; }

  constructor(private readonly context: PblInfiniteScrollDSContext<T, TData>, options?: PblDataSourceOptions) {
    super(context.getAdapter(), options);
  }

  setCacheSize(maxSize: number) {
    this.context.cache.setCacheSize(maxSize);
  }

  purgeCache() {
    const source = this.source;
    for (const [start, end] of this.context.cache.clear()) {
      for (let i = start; i <= end; i++) {
        source[i] = INFINITE_SCROLL_DEFFERED_ROW;
      }
    }
    this.refresh();
  }

  isVirtualRow(row: any) {
    return row === INFINITE_SCROLL_DEFFERED_ROW;
  }

  isVirtualContext(context: PblNgridRowContext<any>) {
    return context.$implicit === INFINITE_SCROLL_DEFFERED_ROW;
  }

  /**
   * Update the size of the datasource to reflect a virtual size.
   * This will extend the scrollable size of the grid.
   *
   * > Note that you can only add to the size, if the current size is larger than the new size nothing will happen.
   */
  updateVirtualSize(newSize: number) {
    if (this.adapter.inFlight) {
      this.onRenderDataChanging
        .pipe(take(1))
        .subscribe(r => {
          PblInfiniteScrollDataSource.updateVirtualSize(newSize, r.data);
          // we must refire so virtual scroll viewport can catch it
          // because it also listen's to this stream but it is registered before us.
          // See virtual-scroll/virtual-scroll-for-of.ts where "dataStream" is assigned
          this._onRenderDataChanging.next(r);
        });
    } else {
      PblInfiniteScrollDataSource.updateVirtualSize(newSize, this.source);
    }
  }

  static updateVirtualSize(newSize: number, values: any[]) {
    if (values && values.length < newSize) {
      for (let i = values.length; i < newSize; i++) {
        values[i] = INFINITE_SCROLL_DEFFERED_ROW;
      }
    }
  }
}
