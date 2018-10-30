import { Injectable } from '@angular/core';

export interface Person {
  id: number;
  name: string;
  email: string;
  gender: 'Male' | 'Female';
  country: string;
  birthdate: string;
  bio: string;
  language: string;
  lead: boolean;
  balance: number;
  settings: {
    background: string;
    timezone: string;
    emailFrequency: 'Daily' | 'Weekly' | 'Yearly' | 'Often' | 'Seldom' | 'Never';
    avatar: string;
  };
  lastLoginIp: string;
}

export interface Customer {
  name: string;
  country: string;
  jobTitle: string;
  accountId: string;
  accountType: string;
  currencyCode: string;
  primeAccount: boolean;
  balance: number;
  creditScore: number;
  monthlyBalance: number[];
  
}

@Injectable({ providedIn: 'root' })
export class DemoDataSource {

  private customers: Customer[] = [];
  private persons: Person[] = [];

  getCustomersSync(limit = 500): Customer[] {
    return this.customers.slice(0, limit);
  }

  getCustomers(delay = 1000, limit = 500): Promise<Customer[]> {
    return this.getCountries()
      .then( () => this.wait(delay) )
      .then( () => import('faker'))
      .then( faker => {
        if (this.customers.length < limit - 1) {
          for (let i = this.customers.length; i < limit; i++) {
            const customer: Customer = {
              name: faker.name.findName(),
              country: faker.address.countryCode(),
              jobTitle: faker.name.jobTitle(),
              accountId: faker.finance.account(),
              accountType: faker.finance.accountName(),
              currencyCode: faker.finance.currencyCode(),
              primeAccount: faker.random.boolean(),
              balance: faker.random.number({ min: -50000, max: 50000, precision: 2 }),
              creditScore: faker.random.number(4) + 1,
              monthlyBalance: Array.from(new Array(12)).map( () => faker.random.number({ min: -15000, max: 15000, precision: 2 }) )
            }
            this.customers.push(customer);
          }
        }
        return this.customers.slice(0, limit);
      });
  }

  getPeopleSync(limit = 500): Person[] {
    return this.persons.slice(0, limit);
  }

  getPeople(delay = 1000, limit = 500): Promise<Person[]> {
    return this.getCountries()
      .then( () => this.wait(delay) )
      .then( () => import('faker'))
      .then( faker => {
        if (this.persons.length < limit - 1) {
          for (let i = this.persons.length; i < limit; i++) {
            const p: Person = {
              id: i,
              name: faker.name.findName(),
              email: faker.internet.email(),
              gender: faker.random.arrayElement(['Male', 'Female'] as  ['Male', 'Female']),
              country: faker.address.countryCode(),
              birthdate: faker.date.past().toISOString(),
              bio: faker.lorem.paragraph(),
              language: 'EN',
              lead: faker.random.boolean(),
              balance: faker.random.number({ min: -20000, max: 20000, precision: 2 }),
              settings: {
                background: faker.internet.color(),
                timezone: 'UTC',
                emailFrequency: faker.random.arrayElement(['Daily', 'Weekly', 'Yearly', 'Often', 'Seldom', 'Never'] as  ['Daily', 'Weekly', 'Yearly', 'Often', 'Seldom', 'Never']),
                avatar: faker.image.avatar(),
              },
              lastLoginIp: faker.internet.ip()
            }
            this.persons.push(p);
          }
        }
        return this.persons.slice(0, limit);
      });
  }

  getCountries(delay = 0) {
    return this.wait(delay)
    .then( () => import('country-data') );
  }

  private wait(time: number): Promise<void> {
    return new Promise( resolve => {
      setTimeout(resolve, time);
    });
  }
}
