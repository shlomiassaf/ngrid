import { Observable, BehaviorSubject } from 'rxjs';

export type PblTablePaginatorKind = 'pageNumber' | 'token';

/**
 * An object with properties representing the change in the paginator.
 * Each property point to a tuple with 2 items.
 * The first item is the old value, the 2nd item is the new value.
 *
 * The properties that can change are page, perPage and total.
 */
export interface PblPaginatorChangeEvent<T = any> {
  page?: [T, T];
  perPage?: [number, number];
  total?: [number, number];
}

export interface PblPaginator<TPage> {
  kind: PblTablePaginatorKind;
  /**
   * When true will assume that the datasource represents a single page.
   * This is common in server side pagination where pervious data is not cached and each pages is fetched and set as is, i.e. the datasource
   * represents a single page at a time.
   *
   * For example, consider a paginator with 10 items per page, pointing to page 4.
   * When `noCacheMode` is set to `true` the range is [30, 39]
   * When `noCacheMode` is set to `false` the range is [0, 9]
   */
  noCacheMode: boolean;

  perPage: number;
  page: TPage;
  total: number;
  readonly totalPages: number;
  readonly range: [number, number];

  onChange: Observable<PblPaginatorChangeEvent<TPage>>;
  reset(): void;
  canMove(value: TPage): boolean;
  hasNext(): boolean;
  hasPrev(): boolean;
  move(value: TPage): void;
  nextPage(): void;
  prevPage(): void;

}

export class PblTokenPaginator implements PblPaginator<string> {
  readonly kind: 'token' = 'token';
  noCacheMode: boolean;

  get perPage(): number { return this._perPage; }
  set perPage(value: number) {
    if (value < 1) {
      throw new Error(`Invalid total size value ${value}`);
    }

    if (this._perPage !== value) {
      const changes: PblPaginatorChangeEvent<string> = { perPage: [this._perPage, this._perPage = value] };
      this.emit(changes);
    }
  }

  get page(): string { return this._page; }
  set page(value: string) {
    if (this._page !== value) {
      const idx = this._tokens.indexOf(value);
      if (idx === -1) {
        throw new Error(`Invalid page token ${value}`);
      }
      this._cursor = idx;
      const prev = this._page;
      this._page = value;
      this.emit({ page: [prev, value] });
    }
  }

  get total(): number { return this._total; }
  set total(value: number) {
    const changes: PblPaginatorChangeEvent<string> = { total: [this._total, this._total = value] };
    this.emit(changes);
  }

  get totalPages(): number {
    return this._tokens.length;
  }

  get range(): [number, number] {
    if (!this._range) {
      const start = (this._cursor) * this.perPage;
      const end = Math.min(this._total, start + this.perPage);
      this._range = this.noCacheMode
        ? [ 0, end - start ]
        : [ start, end ]
      ;
    }
    return this._range;
  }

  readonly onChange: Observable<PblPaginatorChangeEvent<string>>;
  protected onChange$: BehaviorSubject<PblPaginatorChangeEvent<string>>;
  protected queuedChanges: PblPaginatorChangeEvent<string> | undefined;
  protected _range: [number, number];
  protected _perPage: number = 10;
  protected _page: any;
  protected _total: number = 0;
  protected _tokens: any[];
  protected _cursor: number;

  constructor() {
    this.onChange$ = new BehaviorSubject<PblPaginatorChangeEvent<string>>({page: [null, null]});
    this.onChange = this.onChange$.asObservable();
    this.reset();
  }

  reset(): void {
    this._tokens = [null];
    this._cursor = 0;
    this._total = 0;
    this.page = null;
  }

  canMove(value: string): boolean {
    return this._tokens.indexOf(value) > -1;
  }

  hasNext(): boolean { return this._cursor < this._tokens.length - 1; }
  hasPrev(): boolean { return this._cursor > 0; }

  move(value: string): void { this.page = value; }
  nextPage(): void { this.page = this._tokens[++this._cursor]; }
  prevPage(): void { this.page = this._tokens[--this._cursor]; }

