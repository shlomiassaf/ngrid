import { PblNgridEvents } from './ngrid-events';

export interface PblNgridEventEmitter {
  emitEvent(event: PblNgridEvents): void;
}
