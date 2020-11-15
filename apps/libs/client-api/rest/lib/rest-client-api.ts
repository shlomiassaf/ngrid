import { Person, Customer, Seller, BaseClientApi } from '@pebula/apps/client-api';
import { PaginationQuery, Response, Request } from './types';

export abstract class BaseRestClientApi {

  get maxItems() { return this.clientApi.maxItems; }

  abstract get defaultPaginationQuery(): PaginationQuery;

  private _ready = false;

  constructor(protected clientApi: BaseClientApi) {
    this.clientApi.ready.then(() => this._ready = true);
  }

  getPeopleAll(): Promise<Person[]> {
    if (!this._ready) {
      return this.clientApi.ready.then(() => this.getPeopleAll());
    }
    return this.clientApi.getPeople(this.getDelay(), this.maxItems.people);
  }

  getPeople(request?: Request<Person, 'name' | 'email'>): Promise<Response<Person, 'name' | 'email'>> {
    if (!this._ready) {
      return this.clientApi.ready.then(() => this.getPeople(request));
    }
    const { pagination, from, to } = this.calcPagination(request.pagination, this.maxItems.people);
    return this.clientApi.getPeople(this.getDelay(), to)
      .then( items => ({ pagination ,items: items.slice(from, to) }) );
  }

  getCustomersAll(): Promise<Customer[]> {
    if (!this._ready) {
      return this.clientApi.ready.then(() => this.getCustomersAll());
    }
    return this.clientApi.getCustomers(this.getDelay(), this.maxItems.customers);
  }

  getCustomers(request?: Request<Customer>): Promise<Response<Customer>> {
    if (!this._ready) {
      return this.clientApi.ready.then(() => this.getCustomers(request));
    }
    const { pagination, from, to } = this.calcPagination(request.pagination, this.maxItems.customers);
    return this.clientApi.getCustomers(this.getDelay(), to)
      .then( items => ({ pagination ,items: items.slice(from, to) }) );
  }

  getSellersAll(): Promise<Seller[]> {
    if (!this._ready) {
      return this.clientApi.ready.then(() => this.getSellersAll());
    }
    return this.clientApi.getSellers(this.getDelay(), this.maxItems.sellers);
  }

  getSellers(request?: Request<Seller>): Promise<Response<Seller>> {
    if (!this._ready) {
      return this.clientApi.ready.then(() => this.getSellers(request));
    }
    const { pagination, from, to } = this.calcPagination(request.pagination, this.maxItems.sellers);
    return this.clientApi.getSellers(this.getDelay(), to)
      .then( items => ({ pagination ,items: items.slice(from, to) }) );
  }

  protected getDelay() {
    return 0; //00 + Math.random() * 1000;
  }

  protected calcPagination(pagination: PaginationQuery, maxItems: number) {
    if (!pagination) {
      pagination = this.defaultPaginationQuery;
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
