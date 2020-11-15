/// <reference lib="webworker" />
import { postError, ClientProtocol, ClientRequest } from './shared';
import { DataStore } from './datastore';

export interface IncomingClientMessageEvent<T extends keyof ClientProtocol = keyof ClientProtocol> extends MessageEvent {
  data: {
    action: T;
    data: ClientRequest<T>
  };
}

export class DatasourceStore {
  store = new DataStore();

  onMessage<T extends keyof ClientProtocol>(event: IncomingClientMessageEvent<T>): void {
    const { data, ports } = event;

    if ( !data || !ports || !ports.length ) {
      return;
    }

    const port = ports[ 0 ];

    let p: Promise<any>;
    switch (data.action) {
      case 'getCustomers':
      case 'getPeople':
      case 'getSellers':
        const action = data.action as 'getSellers' | 'getCustomers' | 'getPeople';
        const d = data.data as ClientRequest<'getSellers' | 'getCustomers' | 'getPeople'>;
        p = this.store[action](d.delay, d.limit);
        break;
      case 'reset':
        this.store.reset(...(data.data as ClientRequest<'reset'>).type)
        break;
    }
    if (p) {
      p.then(response => port.postMessage(response))
          .catch(err => port.postMessage(postError(err)));
    }
  }
}

const store = new DatasourceStore();

addEventListener('message', event => {
  switch (event.data.action) {
    default:
      store.onMessage(event);
  }
});

postMessage('ready');
