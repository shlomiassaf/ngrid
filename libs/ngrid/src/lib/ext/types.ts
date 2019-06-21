import { PblDataSource } from '../data-source';

export interface PblNgridPlugin { }

export interface PblNgridPluginExtension { }

export interface PblNgridPluginExtensionFactories { }

export interface PblNgridOnInitEvent {
  kind: 'onInit';
}

export interface PblNgridOnResizeRowEvent {
  kind: 'onResizeRow';
}

export interface PblNgridOnInvalidateHeadersEvent {
  kind: 'onInvalidateHeaders';
}

export interface PblNgridBeforeInvalidateHeadersEvent {
  kind: 'beforeInvalidateHeaders';
}

export interface PblNgridOnDestroyEvent {
  kind: 'onDestroy';
  wait(p: Promise<void>): void;
}

export interface PblNgridOnDataSourceEvent {
  kind: 'onDataSource';
  prev: PblDataSource<any>;
  curr: PblDataSource<any>;
}

export type PblNgridEvents =
  | PblNgridOnInitEvent
  | PblNgridOnResizeRowEvent
  | PblNgridBeforeInvalidateHeadersEvent
  | PblNgridOnInvalidateHeadersEvent
  | PblNgridOnDataSourceEvent
  | PblNgridOnDestroyEvent;


