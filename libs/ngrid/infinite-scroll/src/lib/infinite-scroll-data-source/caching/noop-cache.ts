import { PblInfiniteScrollDataSource } from '../infinite-scroll-datasource';
import { PblInfiniteScrollDSContext } from '../infinite-scroll-datasource.context';
import { CacheAdapterOptions, CacheBlock, PblNgridCacheAdapter, RowSequence, StartOrEnd } from './cache-adapter';

/**
 * A Caching strategy that enforces storing cache rows in blocks where
 *
 *  - All blocks have the same predefined size (configurable)
 *  - A block contains items in a sequence (I.E A block is a page)
 *  - Each block must continue a sequence from the last block.
 *
 * In Addition, the cache is limited by size (configurable).
 * When items are added or when maximum size is updated the cache will auto-purge items
 * that cause overflow.
 *
 * If items are added which breaks the current sequence the entire cache is purged automatically.
 *
 * This is best for grid's that use a datasource with page based pagination.
 * While the user scrolls, each next item is most often the next block in sequence.
 *
 * Note that when pre-defining the virtual size to the total amount of rows will allow the user
 * to fast scroll which might break the sequence, skipping a block or more, thus purging the entire cache.
 */
export class NoOpBlockCache implements PblNgridCacheAdapter<CacheAdapterOptions> {
  get maxSize(): number { return this.ds.length; }
  get size(): number { return this.ds.length; }
  get empty() { return this.size === 0; }

  readonly options: CacheAdapterOptions;

  private readonly ds: PblInfiniteScrollDataSource<any>;

  constructor(private readonly context: PblInfiniteScrollDSContext<any>, private readonly virtualRow: any) {
    this.ds = context.getDataSource();
  }

  remove(startRow: number, count: number): RowSequence[] {
    const start = 0;
    const end = Math.min(startRow + count - 1, this.ds.length);
    return [ [start, end ] ];
  }

  /**
   * Set the new max size for this cache.
   * @returns When new max size is bigger the old & current size violates the new max size, return the number of items trimmed from the cache
   * with positive value if trimmed from end, negative value if trimmed from start. Otherwise returns 0.
   */
  setCacheSize(maxSize: number): RowSequence[] {
    return [];
  }

  update(startRow: number, endRow: number, direction: StartOrEnd): RowSequence[] {
    return [];
  }

  clear(): RowSequence[] {
    return [ [0, this.ds.length - 1] ];
  }

  createBlock(startIndex: number, endIndex: number, totalLength = 0): CacheBlock | undefined {
    const [ direction, start, end ] = this.matchBlock(startIndex, endIndex) || [];

    if (!direction) {
      return undefined;
    }

    const { blockSize } = this.context.options;

    let fromRow: number;
    let toRow: number;
    switch (direction) {
      case -1:
        fromRow = Math.max(0, end - (blockSize - 1));
        toRow = end;
        break;
      case 1:
        fromRow = start;
        toRow = start + blockSize - 1;
        break;
    }

    if (totalLength && fromRow >= totalLength) {
      return undefined;
    }

    if (totalLength) {
      if (toRow >= totalLength) {
        toRow = totalLength - 1;
      }
    }

    return [direction, fromRow, toRow];
  }

  private matchBlock(start: number, end: number): CacheBlock | undefined { // TODO: refactor to labeled tuple types in TS 4.0
    if (start === end) {
      return [1, start, end];
    }

    const source = this.ds.source;

    for (let i = start; i <= end; i++) {
      if (source[i] !== this.virtualRow) {
        start = i;
      } else {
        break;
      }
    }

    if (start === end) {
      return undefined;
    } else {
      return [1, start, end];
    }
  }
}
