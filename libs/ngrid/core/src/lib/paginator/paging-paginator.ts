import { Observable, BehaviorSubject } from 'rxjs';
import { PblPaginator, PblPaginatorChangeEvent } from './types';

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
        this.queuedChanges = undefined;
        this.onChange$.next(changes);
      });
    }
  }
}
