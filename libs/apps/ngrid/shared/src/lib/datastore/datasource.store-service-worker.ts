import * as Faker from 'faker';
import {
  postError,
  sendMessageRequest,
  ServerProtocol,
  ServerRequest,
  ServerResponse,
  ClientProtocol,
  ClientRequest,
  ServerPostMessageEvent
} from './shared';
import { Customer, Person, Seller } from './models';
import { DATA_TYPES } from './protocols';

export interface IncomingClientMessageEvent<T extends keyof ClientProtocol = keyof ClientProtocol> extends MessageEvent {
  data: {
    action: T;
    data: ClientRequest<T>
  };
}

function getFaker(): Promise<typeof Faker> {
  // return import('faker');
  return Promise.resolve(Faker)
}

export class DatasourceStore {

  private customers: Customer[] = [];
  private persons: Person[] = [];
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
    return this.persons.slice(0, limit);
  }

  getPeople(delay = 1000, limit = 500): Promise<Person[]> {
    return this.wait(delay)
      .then( () => getFaker())
      .then( faker => {
        if (this.persons.length < limit) {
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

  onMessage(event: IncomingClientMessageEvent): void {
    const { data, ports } = event;

    if ( !data || !ports || !ports.length ) {
      return;
    }

    const port = ports[ 0 ];

    const d = data.data;
    let p: Promise<any>;
    switch (data.action) {
      case 'reset':
        this.reset(...d.type)
        break;
      case 'getCustomers':
        p = this.getCustomers(d.delay, d.limit);
        break;
      case 'getPeople':
        p = this.getPeople(d.delay, d.limit);
        break;
      case 'getSellers':
        p = this.getSellers(d.delay, d.limit);
        break;
    }
    if (p) {
      p.then(response => port.postMessage(response))
          .catch(err => port.postMessage(postError(err)));
    }
  }


  private wait(time: number): Promise<void> {
    return new Promise( resolve => {
      setTimeout(resolve, time);
    });
  }
}

const DEBUG = true;
const serviceWorker: ServiceWorkerGlobalScope = self as any;
const store = new DatasourceStore();

// When the service worker is first added to a computer.
serviceWorker.addEventListener('install', event => {
   // Perform install steps.
  if (DEBUG) {
    console.log('[SW] Install event')
  }
  event.waitUntil(Promise.resolve())
})

// After the install event.
serviceWorker.addEventListener('activate', event => {
  if (DEBUG) {
    console.log('[SW] Activate event')
  }
  // Clean the caches
  event.waitUntil(Promise.resolve());
})

serviceWorker.addEventListener('message', event => {
  switch (event.data.action) {
    case 'skipWaiting':
      if (serviceWorker.skipWaiting) {
        serviceWorker.skipWaiting();
        serviceWorker.clients.claim();
      }
      break
    default:
      store.onMessage(event);
  }
});
