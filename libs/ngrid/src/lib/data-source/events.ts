import { PblNgridEvent } from '@pebula/ngrid/core';
import { PblDataSource } from './data-source';

declare module '@pebula/ngrid/core/lib/events/ngrid-events' {
  export interface PblNgridEventSourceMap {
    ds: true;
  }
  export interface PblNgridEventsMap {
    onDataSource: PblNgridOnDataSourceEvent;
    onBeforeMoveItem: PblNgridOnBeforeMoveItemEvent;

  }
}

export interface PblNgridOnDataSourceEvent extends PblNgridEvent<'ds', 'onDataSource'> {
  prev: PblDataSource<any>;
  curr: PblDataSource<any>;
}

export interface PblNgridOnBeforeMoveItemEvent extends PblNgridEvent<'ds', 'onBeforeMoveItem'> {
  fromIndex: number;
  toIndex: number;
}
