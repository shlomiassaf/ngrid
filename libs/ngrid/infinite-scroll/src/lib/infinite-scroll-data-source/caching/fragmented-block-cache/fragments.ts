import { RowSequence, StartOrEnd } from '../cache-adapter';
import { Fragment } from './fragment';

export class Fragments extends Array<Fragment> {

  private dirty = false;
  private _size: number = 0;

  get size(): number {
    if (this.dirty) {
      this.onDirty();
    }
    return this._size;
  }

  remove(startRow: number, count: number, startFrom = 0): RowSequence[] {
    const result: RowSequence[] = [];
    const endRow = Fragment.calcEnd(startRow, count);
    const index = this.searchByRow(startRow, startFrom);

    if (index !== -1) {
      const item = this[index];
      const originalEnd = item.end;

      const gap = originalEnd - endRow;

      item.end = startRow - 1;

      if (gap === 0) {
        result.push([startRow, endRow]);
      } else if (gap < 0) {
        result.push([startRow, originalEnd], ...this.remove(originalEnd + 1, gap, index + 1));
      } else {
        const f = new Fragment(endRow + 1, originalEnd);
        this.splice(index, 0, f);
        result.push([startRow, endRow]);
      }

      if (result.length > 0) {
        this.markDirty();
      }
    }

    return result;
  }

  removeItems(count: number, location: StartOrEnd): RowSequence[] {
    const result: RowSequence[] = [];
    let f: Fragment;
    while (count > 0) {
      f = location === -1 ? this.shift() : this.pop();
      if (!f) {
        break;
      }

      if (f.size > count) {
        if (location === -1) {
          f.start += count;
          result.push([f.start - count, f.start - 1]);
        } else {
          f.end -= count;
          result.push([f.end + 1, f.end + count]);
        }
        count = 0;
      } else {
        count = count - f.size;
        result.push([f.start, f.end]);
        f = undefined;
      }
    }
    if (f) {
      if (location === -1) {
        this.unshift(f);
      } else {
        this.push(f);
      }
    }
    if (result.length > 0) {
      this.markDirty();
    }
    return result;
  }

  clear(): RowSequence[] {
    const result: RowSequence[] = [];
    while (this.length > 0) {
      const f = this.shift();
      result.push([f.start, f.end]);
    }
    if (result.length > 0) {
      this.markDirty();
    }
    return result;
  }

  /**
   * Returns the first row index of a missing row that is the most close (based on the direction) to the provided rowIndex.
   * If the provided rowIndex is missing, returns the provided rowIndex.
   * Note that when the direction is -1 the closest missing row might be -1, i.e. all rows are in-place and nothing is missing
   */
  findClosestMissing(rowIndex: number, direction: StartOrEnd) {
    const fragment = this[this.searchByRow(rowIndex)];
    if (fragment) { // we assume fragments must have gaps or else they are merged
      return direction === 1 ? fragment.end + 1 : fragment.start - 1;
    }
    return rowIndex;
  }

  containsRange(startRow: number, endRow: number) {
    const first = this[this.searchByRow(startRow)];
    return first && endRow <= first.end; // we assume fragments must have gaps or else they are merged
  }

  /**
   * Search all fragments and find the index of the fragments that contains a specific row index
   */
  searchByRow(rowIndex: number, startFrom = 0) {
    let end = this.length - 1;

    while (startFrom <= end){
      let mid = Math.floor((startFrom + end) / 2);
      const item = this[mid];
      if (item.containsRow(rowIndex)) {
        return mid;
      }
      else if (item.end < rowIndex) {
        startFrom = mid + 1;
      } else {
        end = mid - 1;
      }
    }

    return -1;
  }

  /**
   * Search for the row that either contain the rowIndex or is the closest to it (from the start)
   * I.e, if no fragment contains the rowIndex, the closest fragment to it will return it's index
   * If The row index is greater then the end of the hightest fragment -1 is returned
   * */
  searchRowProximity(rowIndex: number, startFrom = 0) {
    let end = this.length - 1;

    let mostProximate = -1;
    while (startFrom <= end){
      let mid = Math.floor((startFrom + end) / 2);
      const item = this[mid];
      if (item.containsRow(rowIndex)) {
        return mid;
      } else if (item.end < rowIndex) {
        startFrom = mid + 1;
      } else {
        mostProximate = mid;
        end = mid - 1;
      }
    }
    return mostProximate;
  }

  markDirty() {
    this.dirty = true;
  }

  /**
   * Check and verify that there are no sequential blocks (e.g. block 1 [0, 99], block 2 [100, 199])
   * If there are, merge them into a single block
   */
  checkAndMerge() {
    for (let i = 1; i < this.length; i++) {
      if (this[i - 1].end + 1 === this[i].start) {
        this[i - 1].end = this[i].end;
        this.splice(i, 1);
        i -= 1;
      }
    }
  }

  private onDirty() {
    this.dirty = false;
    this._size = this.reduce( (s, f) => s + f.size, 0);
  }
}
