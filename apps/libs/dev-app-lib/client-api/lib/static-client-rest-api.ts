import { Injectable } from '@angular/core';
import { PaginationQuery, BaseRestClientApi } from '@pebula/apps/client-api/rest';
import { StaticClientApi } from './static-client-api';

const DEFAULT_PAGINATION_QUERY: PaginationQuery = { page: 1, itemsPerPage: 50 };

@Injectable({ providedIn: 'root' })
export class StaticRestClientApi extends BaseRestClientApi {

  get defaultPaginationQuery(): PaginationQuery { return DEFAULT_PAGINATION_QUERY; }

  constructor(clientApi: StaticClientApi) {
    super(clientApi);
  }
}
