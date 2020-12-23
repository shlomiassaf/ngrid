import { PblInfiniteScrollDSContext } from '../infinite-scroll-datasource.context';
import { CacheAdapterOptions, CacheBlock, PblNgridCacheAdapter, RowSequence, StartOrEnd } from './cache-adapter';

/*
This cache will force the blocks to align perfectly, where no event can be fired with rows
that overlap any other pervious or future event unless they overlap fully.
For example, if the block size is 50 and strictBlocks is true the events will include fromRow, toRows: [0, 49] [50, 99] .... [300, 349]
If strictBlocks is false you might get the above but might also get [73, 122] etc...

While the user scrolls slowly the datasource will output strict blocks natively, the anomalies happen when
the user scrolls fast, into a scroll area with no rows.

Using strictBlocks fits to scenarios where the server returns page based pagination with no option to get items between pages. (i.e. fixed page size)
If your server returns pagination based on "skip" and "limit" then using strictBlocks does not add any value.

When using strictBlocks cache performance might improve but the tradeoff is a little bit more API calls.
*/

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
export class SequencedBlockCache implements PblNgridCacheAdapter<CacheAdapterOptions> {

  public end: number = -1;
  public start: number = 0;

  get maxSize(): number { return this._maxSize; }
  get size(): number { return this.end - this.start + 1; }
  get empty() { return this.size === 0; }

  readonly options: CacheAdapterOptions;

  private _maxSize = 0;
  private lastAdd: StartOrEnd | undefined;

  constructor(private readonly context: PblInfiniteScrollDSContext<any>, options?: CacheAdapterOptions) {
    this.options = { ...(options || {}) };
  }

  remove(startRow: number, count: number): RowSequence[] {
    const start = Math.max(startRow, this.start);
    const end = Math.min(startRow + count - 1, this.end);
    return [ [start, end] ];
  }

  /**
   * Set the new max size for this cache.
   * @returns When new max size is bigger the old & current size violates the new max size, return the number of items trimmed from the cache
   * with positive value if trimmed from end, negative value if trimmed from start. Otherwise returns 0.
   */
  setCacheSize(maxSize: number): RowSequence[] {
    this._maxSize = Math.max(0, maxSize);
    const oversize = this.alignBoundary(this.lastAdd || 1);
    if (oversize < 0) {
      return [
        [this.start + oversize, this.start - 1],
      ];
    } else if (oversize > 0) {
      return [
        [this.end + 1, this.end + oversize],
      ];
    } else {
      return [];
    }
  }

  update(startRow: number, endRow: number, direction: StartOrEnd): RowSequence[] {
    if (this.empty) {
      return this.add(startRow, endRow - startRow + 1);
    } else if (this.isSibling(startRow, endRow, direction)) {
      if (direction === -1) {
        const offset = this.start - startRow;
        return this.add(startRow, offset);
      } else if (direction === 1) {
        const offset = endRow - this.end;
        return this.add(this.end + 1, offset);
      } else {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
          throw new Error('Infinite scroll - Sequenced block cache Error');
        }
        return;
      }
    } else {
      const result = this.clear();
      this.add(startRow, endRow - startRow + 1);
      return result;
    }
  }

  clear(): RowSequence[] {
    this.lastAdd = undefined;
    if (this.empty) {
      return [ [0, 0] ];
    }

    const { start, end } = this;
    this.start = 0;
    this.end = -1;
    return [ [start, end] ];
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

    // Strict Block logic:
    // Now, we align the block to match a sequential world of blocks based on the block size.
    // If we have a gap we want to divert to the nearest block start/end, based on the direction.
    // If we go down (direction is 1) we want the nearest block start BELOW us, getting duplicates in the call but ensuring no gaps ahead
    // If we go up (direction is -1) we want to nearest block start ABOVE us, getting duplicates in the call but ensuring no gaps ahead.
    const main = direction === 1 ? fromRow : toRow;
    let rem = main % blockSize;
    if (rem !== 0) {
      fromRow = main - rem;
      toRow = fromRow + blockSize - 1;
    }

    if (totalLength) {
      if (toRow >= totalLength) {
        toRow = totalLength - 1;
        fromRow = toRow - (toRow % blockSize)
      }
    }

    return [direction, fromRow, toRow];
  }

  private matchBlock(start: number, end: number): [-1 | 1, number, number] | undefined {
    if (this.empty) {
      return [1, start, end];
    }

    if (start >= this.start && end <= this.end) {
      return undefined;
    }

    if (start < this.start && end >= this.start - 1) {
      return [-1, start, this.start -1];
    }
    if (end > this.end && start <= this.end + 1) {
      return [1, this.end + 1, end];
    }

    return [end > this.end ? 1 : -1, start, end];
  }

  private oversize() {
    return this._maxSize ? Math.max(this.size - this._maxSize, 0) : 0;
  }

  private isSibling(startRow: number, endRow: number, direction: StartOrEnd) {
    if (direction === 1) {
      return this.end + 1 === startRow;
    }
    if (direction === -1) {
      return this.start - 1 === endRow;
    }
    return false;
  }

  private add(startRow: number, count: number): RowSequence[] {
    if (startRow < 0 || count <= 0) {
      return [];
    }

    let oversize: number;
    let end = startRow + count - 1;
    if (this.empty) {
      this.start = startRow;
      this.end = end;
      oversize = this.alignBoundary(1);
    } else if (startRow < this.start) {
      this.start = startRow;
      oversize = this.alignBoundary(-(this.lastAdd = -1) as any);
    } else if (end > this.end) {
      this.end = end;
      oversize = this.alignBoundary(-(this.lastAdd = 1) as any);
    }
    if (oversize < 0) {
      return [
        [this.start + oversize, this.start - 1],
      ];
    } else if (oversize > 0) {
      return [
        [this.end + 1, this.end + oversize],
      ];
    } else {
      return [];
    }
  }

  /**
   * Align the cache to fix max size.
   * @returns the number of items trimmed from the cache with positive value if trimmed from end, negative value if trimmed from start.
  */
  private alignBoundary(trimFrom: StartOrEnd): number {
    const oversize = this.oversize();
    if (oversize) {
      if (trimFrom === 1) {
        this.end -= oversize;
      } else {
        this.start += oversize;
        return -oversize;
      }
    }
    return oversize;
  }
}
