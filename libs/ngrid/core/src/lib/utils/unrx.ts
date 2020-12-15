import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

/**
 * Emits the values emitted by the source observable until a kill signal is sent to the group.
 * You can also specify a `subKillGroup` which can be used to kill specific subscriptions within a group.
 *
 * When a `killGroup` is "killed" all `subKillGroup` are killed as well. When a `subKillGroup` is "killed" the group remains
 * as well as other "subKillGroup" registered for that group.
 *
 * > WARNING: Do not apply operators that subscribe internally (e.g. combineLatest, switchMap) after the `killOnDestroy` operator.
 * Internal subscriptions will not unsubscribe automatically.
 * For more information see {@link https://blog.angularindepth.com/rxjs-avoiding-takeuntil-leaks-fb5182d047ef | this blog post}
 */
export function unrx<T>(killGroup: any, subKillGroup?: any): (source: Observable<T>) => Observable<T> {
  return unrx.pipe<T>(killGroup, subKillGroup);
}

export namespace unrx {
  const ALL_HANDLERS_TOKEN = {};
  const notifierStore = new WeakMap<any, Subject<any>>();

  function getNotifier(component: any, create = false): Subject<any> | undefined {
    let notifier = notifierStore.get(component);
    if (!notifier && create === true) {
      notifierStore.set(component, notifier = new Subject<any>());
    }
    return notifier;
  }

  /**
   * Send a "kill" signal to the specified `killGroup`.
   * This will immediately unsubscribe all subscriptions with the `unrx` pipe registered under the specified `killGroup`.
   *
   * Note that the entire `killGroup` is destroyed.
   */
  export function kill(killGroup: any): void;
  /**
   * Send a "kill" signal to a specific `subKillGroup` in the specified `killGroup`.
   * This will immediately unsubscribe all subscriptions with the `unrx` pipe registered under the specified `killGroup` and `subKillGroup`.
   *
   */
  export function kill(killGroup: any, ...subKillGroup: any[]): void;
  export function kill(killGroup: any, ...subKillGroup: any[]): void {
    if (subKillGroup.length === 0) {
      killAll(killGroup);
    } else {
      const notifier = getNotifier(killGroup);
      if (notifier) {
        for (const h of subKillGroup) {
          notifier.next(h);
        }
      }
    }
  }

  /** {@inheritdoc unrx} */
  export function pipe<T>(killGroup: any, subKillGroup?: any): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => source.pipe(
      takeUntil(getNotifier(killGroup, true).pipe(filter( h => h === ALL_HANDLERS_TOKEN || (subKillGroup && h === subKillGroup ) )))
    );
  }

  function killAll(obj: any): void {
    const notifier = getNotifier(obj);
    if (notifier) {
      notifier.next(ALL_HANDLERS_TOKEN);
      notifier.complete();
      notifierStore.delete(obj);
    }
  }
}
