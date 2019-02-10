import { PblDataSource } from '../data-source';

export interface PblTablePlugin { }

export interface PblTablePluginExtension { }

export interface PblTablePluginExtensionFactories { }

export interface PblTableOnInitEvent {
  kind: 'onInit';
}

export interface PblTableOnResizeRowtEvent {
  kind: 'onResizeRow';
}

export interface PblTableOnInvalidateHeadersEvent {
  kind: 'onInvalidateHeaders';
}

export interface PblTableOnDataSourcetEvent {
  kind: 'onDataSource';
  prev: PblDataSource<any>;
  curr: PblDataSource<any>;
}

export type PblTableEvents =
  | PblTableOnInitEvent
  | PblTableOnResizeRowtEvent
  | PblTableOnInvalidateHeadersEvent
  | PblTableOnDataSourcetEvent;