  addNext(value: any): void {
    const nextPointer = this._cursor + 1;
    // if next pointer is not like what we got, set it and delete all after (invalidate them)
    if (this._tokens[nextPointer] !== value) {
      this._tokens[nextPointer] = value;
      this._tokens.splice(nextPointer + 1);
    }
  }

  private emit(changes: PblPaginatorChangeEvent<string>): void {
    this._range = undefined;
    if (this.queuedChanges) {
      Object.assign(this.queuedChanges, changes);
    } else {
      this.queuedChanges = changes;
      setTimeout(() => {
        const c = this.queuedChanges;
        this.queuedChanges = undefined;
        this.onChange$.next(changes);
      });
    }
  }
}

export class PblPagingPaginator implements PblPaginator<number> {
  readonly kind: 'pageNumber' = 'pageNumber';
  noCacheMode: boolean;

  get perPage(): number { return this._perPage; }
  set perPage(value: number) {
    if (value < 1) {
      throw new Error(`Invalid total size value ${value}`);
    }

    if (this._perPage !== value) {
      const changes: PblPaginatorChangeEvent<number> = { perPage: [this._perPage, this._perPage = value] };

      const prev = this._page;
      this.calcPages();
      if (prev !== this._page) {
        changes.page = [prev, this._page];
      }
      this.emit(changes);
    }

  }

  /**
   * Get / Set the current page
   */
  get page(): number { return this._page; }
  set page(value: number) {
    if (value < 0 || value > this._totalPages) {
      throw new Error(`Invalid page index ${value}`);
    }

    if (this._page !== value) {
      const prev = this._page;
      this._page = value;
      this.emit({ page: [prev, value] });
    }
  }

  get total(): number { return this._total; }
  set total(value: number) {
    if (value < 0) {
      throw new Error(`Invalid total size value ${value}`);
    }

    if (this._total !== value) {
      const changes: PblPaginatorChangeEvent<number> = { total: [this._total, this._total = value] };

      const prev = this._page;
      this.calcPages();
      if (prev !== this._page) {
        changes.page = [prev, this._page];
      }

      this.emit(changes);
    }
  }

  /**
   * The amount of pages in this paginator
   */
  get totalPages(): number {
    return this._totalPages;
  }

  get range(): [number, number] {
    if (!this._range) {
      const start = (this.page - 1) * this.perPage;
      const end = Math.min(this._total, start + this.perPage);
      this._range = this.noCacheMode
        ? [ 0, end - start ]
        : [ start, end ]
      ;
    }
    return this._range;
  }

  readonly onChange: Observable<PblPaginatorChangeEvent<number>>;
  protected onChange$: BehaviorSubject<PblPaginatorChangeEvent<number>>;

  private _total = 0;
  private _perPage = 10;
  private _page = 1;
  private _totalPages = 0;
  private _range: [number, number];

  private queuedChanges: PblPaginatorChangeEvent<number> | undefined;

  constructor() {
    this.onChange$ = new BehaviorSubject<PblPaginatorChangeEvent<number>>({page: [null, 1]});
    this.onChange = this.onChange$.asObservable();
  }

  canMove(value: number): boolean {
    const p = this._page + value;
    return p >= 1 && p <= this.totalPages;
  }
  hasNext(): boolean { return this.canMove(1); }
  hasPrev(): boolean { return this.canMove(-1); }

  move(value: number): void { this.page = this._page + value; }
  nextPage(): void { this.move(1); }
  prevPage(): void { this.move(-1); }


  reset(): void {
    this.page = 1;
  }

  /**
   * Calculate the number of pages.
   * returns true if the current page has changed due to calculation. (current page \> new pages value)
   */
  protected calcPages(): void {
    this._totalPages = Math.ceil(this._total / this.perPage);
    if (this._totalPages > 0 && this._page > this._totalPages) {
      this.page = this._totalPages;
    }
  }

  private emit(changes: PblPaginatorChangeEvent<number>): void {
    this._range = undefined;
    if (this.queuedChanges) {
      Object.assign(this.queuedChanges, changes);
    } else {
      this.queuedChanges = changes;
      setTimeout(() => {
        const c = this.queuedChanges;
        this.queuedChanges = undefined;
        this.onChange$.next(changes);
      });
    }
  }
}
