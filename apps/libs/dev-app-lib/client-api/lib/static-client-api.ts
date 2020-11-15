import { Injectable } from '@angular/core';
import { DATA_TYPES, Customer, Person, Seller, BaseClientApi } from '@pebula/apps/client-api';

@Injectable({ providedIn: 'root' })
export class StaticClientApi extends BaseClientApi {

  get maxItems() { return this.store.maxItems; }

  protected countries: any;
  protected store: import('./datastore/datastore').DataStore;

  constructor() {
    super();
    this.ready = import('./datastore/datastore')
      .then( datastore => {
        this.store = new datastore.DataStore();
      });
  }

  reset(...collections: Array<DATA_TYPES>): void {  }

  getCustomers(delay = 1000, limit = 500): Promise<Customer[]> { return this.store.getCustomers(delay, limit); }

  getPeople(delay = 1000, limit = 500): Promise<Person[]> { return this.store.getPeople(delay, limit); }

  getSellers(delay = 1000, limit = 500): Promise<Seller[]> { return this.store.getSellers(delay, limit); }

  getCountries() {
    return this.countries
      ? Promise.resolve(this.countries)
      : import('country-data').then( countryData => this.countries = countryData )
    ;
  }

}

