import { from, isObservable, Observable, of, Subscriber, Subscription, Subject } from 'rxjs';
import { PblDataSourceTriggerChangeHandler } from '@pebula/ngrid';
import { PblInfiniteScrollTriggerChangedEvent } from './infinite-scroll-datasource.types';

const LOG = msg => console.log(msg);

class TriggerExecutionProxyObservable<T> extends Observable<T> {
  readonly onKilled = new Subject<void>();

  private canLive: boolean = false;
  private baseSubscription: Subscription;
  private subscriber: Subscriber<T>;
  private error?: any;
  private completed?: boolean;

  constructor(private readonly event: PblInfiniteScrollTriggerChangedEvent,
              private readonly target: Observable<T>) {
    super(subscriber => this.onSubscribe(subscriber));
    LOG(`NEW[${event.id}]: ${event.fromRow} - ${event.toRow}`);
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
      LOG(`UNSUBSCRIBE${this.event.id}: ${this.event.fromRow} - ${this.event.toRow}`);
      this.baseSubscription.unsubscribe();
      this.onKilled.next();
      this.onKilled.complete();
    } else {
      LOG(`REMOVE CREDIT${this.event.id}: ${this.event.fromRow} - ${this.event.toRow}`);
      this.canLive = false;
    }
  }
}

export class TriggerExecutionQueue<T, TData = any> {

  public slots = 2;

  private runningEvents = new Map<PblInfiniteScrollTriggerChangedEvent<TData>, TriggerExecutionProxyObservable<T[]>>();

  constructor(private readonly handler: PblDataSourceTriggerChangeHandler<T, PblInfiniteScrollTriggerChangedEvent<TData>>) {

  }

  execute(event: PblInfiniteScrollTriggerChangedEvent<TData>, fallbackToOverlap = false): false | Observable<T[]> {
    const overlap = this.checkOverlap(event);
    if (!!overlap) {
      if (fallbackToOverlap) {
        overlap.keepAlive();
        return overlap;
      }
      return false;
    }

    LOG(`EXECUTING HANDLER: ${event.fromRow} - ${event.toRow}`);
    const result = this.handler(event);
    if (result === false) {
      return false;
    }


    const triggerResult = Array.isArray(result)
      ? of(result)
      : isObservable(result)
        ? result
        : from(result)
    ;

    LOG(`CREATE[${event.id}]: ${event.fromRow} - ${event.toRow}`);
    const obs = new TriggerExecutionProxyObservable<T[]>(event, triggerResult);
    obs.onKilled.subscribe(() => this.runningEvents.delete(event));

    this.runningEvents.set(event, obs);

    return obs;
  }

  public checkOverlap(event: PblInfiniteScrollTriggerChangedEvent<TData>) {
    for (const [e, v] of this.runningEvents.entries()) {
      if (event.fromRow >= e.fromRow && event.toRow <= e.toRow) {
        LOG(`OVERLAPPED: ${event.fromRow} - ${event.toRow}`);
        return v;
      }
    }
  }
}
