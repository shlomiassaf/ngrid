import { DATA_TYPES, Customer, Person, Seller } from '@pebula/apps/client-api';

declare const require: any;

const SELLERS = require('./sellers.json');
const CUSTOMERS = [];
const PEOPLE = [];

const MAX_ITEMS = { people: PEOPLE.length, sellers: SELLERS.length, customers: CUSTOMERS.length };

export class DataStore {

  private customers: Customer[] = CUSTOMERS;
  private people: Person[] = PEOPLE;
  private sellers: Seller[] = SELLERS;

  get maxItems() { return MAX_ITEMS; }

  getCustomersSync(limit = 500): Customer[] {
    return this.customers.slice(0, limit);
  }

  getCustomers(delay = 1000, limit = 500): Promise<Customer[]> {
    return this.wait(delay)
      .then(() => this.customers.slice(0, limit));
  }

  getPeopleSync(limit = 500): Person[] {
    return this.people.slice(0, limit);
  }

  getPeople(delay = 1000, limit = 500): Promise<Person[]> {
    return this.wait(delay)
      .then(() => this.people.slice(0, limit));
  }


  getSellersSync(limit = 500): Seller[] {
    return this.sellers.slice(0, limit);
  }

  getSellers(delay = 1000, limit = 500): Promise<Seller[]> {
    return this.wait(delay)
      .then(() => this.sellers.slice(0, limit));
  }

  private wait(time: number): Promise<void> {
    return new Promise( resolve => {
      setTimeout(resolve, time);
    });
  }
}
