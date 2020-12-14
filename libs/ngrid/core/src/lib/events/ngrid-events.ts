export interface PblNgridEventSourceMap {
  grid: true;
}

export interface PblNgridEvent<TSource extends keyof PblNgridEventSourceMap = keyof PblNgridEventSourceMap, TKind extends keyof PblNgridEventsMap = keyof PblNgridEventsMap> {
  source: TSource;
  kind: TKind;
}

/**
 * This event is fired after the grid has constructed, including the main internal grid component and the viewport.
 * > Note that the components we're constructed, not initialized!
 */
export interface PblNgridOnConstructedEvent extends PblNgridEvent<'grid', 'onConstructed'> { }

/**
 * This event is fired after the grid has initialized
 */
export interface PblNgridOnInitEvent extends PblNgridEvent<'grid', 'onInit'> { }

export interface PblNgridOnResizeRowEvent extends PblNgridEvent<'grid', 'onResizeRow'> { }

export interface PblNgridOnInvalidateHeadersEvent extends PblNgridEvent<'grid', 'onInvalidateHeaders'> { }

export interface PblNgridBeforeInvalidateHeadersEvent extends PblNgridEvent<'grid', 'beforeInvalidateHeaders'> { }

export interface PblNgridOnDestroyEvent extends PblNgridEvent<'grid', 'onDestroy'> {
  wait(p: Promise<void>): void;
}

export interface PblNgridEventsMap {
  onConstructed: PblNgridOnConstructedEvent;
  onInit: PblNgridOnInitEvent;
  onResizeRow: PblNgridOnResizeRowEvent;
  onInvalidateHeaders: PblNgridOnInvalidateHeadersEvent;
  beforeInvalidateHeaders: PblNgridBeforeInvalidateHeadersEvent;
  onDestroy: PblNgridOnDestroyEvent;
}

export type PblNgridEvents = PblNgridEventsMap[keyof PblNgridEventsMap];
