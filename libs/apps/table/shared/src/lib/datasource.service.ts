import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as countryData from 'country-data';
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

@Injectable({ providedIn: 'root' })
export class DemoDataSource {
  ready: Promise<void>;

  private customers: Customer[] = [];
  private persons: Person[] = [];
  private sellers: Seller[] = [];
  private countries: any = countryData;
  private controller: ServiceWorker;
  private messageEventListener = (event: IncomingServerMessageEvent) => this.onMessage(event);

  constructor(@Inject(DOCUMENT) document: Document) {
    const skipUpdate = false;
    if ('serviceWorker' in navigator &&  (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
      const src = document.currentScript ? document.currentScript.getAttribute('src') : '';
      const srcParts = src.split('/');
      srcParts.pop();
      srcParts.push('sw.js');
      this.ready = navigator.serviceWorker.register((srcParts.length > 1 ? '/' : '') + srcParts.join('/'))
        .then( () => {
           // controller may be set when sw is ready
          const hasController = !!navigator.serviceWorker.controller;
          return navigator.serviceWorker.ready
            .then( () => navigator.serviceWorker.getRegistration() )
            .then ( registration => {
              if (!registration) {
                throw new Error('no active service worker registration is found');
              }
              if (!skipUpdate && hasController) {
                return registration.update()
                  .then( () => {
                    const newWorker = registration.installing || registration.waiting;

                    if (newWorker) {
                      // wait until worker is activated
                      return eventWaitUntil(newWorker, 'statechange', () => newWorker.state === 'activated')
                        .then( () => registration );
                    }
                    return registration;
                  });
              } else {
                return registration;
              }
            })
            .then ( registration => {
              const controller = registration.active;

              if (!controller) {
                throw new Error('no active service worker registration is found');
              }

              // uncontrolled
              // possibly a newly install
              // if (!navigator.serviceWorker.controller) {
              //   await sendMessageRequest(controller, {
              //     action: ACTION.REQUEST_CLAIM,
              //   });
              // }

              // await sendMessageRequest(controller, {
              //   action: ACTION.PING,
              // });


              this.controller = registration.active;
              this.controller.addEventListener('message', this.messageEventListener );
            })
        });
    }
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


  getCountries() {
    return Promise.resolve(this.countries);
  }

  dispose(): void {
    this.controller.removeEventListener('message', this.messageEventListener);
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
    return this.controller
      ? sendMessageRequest<T>(this.controller, message, timeout)
      : this.ready.then( () => this.sendAction(action, data, timeout) );
  }
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
