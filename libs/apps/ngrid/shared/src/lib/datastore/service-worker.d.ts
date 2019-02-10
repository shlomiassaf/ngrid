interface ExtendableEvent extends Event {
  waitUntil(fn: Promise<any>): void;
}

interface NotificationEvent {
  action: string;
  notification: Notification;
}

interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Promise<Response>|Response): Promise<Response>;
}

interface PushMessageData {
  arrayBuffer(): ArrayBuffer;
  blob(): Blob;
  json(): any;
  text(): string;
}

interface PushEvent extends ExtendableEvent {
  data: PushMessageData;
}

interface SyncEvent extends Event {
  lastChance: boolean;
  tag: string;
}

interface Client {
  frameType: ClientFrameType;
  id: string;
  url: string;
  type: 'window' | 'worker' | 'sharedworker';
  postMessage(message: any, transfer?: any[]): void;
}

interface Clients {
  claim(): Promise<any>;
  get(id: string): Promise<Client>;
  matchAll(options?: ClientMatchOptions): Promise<Client[]>;
  openWindow(url: string): Promise<WindowClient>;
}

interface ClientMatchOptions {
  includeUncontrolled?: boolean;
  type?: ClientMatchTypes;
}

interface WindowClient {
  focused: boolean;
  visibilityState: WindowClientState;
  focus(): Promise<WindowClient>;
  navigate(url: string): Promise<WindowClient>;
}

type ClientFrameType = 'auxiliary' | 'top-level' | 'nested' | 'none';
type ClientMatchTypes = 'window' | 'worker' | 'sharedworker' | 'all';
type WindowClientState = 'hidden' | 'visible' | 'prerender' | 'unloaded';

interface ServiceWorkerEventMap extends AbstractWorkerEventMap {
  statechange: Event;
  fetch: FetchEvent;
  install: ExtendableEvent;
  activate: ExtendableEvent;
  message: MessageEvent;
  push: PushEvent;
  sync: SyncEvent;
  notificationclick: NotificationEvent;
  notificationclose: NotificationEvent;
  pushsubscriptionchange: never;
}

interface ServiceWorkerGlobalScope extends ServiceWorker {
  Headers: Headers;
  Response: Response;
  Request: Request;
  caches: CacheStorage;
  location: any;
  clients: Clients;
  onactivate: (event?: ExtendableEvent) => any;
  onfetch: (event?: FetchEvent) => any;
  oninstall: (event?: ExtendableEvent) => any;
  onmessage: (event: MessageEvent) => any;
  onnotificationclick: (event?: NotificationEvent) => any;
  onnotificationclose: (event?: NotificationEvent) => any;
  onpush: (event?: PushEvent) => any;
  onpushsubscriptionchange: () => any;
  onsync: (event?: SyncEvent) => any;
  registration: ServiceWorkerRegistration;

  fetch(request: Request|string): Promise<Response>;
  skipWaiting(): void;
}
