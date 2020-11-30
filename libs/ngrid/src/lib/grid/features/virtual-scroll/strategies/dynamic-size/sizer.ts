import { SizeGroup } from './size-group';
import { SizeGroupCollection } from './size-group-collection';

export class Sizer {

  itemSize: number;
  itemsLength: number;
  protected groupSize = 50;
  private groups = new SizeGroupCollection();

  constructor(groupSize?: number) {
    if (groupSize > 0) {
      this.groupSize = groupSize;
    }
  }

  clear() {
    this.groups.clear();
  }

  setSize(dsIndex: number, height: number) {
    const groupIndex = this.getGroupIndex(dsIndex);

    if (height === this.itemSize) {
      const group = this.groups.get(groupIndex);
      if (group) {
        group.remove(dsIndex);
        if (group.length === 0) {
          this.groups.remove(groupIndex);
        }
      }
    } else {
      let group = this.groups.get(groupIndex);
      if (!group) {
        group = new SizeGroup(groupIndex, this.groupSize);
        this.groups.set(group);
      }
      group.set(dsIndex, height);
    }
  }

  getTotalContentSize() {
    const itemSize = this.itemSize;

    let total = this.itemsLength * itemSize;
    for (const g of this.groups.collection) {
      total += g.getRawDiffSize(itemSize);
    }

    return total;
  }

  getSizeForItem(dsIndex: number) {
    const groupIndex = this.getGroupIndex(dsIndex);
    return this.groups.get(groupIndex)?.getItemSize(dsIndex) || this.itemSize;
  }

  getSizeBefore(dsIndex: number) {
    const itemSize = this.itemSize;

    // We want all items before `dsIndex`
    // If dsIndex is 0 we want nothing
    // If dsIndex is 1 we want only 0 so `dsIndex` is also the "count" here.
    let total = dsIndex * itemSize;
    for (const g of this.groups.collection) {
      if (g.dsStart < dsIndex) {
        if (g.dsEnd > dsIndex) {
          total += g.getSizeBefore(dsIndex, itemSize) - itemSize * (dsIndex - g.dsStart);
        } else {
          total += g.getRawDiffSize(itemSize);
        }
      } else {
        break;
      }
    }

    return total;
  }

  getSizeForRange(dsIndexStart: number, dsIndexEnd: number) {
    const groupSize = this.groupSize;
    const itemSize = this.itemSize;
    let total = 0;

    const startGroupIndex = this.getGroupIndex(dsIndexStart);
    const endGroupIndex = this.getGroupIndex(dsIndexEnd);
    const startGroup = this.groups.get(startGroupIndex);

    if (startGroupIndex === endGroupIndex) {
      if (startGroup) {
        total += startGroup.getSubSize(dsIndexStart, dsIndexEnd, itemSize);
      } else {
        total += (dsIndexEnd - dsIndexStart + 1) * itemSize;
      }
    } else {
      for (let i = startGroupIndex + 1; i < endGroupIndex; i++) {
        const g = this.groups.get(i);
        total += g ? g.getSize(itemSize) : itemSize * groupSize;
      }

      if (startGroup) {
        total += startGroup.getSizeAfter(dsIndexStart - 1, itemSize);
      } else {
        total += ((startGroupIndex + 1) * groupSize - dsIndexStart + 1) * itemSize;
      }

      const endGroup = this.groups.get(endGroupIndex);
      if (endGroup) {
        total += endGroup.getSizeBefore(dsIndexEnd + 1, itemSize);
      } else {
        total += (dsIndexEnd - (endGroupIndex * groupSize) + 1) * itemSize;
      }
    }

    return total;
  }

  getSizeAfter(dsIndex: number) {
    const itemSize = this.itemSize;
    const groups = this.groups.collection;

    let total = (this.itemsLength - dsIndex - 1) * itemSize;
    for (let i = groups.length - 1; i > -1; i--) {
      const g = groups[i];
      if (g.dsEnd > dsIndex) {
        if (g.dsStart > dsIndex) {
          total += g.getRawDiffSize(itemSize);
        } else {
          total += g.getSizeAfter(dsIndex, itemSize) - itemSize * (g.dsEnd - dsIndex);
        }
      } else {
        break;
      }
    }
    return total;
  }

  findRenderItemAtOffset(offset: number) {
    const { itemSize, groupSize } = this;
    const maxGroupIndex = this.getGroupIndex(this.itemsLength);
    const firstVisibleIndex = Math.floor(offset / itemSize);
    let groupIndex = this.getGroupIndex(firstVisibleIndex);
    let groupStartPos = this.getSizeBefore(groupSize * groupIndex);

    while (true) {
      if (groupStartPos < offset) {
        if (groupIndex >= maxGroupIndex) {
          groupIndex = maxGroupIndex;
          break;
        }
        groupIndex += 1;
        groupStartPos += this.getSizeForRange(groupSize * groupIndex, groupSize * (groupIndex + 1) - 1);
        if (groupStartPos >= offset) {
          groupStartPos -= this.getSizeForRange(groupSize * groupIndex, groupSize * (groupIndex + 1) - 1);
          groupIndex -=1;
          break;
        }
      } else if (groupStartPos > offset) {
        if (groupIndex <= 0) {
          groupIndex = 0;
          break;
        }
        groupIndex -= 1;
        groupStartPos -= this.getSizeForRange(groupSize * groupIndex, groupSize * (groupIndex + 1) - 1);
        if (groupStartPos <= offset) {
          break;
        }
      } else {
        break;
      }
    }

    let index = groupSize * groupIndex;
    const group = this.groups.get(groupIndex);
    if (!group) {
      while (groupStartPos < offset) {
        groupStartPos += itemSize;
        index += 1;
      }
    } else {
      while (groupStartPos < offset) {
        groupStartPos += group.getItemSize(index) || itemSize;
        index += 1;
      }
    }
    return index;
  }

  protected getGroupIndex(dsIndex: number) {
    return Math.floor(dsIndex / this.groupSize);
  }
}
