import { CountryData, Person, Customer, Seller, DATA_TYPES } from './models';

export abstract class BaseClientApi {
  ready: Promise<void>;

  abstract get maxItems(): Record<DATA_TYPES, number>;

  abstract reset(...collections: Array<DATA_TYPES>): void;
  abstract getCustomers(delay?: number, limit?: number): Promise<Customer[]>;
  abstract getPeople(delay?: number, limit?: number): Promise<Person[]>;
  abstract getSellers(delay?: number, limit?: number): Promise<Seller[]>;
  abstract getCountries(): Promise<CountryData>;
}
