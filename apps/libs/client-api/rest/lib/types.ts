export interface SortingDto<T> {
  direction: 'asc' | 'desc';
  sort: T;
}

export interface PageBasedPagingDto {
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface IndexBasedPagingDto {
  skip: number;
  limit: number;
  totalItems: number;
}

export type PagingDto = PageBasedPagingDto | IndexBasedPagingDto;

export interface PageBasedPaginationQuery {
  page: number;
  itemsPerPage: 5 | 10 | 20 | 50 | 100 | 1000;
}

export interface IndexBasedPaginationQuery {
  skip: number;
  limit: number;
}

export type PaginationQuery = PageBasedPaginationQuery | IndexBasedPaginationQuery;

export interface Request<TItem, TSort = unknown> {
  sorting?: TSort extends unknown ? never : SortingDto<TSort>;
  pagination?: PaginationQuery;
}

export interface Response<TItem, TSort = unknown> {
  sorting?: TSort extends unknown ? never : SortingDto<TSort>;
  pagination?: PagingDto;
  items: TItem[];
}
