

export type StartOrEnd = -1 | 1;
export type RowSequence = [number, number];
export type CacheBlock = [StartOrEnd, number, number];

export interface CacheAdapterOptions {
}

export interface PblNgridCacheAdapter<TOptions extends CacheAdapterOptions> {
  readonly maxSize: number;
  readonly size: number;
  readonly empty: boolean;

  readonly options: TOptions;

  setCacheSize(maxSize: number): RowSequence[];
  update(startRow: number, endRow: number, direction: StartOrEnd): RowSequence[];
  remove(startRow: number, count: number): RowSequence[];
  clear(): RowSequence[];
  createBlock(start: number, end: number, totalLength?: number): CacheBlock | undefined;
}
