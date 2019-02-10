
export interface ClientProtocol { }

export interface ServerProtocol { }

export interface MessageResponse<Req = any, Res = any> {
  request: Req;
  data: Res;
}

export type ClientRequest<T extends keyof ClientProtocol = keyof ClientProtocol> = ClientProtocol[T]['request'];
export type ServerResponse<T extends keyof ClientProtocol = keyof ClientProtocol> = ClientProtocol[T]['response']; // tslint:disable-line

export type ServerRequest<T extends keyof ServerProtocol = keyof ServerProtocol> = ServerProtocol[T]['request'];
export type ClientResponse<T extends keyof ServerProtocol = keyof ServerProtocol> = ServerProtocol[T]['response']; // tslint:disable-line

export type ClientPostMessageEvent<T extends keyof ClientProtocol = keyof ClientProtocol>
  = MessageResponse<ClientProtocol[T]['request'], ClientProtocol[T]['response']>;

export type ServerPostMessageEvent<T extends keyof ServerProtocol = keyof ServerProtocol>
  = MessageResponse<ServerProtocol[T]['request'], ServerProtocol[T]['response']>;

export class ServiceWorkerMessageError<T> extends Error {
  name = 'ServiceWorkerMessageError';
  remoteError?: ServiceWorkerRemoteError;
  request: T;

  private constructor() {
    super();
  }

  static create<T>(request: T, message: string, remoteError?: any): ServiceWorkerMessageError<T> {
    // tslint:disable-next-line:no-use-before-declare
    const err = new ServiceWorkerMessageError<T>();
    Object.setPrototypeOf(err, ServiceWorkerMessageError.prototype);
    err.request = request;
    if (remoteError) {
      err.remoteError = remoteError;
      err.message = `${err.name}: ${message}\n${remoteError.name}: ${remoteError.message}`;
      if (remoteError.stack) {
        err.stack = remoteError.stack;
      }
    } else {
      err.message = message;
    }
    return err;
  }
}

export interface ServiceWorkerRemoteError {
  name: string;
  message: string;
  stack?: any;
}

export function postError(error: Error, withStack: boolean = true): { error: ServiceWorkerRemoteError } {
  const e = {
    error: {
      name: error.name,
      message: error.message
    } as ServiceWorkerRemoteError
  };
  if (withStack) {
    e.error.stack = error.stack;
  }
  return e;
}

export function sendMessageRequest<T extends keyof ServerProtocol>(
  target: Window | ServiceWorker | Client,
  message: { action: T, data: ServerRequest<T> },
  timeout?: number
): Promise<ServerPostMessageEvent<T>>;
export function sendMessageRequest<T extends keyof ClientProtocol>(
  target: Window | ServiceWorker | Client,
  message: { action: T, data: ClientRequest<T> },
  timeout?: number
): Promise<ClientPostMessageEvent<T>>;
export function sendMessageRequest<T extends keyof (ServerProtocol | ClientProtocol)>(
  target: Window | ServiceWorker | Client,
  message: { action: T, data: ClientRequest<T> | ServerRequest<T> },
  timeout = 3 * 1e3
): Promise<ClientPostMessageEvent<T> | ServerPostMessageEvent<T>> {

  const { port1, port2 } = new MessageChannel();

  return new Promise((resolve, reject) => {
    const timer = isFinite(timeout) && setTimeout(() => {
      reject(ServiceWorkerMessageError.create(message.data, `Service worker message timeout.`));
    }, timeout);

    port1.onmessage = ({ data }) => {
      if (timer) {
        clearTimeout(timer);
      }

      // avoid high transient memory usage, see
      // https://html.spec.whatwg.org/multipage/comms.html#ports-and-garbage-collection
      port1.close();
      port2.close();

      if (data && data.error) {
        reject(ServiceWorkerMessageError.create(message, `Service worker remote error.`, data.error));
      } else {
        resolve({ data, request: <any> message.data });
      }
    };

    if (target === self.window) {
      // posting message to self => legacy mode
      // add `origin` param to `window.postMessage(message, targetOrigin, [transfer])`
      target.postMessage(message, '*', [ port2 ]);
    } else {
      (target as ServiceWorker).postMessage(message, [ port2 ]);
    }
  });
}
