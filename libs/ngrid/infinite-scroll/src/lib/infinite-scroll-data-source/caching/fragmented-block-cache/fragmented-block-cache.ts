import { PblInfiniteScrollDSContext } from '../../infinite-scroll-datasource.context';
import { CacheAdapterOptions, CacheBlock, PblNgridCacheAdapter, RowSequence, StartOrEnd } from '../cache-adapter';
import { Fragment } from './fragment';
import { Fragments } from './fragments';
import { findIntersectionType, IntersectionType } from './utils';

const LOG = msg => { console.log(msg); }

export interface FragmentedBlockCacheOptions extends CacheAdapterOptions {
  /**
   * When set to true the cache will force the blocks to align perfectly, where no event can be fired with rows
   * that overlap any other pervious or future event unless they overlap fully.
   * For example, if the block size is 50 and "strictPaging" is true the events will include fromRow, toRows: [0, 49] [50, 99] .... [300, 349]
   * If 'strictPaging is false you might get the above but might also get [73, 122] etc...
   * @default false
   */
  strictPaging?: boolean
}

/**
 * A Caching strategy that enforces storing cache rows in blocks where
 *
 *  - All blocks have the same predefined size (configurable)
 *  - A block contains items in a sequence (I.E A block is a page)
 *
 * In Addition, the cache is limited by size (configurable).
 * When items are added or when maximum size is updated the cache will auto-purge items
 * that cause overflow.
 *
 * Beside overflow, not other logic can perform automatic purging.
 *
 * This is best for grid's that use a datasource with an index based pagination (skip/limit) and
 */
export class FragmentedBlockCache implements PblNgridCacheAdapter<FragmentedBlockCacheOptions> {

  get maxSize(): number { return this._maxSize; }
  get size(): number { return this.fragments.size; }
  get empty() { return this.size === 0; }

  readonly options: FragmentedBlockCacheOptions;

  private _maxSize = 0;
  private coldLocation: StartOrEnd | undefined;
  // DO NOT MODIFY FRAGMENT ITEMS IN THE COLLECTION WITHOUT CALLING "markDirty()" afterwards
  private fragments = new Fragments();
  private lastStartRow = 0;
  private lastDir: StartOrEnd = 1;

  constructor(private readonly context: PblInfiniteScrollDSContext<any>, options?: FragmentedBlockCacheOptions) {
    this.options = { ...(options || {}) };
  }

  remove(startRow: number, count: number): RowSequence[] {
    return this.fragments.remove(startRow, count);
  }

  /**
   * Set the new max size for this cache.
   * @returns When new max size is bigger the old & current size violates the new max size, return the number of items trimmed from the cache
   * with positive value if trimmed from end, negative value if trimmed from start. Otherwise returns 0.
   */
  setCacheSize(maxSize: number): RowSequence[] {
    this._maxSize = Math.max(0, maxSize);
    return this.alignBoundary();
  }

  update(startRow: number, endRow: number, direction: StartOrEnd): RowSequence[] {
    this.coldLocation = direction === 1 ? -1 : 1;
    return this.add(startRow, endRow);
  }

  clear(): RowSequence[] {
    this.coldLocation = undefined;
    if (this.empty) {
      return [ [0, 0] ];
    }
    return this.fragments.clear();
  }

