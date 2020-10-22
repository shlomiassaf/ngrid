import { PblDataSource } from '../data-source';

/**
 * This event is fired after the grid has constructed, including the main internal grid component and the viewport.
 * > Note that the components we're constructed, not initialized!
 */
export interface PblNgridOnConstructedEvent {
  kind: 'onConstructed';
}

/**
 * This event is fired after the grid has initialized
 */
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
  | PblNgridOnConstructedEvent
  | PblNgridOnInitEvent
  | PblNgridOnResizeRowEvent
  | PblNgridBeforeInvalidateHeadersEvent
  | PblNgridOnInvalidateHeadersEvent
  | PblNgridOnDataSourceEvent
  | PblNgridOnDestroyEvent;
