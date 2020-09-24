import { PblInfiniteScrollDSContext } from '../infinite-scroll-datasource.context';
import { INFINITE_SCROLL_DEFFERED_ROW } from '../infinite-scroll-deffered-row';
import { SequencedBlockCache } from './sequenced-block-cache';
import { FragmentedBlockCache } from './fragmented-block-cache';
import { PblInfiniteScrollCacheOptions } from '../infinite-scroll-datasource.types';
import { NoOpBlockCache } from './noop-cache';

export interface PblNgridCacheAdaptersMap {
  noOpCache: NoOpBlockCache ;
  sequenceBlocks: SequencedBlockCache ;
  fragmentedBlocks: FragmentedBlockCache;
}

export function createCacheAdapter(context: PblInfiniteScrollDSContext<any>, options: PblInfiniteScrollCacheOptions) {
  switch (options.type) {
    case 'noOpCache':
      return new NoOpBlockCache(context, INFINITE_SCROLL_DEFFERED_ROW);
    case 'sequenceBlocks':
      return new SequencedBlockCache(context, options.options);
    case 'fragmentedBlocks':
      return new FragmentedBlockCache(context, options.options);
  }
}
