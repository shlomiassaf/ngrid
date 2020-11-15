import { Injectable } from '@angular/core';
import { PaginationQuery, BaseRestClientApi } from '@pebula/apps/client-api/rest';
import { DynamicClientApi } from './dynamic-api-client';

const DEFAULT_PAGINATION_QUERY: PaginationQuery = { page: 1, itemsPerPage: 50 };
const MAX_ITEMS = { people: 1324, sellers: 32332, customers: 421918 };

@Injectable({ providedIn: 'root' })
export class DynamicRestClientApi extends BaseRestClientApi {

  get maxItems() { return MAX_ITEMS; }

  get defaultPaginationQuery(): PaginationQuery { return DEFAULT_PAGINATION_QUERY; }

  constructor(datasource: DynamicClientApi) {
    super(datasource);
  }
}
