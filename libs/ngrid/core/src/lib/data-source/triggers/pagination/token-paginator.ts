import { Observable, BehaviorSubject } from 'rxjs';
import { PblPaginator, PblPaginatorChangeEvent } from './types';

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
        this.queuedChanges = undefined;
        this.onChange$.next(changes);
      });
    }
  }
}
