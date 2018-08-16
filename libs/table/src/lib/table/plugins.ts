import { SgDataSource } from '../data-source';

export interface SgTableOnInitEvent {
  kind: 'onInit';
  registerPlugin<P extends keyof SgTablePluginExtension>(name: P, iface: SgTablePluginExtension[P]): void;
}

export interface SgTableOnResizeRowtEvent {
  kind: 'onResizeRow';
}

export interface SgTableOnInvalidateHeadersEvent {
  kind: 'onInvalidateHeaders';
  rebuildColumns: boolean;
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

export interface SgTablePluginExtension { }
