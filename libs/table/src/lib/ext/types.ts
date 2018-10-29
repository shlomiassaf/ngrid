import { NegDataSource } from '../data-source';

export interface NegTablePlugin { }

export interface NegTablePluginExtension { }

export interface NegTablePluginExtensionFactories { }

export interface NegTableOnInitEvent {
  kind: 'onInit';
}

export interface NegTableOnResizeRowtEvent {
  kind: 'onResizeRow';
}

export interface NegTableOnInvalidateHeadersEvent {
  kind: 'onInvalidateHeaders';
}

export interface NegTableOnDataSourcetEvent {
  kind: 'onDataSource';
  prev: NegDataSource<any>;
  curr: NegDataSource<any>;
}

export type NegTableEvents =
  | NegTableOnInitEvent
  | NegTableOnResizeRowtEvent
  | NegTableOnInvalidateHeadersEvent
  | NegTableOnDataSourcetEvent;


