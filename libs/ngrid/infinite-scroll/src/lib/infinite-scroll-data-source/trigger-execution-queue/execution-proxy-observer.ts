import { Observable, Subscriber, Subscription, Subject } from 'rxjs';
import { PblInfiniteScrollTriggerChangedEvent } from '../infinite-scroll-datasource.types';

// const LOG = msg => console.log(msg);

/**
 * A wrapper around an on trigger observable call that will prevent it from
 * closing if marked to do so (calling `keepAlive()`).
 * If `keepAlive()` was called and the observable has been unsubscribed the teardown logic
 * will not unsubscribe from the underlying on-trigger observable, it will let it roll until
 * finished or being killed again.
 * Keep alive is a toggle, if "used" it can not be used again unless `keepAlive()` is called again.
 *
 * This observable is used internally by the execution queue to prevent on-trigger calls from being invoked and
 * cancelled multiple times.
 * This usually happen when scrolling, since the scroll might not break the current page block fetched, until fetched
 * it will keep asking for it, hence the need to keep it alive.
 * Each execution must return an observable or it will get canceled, so we return the currently executed trigger
 * instead of running it again...
 * @private
 */
export class TriggerExecutionProxyObservable<T> extends Observable<T> {
  readonly onKilled = new Subject<void>();

  private canLive: boolean = false;
  private baseSubscription: Subscription;
  private subscriber: Subscriber<T>;
  private error?: any;
  private completed?: boolean;

  constructor(private readonly event: PblInfiniteScrollTriggerChangedEvent,
              private readonly target: Observable<T>) {
    super(subscriber => this.onSubscribe(subscriber));
    // LOG(`NEW[${event.id}]: ${event.fromRow} - ${event.toRow}`);
  }

  keepAlive() {
    this.canLive = true;
  }

  private onSubscribe(subscriber: Subscriber<T>) {
    this.subscriber = subscriber;

    if (!this.baseSubscription) {
      this.baseSubscription = this.target.subscribe({
        next: v => this.subscriber.next(v),
        error: e => {
          this.error = e;
          this.subscriber.error(e);
        },
        complete: () => {
          this.completed = true;
          this.subscriber.complete();
        },
      });
    }

    return () => this.tearDown();
  }

  private tearDown() {
    if (!this.canLive || this.completed || this.error) {
      // LOG(`UNSUBSCRIBE${this.event.id}: ${this.event.fromRow} - ${this.event.toRow}`);
      this.baseSubscription.unsubscribe();
      this.onKilled.next();
      this.onKilled.complete();
    } else {
      // LOG(`REMOVE CREDIT${this.event.id}: ${this.event.fromRow} - ${this.event.toRow}`);
      this.canLive = false;
    }
  }
}
