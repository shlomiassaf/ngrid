import { DATA_TYPES, Customer, Person, Seller } from '@pebula/apps/client-api';

import {
  postError,
  sendMessageRequest,
  ServerProtocol,
  ServerRequest,
  ClientProtocol,
  ClientRequest,
  ClientPostMessageEvent
} from '../datastore/shared';

interface IncomingServerMessageEvent<T extends keyof ServerProtocol = keyof ServerProtocol> extends MessageEvent {
  data: {
    action: T;
    data: ServerRequest<T>
  };
}

export class WorkerStoreAdapter {
  ready: Promise<void>;

  private worker: Worker;
  private messageEventListener = (event: IncomingServerMessageEvent) => this.onMessage(event);

  constructor() {
    const worker = this.worker = new Worker(new URL('../datastore/datastore.worker', import.meta.url), { name: 'dataSourceWorker', type: 'module' });
    worker.onerror = (errorEvent: ErrorEvent) => { console.error(errorEvent.message) };
    worker.onmessageerror = event => { console.log(event) };
    this.ready = eventWaitUntil(worker, 'message', event => event.data === 'ready')
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

/**
 * Wait until an event matches given conditions
 */
export function eventWaitUntil(target: any, event: string, comparer: (event: MessageEvent) => boolean): Promise<Event> {
  return new Promise((resolve) => {
    target.addEventListener(event, function handler(evt) {
      if (comparer(evt)) {
        target.removeEventListener(event, handler);
        resolve(evt);
      }
    });
  });
}

export default WorkerStoreAdapter;
