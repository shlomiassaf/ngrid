export interface NegTableAggregators {
  sum: SumAggregator;
  min: MinAggregator;
  max: MaxAggregator;
  count: CountAggregator;
  avg: AverageAggregator;
  median: MedianAggregator;
}

export interface Aggregator<T = any, TAgg = any> {
  id: keyof NegTableAggregators;
  label?: string;
  add(value: T): boolean;
  set(value: T[]): void;
  remove(value: T): boolean;
  reset(): void;
  result(): TAgg;
}

export class SumAggregator implements Aggregator<number, number> {
  id: 'sum';

  private _sum = 0;

  add(value: number): boolean {
    this._sum += value;
    return !!value;
  }

  set(value: number[]): void {
    this.reset();
    for (const v of value) { this.add(v); }
  }

  remove(value: number): boolean {
    this._sum -= value;
    return !!value;
  }

  reset(): void {
    this._sum = 0;
  }

  result(): number {
    return this._sum;
  }
}

export class MinAggregator implements Aggregator<number, number> {
  id: 'min';

  private _min = Number.MAX_VALUE;
  private _cache = new Set<number>();

  add(value: number): boolean {
    this._cache.add(value);
    if (value < this._min) {
      this._min = value;
      return true;
    }
    return false;
  }

  set(value: number[]): void {
    this.reset();
    for (const v of value) { this.add(v); }
  }

  remove(value: number): boolean {
    if (this._cache.delete(value)) {
      if (value === this._min) {
        const cache = Array.from(this._cache.values());
        this.reset();
        for (const v of cache) {
          this.add(v);
        }
        return true;
      }
      return false;
    }
  }

  reset(): void {
    this._min = Number.MAX_VALUE;
    this._cache = new Set<number>();
  }

  result(): number {
    return this._min;
  }
}

export class MaxAggregator implements Aggregator<number, number> {
  id: 'max';

  private _max = Number.MIN_VALUE;
  private _cache = new Set<number>();

  add(value: number): boolean {
    this._cache.add(value);
    if (value > this._max) {
      this._max = value;
      return true;
    }
    return false;
  }

  set(value: number[]): void {
    this.reset();
    for (const v of value) { this.add(v); }
  }

  remove(value: number): boolean {
    if (this._cache.delete(value)) {
      if (value === this._max) {
        const cache = Array.from(this._cache.values());
        this.reset();
        for (const v of cache) {
          this.add(v);
        }
        return true;
      }
      return false;
    }
  }

  reset(): void {
    this._max = Number.MIN_VALUE;
    this._cache = new Set<number>();
  }

  result(): number {
    return this._max;
  }
}

export class CountAggregator implements Aggregator<any, any> {
  id: 'count';

  private _count = 0;

  add(value: any): boolean {
    this._count++;
    return true;
  }

  set(value: number[]): void {
    this.reset();
    this._count = value.length;
  }

  remove(value: any): boolean {
    this._count--;
    if (this._count < 0) {
      this._count = 0;
    }
    return true;
  }

  reset(): void {
    this._count = 0;
  }

  result(): number {
    return this._count;
  }
}

export class AverageAggregator implements Aggregator<number, number> {
  id: 'avg';

  private _sum = new SumAggregator();
  private _count = 0;
  private _avg = 0;
  private _dirty = false;

  add(value: number): boolean {
    this._count++;
    this._sum.add(value);
    return this._dirty = true;
  }

  set(value: number[]): void {
    this.reset();
    for (const v of value) { this.add(v); }
  }

  remove(value: number): boolean {
    this._count--;
    this._sum.remove(value);
    return this._dirty = true;
  }

  reset(): void {
    this._count = 0;
    this._sum.reset();
    this._avg = 0;
    this._dirty = false;
  }

  result(): number {
    if (this._dirty) {
      this._dirty = false;
      this._avg = this._count > 0
        ? this._sum.result() / this._count
        : 0
      ;
    }
    return this._avg;
  }
}

export class MedianAggregator implements Aggregator<number, number> {
  id: 'median';

  private _cache: number[] = []
  private _median = 0;
  private _dirty = false;

  add(value: number): boolean {
    this._cache.push(value);
    this._cache.sort();
    return this._dirty = true;
  }

  set(value: number[]): void {
    this.reset();
    for (const v of value) { this.add(v); }
  }

  remove(value: number): boolean {
    const idx = this._cache.indexOf(value);
    if (idx > -1) {
      this._cache.splice(idx, 1);
      this._cache.sort();
      return this._dirty = true;
    }
    return false;
  }

  reset(): void {
    this._cache = [];
    this._median = 0;
    this._dirty = false;
  }

  result(): number {
    if (this._dirty) {
      this._dirty = false;
      const len = this._cache.length;
      if (len === 0) {
        this._median = 0;
      } else if (len % 2 === 0) {
        this._median = (this._cache[len / 2 - 1] + this._cache[len / 2]) / 2;
      } else {
        this._median = this._cache[(len - 1) / 2];
      }
    }
    return this._median;
  }
}

