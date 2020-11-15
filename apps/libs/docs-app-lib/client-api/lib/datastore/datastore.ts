import { DATA_TYPES, Customer, Person, Seller } from '@pebula/apps/client-api';

function getFaker(): Promise<typeof import('faker')> {
  return import('faker');
}

export class DataStore {

  private customers: Customer[] = [];
  private people: Person[] = [];
  private sellers: Seller[] = [];

  reset(...collections: Array<DATA_TYPES>): void {
    for (const c of collections) {
      this[c] = [];
    }
  }

  getCustomersSync(limit = 500): Customer[] {
    return this.customers.slice(0, limit);
  }

  getCustomers(delay = 1000, limit = 500): Promise<Customer[]> {
    return this.wait(delay)
      .then( () => getFaker())
      .then( faker => {
        if (this.customers.length < limit) {
          for (let i = this.customers.length; i < limit; i++) {
            const customer: Customer = {
              id: i + 1,
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
    return this.people.slice(0, limit);
  }

  getPeople(delay = 1000, limit = 500): Promise<Person[]> {
    return this.wait(delay)
      .then( () => getFaker())
      .then( faker => {
        if (this.people.length < limit) {
          for (let i = this.people.length; i < limit; i++) {
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
            this.people.push(p);
          }
        }
        return this.people.slice(0, limit);
      });
  }


  getSellersSync(limit = 500): Seller[] {
    return this.sellers.slice(0, limit);
  }

  getSellers(delay = 1000, limit = 500): Promise<Seller[]> {
    return this.wait(delay)
      .then( () => getFaker())
      .then( faker => {
        if (this.sellers.length < limit) {
          for (let i = this.sellers.length; i < limit; i++) {
            const p: Seller = {
              id: i,
              name: faker.name.findName(),
              company: faker.company.companyName(),
              department: faker.commerce.department(),
              country: faker.address.countryCode(),
              email: faker.internet.email(),
              sales: faker.random.number({ min: 0, max: 200000, precision: 2 }),
              rating: faker.random.number(4) + 1,
              feedback: faker.random.number({ min: 5, max: 100 }),
              address: [
                faker.address.streetAddress(),
                faker.address.city(),
                faker.address.stateAbbr(),
                faker.address.zipCode(),
              ].join(', '),
            }
            this.sellers.push(p);
          }
        }
        return this.sellers.slice(0, limit);
      });
  }

  private wait(time: number): Promise<void> {
    return new Promise( resolve => {
      setTimeout(resolve, time);
    });
  }
}