  createBlock(startIndex: number, endIndex: number, totalLength = 0): CacheBlock | undefined {
    const [ direction, start, end ] = this.matchBlock(startIndex, endIndex) || [];

    LOG(`CREATE BLOCK: [${startIndex}, ${endIndex}] => [${direction}, ${start}, ${end}]`)
    if (!direction) {
      return undefined;
    }

    const { blockSize } = this.context.options;
    const { strictPaging } = this.options;

    let fromRow: number;
    let toRow: number;
    switch (direction) {
      case -1:
        fromRow = Math.max(0, end - (blockSize - 1));
        toRow = end;
        if (!strictPaging && fromRow < start) {
          fromRow = Math.min(this.fragments.findClosestMissing(fromRow, 1), start);
        }
        break;
      case 1:
        fromRow = start;
        toRow = start + blockSize - 1;
        if (!strictPaging && toRow > end) {
          toRow = Math.max(this.fragments.findClosestMissing(toRow, -1), end);
        }
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
    if (strictPaging) {
      const main = direction === 1 ? fromRow : toRow;
      let rem = main % blockSize;
      if (rem !== 0) {
        fromRow = main - rem;
        toRow = fromRow + blockSize - 1;
      }
    }

    if (totalLength && toRow >= totalLength) {
      toRow = totalLength - 1;
      if (strictPaging) {
        fromRow = toRow - (toRow % blockSize)
      }
    }

    return [direction, fromRow, toRow];
  }

  private matchBlock(start: number, end: number): CacheBlock | undefined {
    if (this.empty) {
      return [1, start, end];
    }

    const iFirst = this.fragments.searchRowProximity(start);
    const iLast = this.fragments.searchRowProximity(end);
    if (iFirst === -1) {
      return [1, start, end];
    }

    const first = this.fragments[iFirst];
    if (iLast === -1) {
      return [1, first.containsRow(start) ? first.end + 1 : start, end];
    }

    const intersectionType = findIntersectionType(first, new Fragment(start,end));
    const dir = this.lastStartRow > start ? -1 : this.lastStartRow === start ? this.lastDir : 1;
    this.lastStartRow = start;
    this.lastDir = dir;

    // The logic here assumes that there are not sequential blocks, (e.g. block 1 [0, 99], block 2 [100, 199])
    // All sequential blocks are to be merged via checkAndMerge on the fragments collection
    switch (intersectionType) {
      case IntersectionType.none:
        return [dir, start, end];
      case IntersectionType.partial:
        if (iFirst === iLast) {
          if (start < first.start) {
            return [dir, start, first.start - 1];
          } else {
            return [dir, first.end + 1, end];
          }
        } else {
          const last = this.fragments[iLast];
          return [dir, start < first.start ? start : first.end + 1, end >= last.start ? last.start - 1 : end];
        }
      case IntersectionType.contained:
        const last = this.fragments[iLast];
        return [dir, start, end >= last.start ? last.start - 1 : end];
      case IntersectionType.contains:
      case IntersectionType.full:
        return undefined;
    }
  }

  private add(startRow: number, endRow: number): RowSequence[] {
    if (startRow < 0 || endRow <= 0) {
      return [];
    }

    const newFragment = new Fragment(startRow, endRow);
    const iFirst = this.fragments.searchRowProximity(startRow);
    const first = this.fragments[iFirst];
    const intersectionType = !first ? null : findIntersectionType(first, newFragment);

    switch (intersectionType) {
      case null:
        // EDGE CASE: when  "first" is undefined, i.e. "iFirst" is -1
        // This edge case means no proximity, i,e. the new fragment is AFTER the last fragment we currently have (or we have no fragments)
        this.fragments.push(newFragment);
        break;
      case IntersectionType.none: // it means first === last
        this.fragments.splice(iFirst, 0, newFragment);
        break;
      case IntersectionType.partial:
      case IntersectionType.contained:
        let iLast = this.fragments.searchRowProximity(endRow);
        if (iLast === -1) {
          iLast = this.fragments.length - 1;
        }
        const last = this.fragments[iLast];
        first.start = Math.min(newFragment.start, first.start);
        if (newFragment.end >= last.start) {
          first.end = newFragment.end;
          this.fragments.splice(iFirst + 1, iLast - iFirst);
        } else {
          first.end = Math.max(newFragment.end, first.end);
          this.fragments.splice(iFirst + 1, (iLast - 1) - iFirst);
        }
        break;
      case IntersectionType.contains:
      case IntersectionType.full:
        return [];
    }

    this.fragments.markDirty();
    this.fragments.checkAndMerge();
    return this.alignBoundary();
  }

  private oversize() {
    return this._maxSize ? Math.max(this.size - this._maxSize, 0) : 0;
  }

  private alignBoundary(): RowSequence[] {
    const oversize = this.oversize();
    return oversize > 0 ? this.fragments.removeItems(oversize, this.coldLocation || 1) : [];
  }
}
