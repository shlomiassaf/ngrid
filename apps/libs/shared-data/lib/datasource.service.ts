import { Injectable } from '@angular/core';
import {
  postError,
  sendMessageRequest,
  ServerProtocol,
  ServerRequest,
  ClientResponse,
  ClientProtocol,
  ClientRequest,
  ClientPostMessageEvent
} from './datastore/shared';

import { Customer, Person, Seller } from './datastore/models';
import { DATA_TYPES } from './datastore/protocols';

interface IncomingServerMessageEvent<T extends keyof ServerProtocol = keyof ServerProtocol> extends MessageEvent {
  data: {
    action: T;
    data: ServerRequest<T>
  };
}

class WorkerStoreAdapter {
  ready: Promise<void>;

  private worker: Worker;
  private messageEventListener = (event: IncomingServerMessageEvent) => this.onMessage(event);

  constructor() {
    const worker = this.worker = new Worker('./datasource.worker', { type: 'module' });
    this.ready = eventWaitUntil(worker, 'message', msg => msg === 'ready')
      .then( () => this.worker.addEventListener('message', this.messageEventListener ) );
  }

  reset(...collections: Array<DATA_TYPES>): void {
    this.sendAction('reset', { type: collections }, NaN);
  }

  getCustomers(delay = 1000, limit = 500): Promise<Customer[]> {
    return this.sendAction('getCustomers', { delay, limit }).then( response => response.data );
  }

  getPeople(delay = 1000, limit = 500): Promise<Person[]> {
    return this.sendAction('getPeople', { delay, limit }).then( response => response.data );
  }

  getSellers(delay = 1000, limit = 500): Promise<Seller[]> {
    return this.sendAction('getSellers', { delay, limit }).then( response => response.data );
  }

  dispose(): void {
    this.worker.removeEventListener('message', this.messageEventListener);
  }

  private onMessage(event: IncomingServerMessageEvent): void {
    const {
      data,
      ports,
    } = event;

    if (!data || !ports || !ports.length) {
      return;
    }

    const port = ports[0];

    const p = Promise.resolve();
    if (p) {
      p.then(response => port.postMessage(response))
          .catch(err => port.postMessage(postError(err)));
    }
  }

  private sendAction<T extends keyof ClientProtocol = keyof ClientProtocol>(
    action: T,
    data: ClientRequest<T>,
    timeout?: number): Promise<ClientPostMessageEvent<T>> {
    const message = { action, data };
    return this.worker
      ? sendMessageRequest<T>(this.worker, message, timeout)
      : this.ready.then( () => this.sendAction(action, data, timeout) );
  }
}

class WindowStoreAdapter {
  ready: Promise<void>;
  private store: import('./datastore/datastore').DataStore;

  constructor() {
    this.ready = import('./datastore/datastore')
      .then( datastore => {
        this.store = new  datastore.DataStore();
      });
  }

  reset(...collections: Array<DATA_TYPES>): void { this.store.reset(...collections); }
  getCustomers(delay = 1000, limit = 500): Promise<Customer[]> { return this.store.getCustomers(delay, limit); }
  getPeople(delay = 1000, limit = 500): Promise<Person[]> { return this.store.getPeople(delay, limit); }
  getSellers(delay = 1000, limit = 500): Promise<Seller[]> { return this.store.getSellers(delay, limit); }

  dispose(): void { }
}

@Injectable({ providedIn: 'root' })
export class DemoDataSource {
  ready: Promise<void>;

  private countries: any;
  private adapter: WorkerStoreAdapter | WindowStoreAdapter;

  constructor() {
    if (typeof Worker !== 'undefined') {
      this.adapter = new WorkerStoreAdapter();
    } else {
      this.adapter = new WindowStoreAdapter();
    }
    this.ready = this.adapter.ready;
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
}

/**
 * Wait until an event matches given conditions
 */
export function eventWaitUntil(target: any, event: string, comparer: any): Promise<Event> {
  return new Promise((resolve) => {
    target.addEventListener(event, function handler(evt) {
      if (comparer(evt)) {
        target.removeEventListener(event, handler);
        resolve(evt);
      }
    });
  });
}
