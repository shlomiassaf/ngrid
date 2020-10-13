import { Injectable } from '@angular/core';
import { DemoDataSource } from './datasource.service';
import { Person, Customer, Seller } from './datastore/models';

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

const DEFAULT_PAGINATION_QUERY: PaginationQuery = { page: 1, itemsPerPage: 50 };
const MAX_ITEMS = { people: 1324, sellers: 32332, customers: 421918 };
const getDelay = () => 200 + Math.random() * 1000;

@Injectable({ providedIn: 'root' })
export class NgridDemoRestApiClient {

  constructor(private dataSource: DemoDataSource) { }

  getPeople(request: Request<Person, 'name' | 'email'>): Promise<Response<Person, 'name' | 'email'>> {
    const { pagination, from, to } = this.calcPagination(request.pagination, MAX_ITEMS.people);
    return this.dataSource.getPeople(getDelay(), to)
      .then( items => ({ pagination ,items: items.slice(from, to) }) );
  }

  getCustomers(request: Request<Customer>): Promise<Response<Customer>> {
    const { pagination, from, to } = this.calcPagination(request.pagination, MAX_ITEMS.customers);
    return this.dataSource.getCustomers(getDelay(), to)
      .then( items => ({ pagination ,items: items.slice(from, to) }) );
  }


  getSellers(request: Request<Seller>): Promise<Response<Seller>> {
    const { pagination, from, to } = this.calcPagination(request.pagination, MAX_ITEMS.sellers);
    return this.dataSource.getSellers(getDelay(), to)
      .then( items => ({ pagination ,items: items.slice(from, to) }) );
  }

  private calcPagination(pagination: PaginationQuery, maxItems: number) {
    if (!pagination) {
      pagination = DEFAULT_PAGINATION_QUERY;
    }

    if ('page' in pagination) {
      return {
        from: (pagination.page - 1) * pagination.itemsPerPage,
        to: Math.min(pagination.page * pagination.itemsPerPage, maxItems),
        pagination: {
          totalPages: Math.ceil(maxItems / pagination.itemsPerPage),
          currentPage: pagination.page,
          totalItems: maxItems,
        }
      };
    } else if ('skip' in pagination) {
      const from = pagination.skip;
      const to = Math.min(from + pagination.limit, maxItems);

      return {
        from,
        to,
        pagination: {
          ...pagination,
          totalItems: maxItems,
        }
      };
    }
  }
}
