import { DATA_TYPES, Customer, Person, Seller } from '@pebula/apps/client-api';

export class WindowStoreAdapter {
  ready: Promise<void>;
  protected store: import('../datastore/datastore').DataStore;

  constructor() {
    this.setStore();
  }

  reset(...collections: Array<DATA_TYPES>): void { this.store.reset(...collections); }
  getCustomers(delay = 1000, limit = 500): Promise<Customer[]> { return this.store.getCustomers(delay, limit); }
  getPeople(delay = 1000, limit = 500): Promise<Person[]> { return this.store.getPeople(delay, limit); }
  getSellers(delay = 1000, limit = 500): Promise<Seller[]> { return this.store.getSellers(delay, limit); }

  dispose(): void { }

  protected setStore() {
    this.ready = import('../datastore/datastore')
      .then( datastore => {
        this.store = new  datastore.DataStore();
      });
  }
}

export default WindowStoreAdapter;
