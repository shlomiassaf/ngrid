import { PblDataSource } from '../data-source';

export interface PblNgridPlugin { }

export interface PblNgridPluginExtension { }

export interface PblNgridPluginExtensionFactories { }

export interface PblNgridOnInitEvent {
  kind: 'onInit';
}

export interface PblNgridOnResizeRowtEvent {
  kind: 'onResizeRow';
}

export interface PblNgridOnInvalidateHeadersEvent {
  kind: 'onInvalidateHeaders';
}

export interface PblNgridOnDataSourcetEvent {
  kind: 'onDataSource';
  prev: PblDataSource<any>;
  curr: PblDataSource<any>;
}

export type PblNgridEvents =
  | PblNgridOnInitEvent
  | PblNgridOnResizeRowtEvent
  | PblNgridOnInvalidateHeadersEvent
  | PblNgridOnDataSourcetEvent;


