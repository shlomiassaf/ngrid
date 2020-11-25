export class SizeGroup {
  readonly dsStart: number;
  readonly dsEnd: number;
  rawTotal = 0;
  length = 0;
  items: number[] = [];

  constructor(public readonly groupIndex: number, private readonly maxItems: number) {
    this.dsStart = groupIndex * maxItems;
    this.dsEnd = this.dsStart + maxItems - 1;
  }

  set(dsIndex: number, height: number): void {
    const index = dsIndex - this.dsStart;
    const prev = this.items[index];
    this.items[index] = height;
    this.rawTotal += height - (prev || 0);
    if (!prev && height) {
      this.length += 1;
    }
  }

  remove(dsIndex: number): boolean {
    const index = dsIndex - this.dsStart;
    const prev = this.items[index];
    if (prev) {
      this.rawTotal -= prev;
      this.items[index] = undefined;
      this.length -= 1;
      return true;
    }
    return false;
  }

  has(dsIndex: number): boolean {
    const index = dsIndex - this.dsStart;
    return !!this.items[index];
  }

  clear() {
    this.rawTotal = this.length = 0;
    this.items = [];
  }

  getItemSize(dsIndex: number) {
    const index = dsIndex - this.dsStart;
    return this.items[index];
  }

  getSizeBefore(dsIndex: number, itemSize: number) {
    const index = dsIndex - this.dsStart;

    let total = index * itemSize;
    for (let i = 0; i < index; i++) {
      const size = this.items[i];
      if (size) {
        total += size - itemSize;
      }
    }

    return total;
  }

  getSize(itemSize: number) {
    return (itemSize * (this.maxItems - this.length)) + this.rawTotal;
  }

  getSubSize(dsIndexStart: number, dsIndexEnd: number, itemSize: number) {
    const indexStart = Math.max(dsIndexStart, this.dsStart) - this.dsStart;
    const indexEnd = this.maxItems - (this.dsEnd - Math.min(dsIndexEnd, this.dsEnd)) - 1;
    let total = 0;

    for (let i = indexStart; i <= indexEnd; i++) {
      total += this.items[i] || itemSize;
    }

    return total;
  }

  getSizeAfter(dsIndex: number, itemSize: number) {
    const index = this.dsEnd - dsIndex;

    let total = index * itemSize;
    for (let i = (this.maxItems - index); i < this.maxItems; i++) {
      const size = this.items[i];
      if (size) {
        total += size - itemSize;
      }
    }

    return total;
  }

  getRawDiffSize(itemSize: number) {
    return this.rawTotal - itemSize - this.length;
  }
}
