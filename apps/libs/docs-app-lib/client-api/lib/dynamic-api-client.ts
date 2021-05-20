import { Injectable } from '@angular/core';
import { DATA_TYPES, Customer, Person, Seller, BaseClientApi } from '@pebula/apps/client-api';
import WindowStoreAdapter from './client-adapters/window';
import WorkerStoreAdapter from './client-adapters/worker';

const MAX_ITEMS = { people: Number.MAX_SAFE_INTEGER, sellers: Number.MAX_SAFE_INTEGER, customers: Number.MAX_SAFE_INTEGER };

@Injectable({ providedIn: 'root' })
export class DynamicClientApi extends BaseClientApi {

  get maxItems() { return MAX_ITEMS; }

  protected countries: any;
  protected adapter: WorkerStoreAdapter | WindowStoreAdapter;

  constructor() {
    super();
    this.createAdapter();
  }

  reset(...collections: Array<DATA_TYPES>): void { this.adapter.reset(...collections); }

  getCustomers(delay = 1000, limit = 500): Promise<Customer[]> { return this.adapter.getCustomers(delay, limit); }

  getPeople(delay = 1000, limit = 500): Promise<Person[]> { return this.adapter.getPeople(delay, limit); }

  getSellers(delay = 1000, limit = 500): Promise<Seller[]> { return this.adapter.getSellers(delay, limit); }

  getCountries() {
    return this.countries
      ? Promise.resolve(this.countries)
      : import('country-data').then( countryData => this.countries = countryData )
    ;
  }

  dispose(): void { this.adapter.dispose(); }

  protected createAdapter() {
    if (typeof Worker !== 'undefined') {
      this.adapter = new WorkerStoreAdapter();
    } else {
      this.adapter = new WindowStoreAdapter();
    }
    this.ready = this.adapter.ready;
  }
}
