import { PblDataSourceTriggerChangedEvent } from '@pebula/ngrid';
import { CacheBlock } from './caching';
import { PblInfiniteScrollDSContext } from './infinite-scroll-datasource.context';
import { PblInfiniteScrollDsOptions, PblInfiniteScrollTriggerChangedEvent } from './infinite-scroll-datasource.types';
import { INFINITE_SCROLL_DEFFERED_ROW } from './infinite-scroll-deffered-row';

export function normalizeOptions(rawOptions: PblInfiniteScrollDsOptions) {
  const options: PblInfiniteScrollDsOptions = rawOptions || {};

  options.blockSize = Number(options.blockSize);
  if (Number.isNaN(options.blockSize)) {
    options.blockSize = 50;
  } else if (options.blockSize <= 0) {
    options.blockSize = 50;
  }

  options.initialVirtualSize = Number(options.initialVirtualSize);
  if (Number.isNaN(options.initialVirtualSize)) {
    options.initialVirtualSize = 0;
  }

  return options;
}

export function shouldTriggerInvisibleScroll<T, TData = any>(context: PblInfiniteScrollDSContext<T, TData>) {
  const ds = context.getDataSource();
  if (context.totalLength && ds.renderStart > context.totalLength) {
    return false;
  }

  return !!(context.cache.matchNewBlock());
}

export function tryAddVirtualRowsBlock<T>(source: T[], event: PblInfiniteScrollTriggerChangedEvent<any>, blockSize: number) {
  const currLen = source.length;
  if (currLen < event.totalLength && event.totalLength > event.toRow && source[currLen - 1] !== INFINITE_SCROLL_DEFFERED_ROW) {
    const len = Math.min(currLen + blockSize - 1, event.totalLength);
    for (let i = currLen; i < len; i++) {
      source[i] = INFINITE_SCROLL_DEFFERED_ROW;
    }
    return true;
  }
  return false;
}

export function upgradeChangeEventToInfinite<T, TData = any>(totalLength: number, event: PblDataSourceTriggerChangedEvent<TData>, blockMatch: CacheBlock) {
  const [ direction, start, end ] = blockMatch;

  if (!event.isInitial) {
    if (direction === 1 && end === totalLength - 1) {
      (event as PblInfiniteScrollTriggerChangedEvent).isLastBlock = true;
    }
  }

  (event as PblInfiniteScrollTriggerChangedEvent).direction = direction;
  (event as PblInfiniteScrollTriggerChangedEvent).fromRow = start;
  (event as PblInfiniteScrollTriggerChangedEvent).offset = (end - start) + 1;
  (event as PblInfiniteScrollTriggerChangedEvent).toRow = end;

  return event as PblInfiniteScrollTriggerChangedEvent<TData> | undefined;
}

/**
 * Update the cache with new block information to reflect the last triggered event and
 * also update the datasource with the new values, removing values that are purged due to cache logic.
 * Returns the new datasource, or the original datasource editing in-place.
 *
 * For example, if the cache was empty the values provided are returned
 * Otherwise, the original datasource is edited and returned.
 */
export function updateCacheAndDataSource<T, TData = any>(context: PblInfiniteScrollDSContext<T, TData>,
                                                         event: PblInfiniteScrollTriggerChangedEvent<TData>,
                                                         values: T[]) {

  if (context.cache.empty) {
    return values;
  }

  const source = context.getDataSource().source;
  const toRemove = context.cache.update(event.fromRow, event.toRow, event.direction);
  for(const [start, end] of toRemove) {
    for (let i = start; i <= end; i++) {
      source[i] = INFINITE_SCROLL_DEFFERED_ROW;
    }
  }

  const { fromRow } = event;
  for (let i = 0, len = values.length; i < len; i++) {
    source[i + fromRow] = values[i];
  }

  return source;
}
