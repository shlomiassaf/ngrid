import { SgDataSource } from '../data-source';

export interface SgTablePlugin { }

export interface SgTablePluginExtension { }

export interface SgTablePluginExtensionFactories { }

export interface SgTableOnInitEvent {
  kind: 'onInit';
}

export interface SgTableOnResizeRowtEvent {
  kind: 'onResizeRow';
}

export interface SgTableOnInvalidateHeadersEvent {
  kind: 'onInvalidateHeaders';
}

export interface SgTableOnDataSourcetEvent {
  kind: 'onDataSource';
  prev: SgDataSource<any>;
  curr: SgDataSource<any>;
}

export type SgTableEvents =
  | SgTableOnInitEvent
  | SgTableOnResizeRowtEvent
  | SgTableOnInvalidateHeadersEvent
  | SgTableOnDataSourcetEvent;


