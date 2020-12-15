import { Observable } from 'rxjs';

export type PblNgridPaginatorKind = 'pageNumber' | 'token';

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
  kind: PblNgridPaginatorKind;
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
