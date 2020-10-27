import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PblInfiniteScrollTriggerChangedEvent } from './infinite-scroll-datasource.types';

/**
 * @private
 */
export class EventState<T> {
  private done: boolean;
  private notFull: boolean;

  constructor(public readonly event: PblInfiniteScrollTriggerChangedEvent = null) { }


  isDone() {
    return this.done;
  }

  rangeEquals(event: PblInfiniteScrollTriggerChangedEvent) {
    return event.fromRow === this.event.fromRow && event.toRow === this.event.toRow;
  }

  /**
   * When true is returned, the handling of `PblDataSource.onRenderedDataChanged` should be skipped.
   * Usually, the event state will keep track of the returned value and check if the length of items returned covers
   * the total length required by the event. Only when not enough items have been returned, the returned value will be true.
   * Once true is returned, it will toggle back to false, i.e. it will tell you to skip once only.
   */
  skipNextRender() {
    if (this.notFull) {
      this.notFull = false;
      return true;
    }
    return false;
  }

  pipe() {
    return (o: Observable<T[]>) => {
      return o.pipe(
        tap( values => {
          this.done = true;
          this.notFull = values.length < this.event.offset;
        }),
      );
    }
  }
}
