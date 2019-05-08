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

/**
 * Emits the values emitted by the source Observable until the angular component instance is destroyed. (`ngOnDestroy` is called).
 * If the component already implements `ngOnDestroy` it will wrap it.
 *
 * You can also destroy on-demand by providing a handler and use `UnRx.kill` to unsubscribe.
 * Note that using the same handler id for multiple subscriptions will kill all of them together, i.e. the handler is also a group.
 *
 * > WARNING: Do not apply operators that subscribe internally (e.g. combineLatest, switchMap) after the `killOnDestroy` operator.
 * Internal subscriptions will not unsubscribe automatically. For more information see https://blog.angularindepth.com/rxjs-avoiding-takeuntil-leaks-fb5182d047ef
 */
export function UnRx<T>(component: any, handler?: any): (source: Observable<T>) => Observable<T>;
/**
 * A Decorator that add support for automatic unsubscription in angular components.
 *
 * When applied on a component, `UnRx` will wrap the `ngOnDestroy` life-cycle` hook (or create if doesn't exist) and automatically
 * destroy all open subscriptions that contain the `UnRx` pipe in their emission stream.
 *
 * @remarks
 *
 * The following example demonstrate a component using the HTTP client to call a server.
 * We add the `UnRx` pipe to the response observable (`pipe(UnRx(this))`) so when the component is destroyed the subscription is closed as well.
 *
 * This might seem redundant because the `HttpClient` will automatically close the subscription after the response but what happen when
 * the response arrived AFTER the component is destroyed (user left the page)?
 *
 * In this case the subscription will emit the response and the handler will run, we don't want that!
 *
 * By applying the pipe we ensure that nothing will run once the component is destroyed.
 *
 * The BIG BONUS here is http cancellation, once destroyed `UnRx` will close the subscription which will cancel the HTTP request!
 * ```ts
 * import { Component } from '@angular/core';
 * import { HttpClient } from '@angular/common/http';
 *
 * @Component({
 *  selector: 'my-cmp',
 *  template: ``
 * })
 * @UnRx() // Will un-subscribe all open subscriptions when component is destroyed
 * export class MyComponent {
 *   static URL = '/some-endpoint';
 *
 *   constructor(private http: HttpClient) { }
 *
 *   getData() {
 *     this.http.get(MyComponent.URL)
 *       .pipe(UnRx(this))             // Register the stream for auto-kill on destroy
 *       .subscribe( response => {
 *         console.log(response);
 *       });
 *   }
 * }
 * ```
 *
 * The following example is an improved version of the previous one.
 * All pending request will be cancelled when the component is destroyed but we will also cancel all pending requests
 * when a new request is fired.
 *
 * With this we ensure state and flow integrity (no race condition between 2 requests).
 * We also make sure that resources are not wasted (multiple redundant requests.)
 * ```ts
 * import { Component } from '@angular/core';
 * import { HttpClient } from '@angular/common/http';
 *
 * @Component({
 *  selector: 'my-cmp',
 *  template: ``
 * })
 * @UnRx() // Will un-subscribe all open subscriptions when component is destroyed
 * export class MyComponent {
 *   static URL = '/some-endpoint';
 *
 *   constructor(private http: HttpClient) { }
 *
 *   getData() {
 *     UnRx.kill(this, MyComponent.URL); // Kill (cancel) pending HTTP requests
 *     this.http.get(MyComponent.URL)
 *       .pipe(UnRx(this, MyComponent.URL)) // Register the stream for auto-kill on destroy and add a handler for ad-hoc unsubscribe
 *       .subscribe( response => {
 *         console.log(response);
 *       });
 *   }
 * }
 * ```
 *
 * @internalremarks
 * Based on work from:
 *   - https://github.com/w11k/ng2-rx-componentdestroyed/blob/master/src/index.ts
 *   - https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription/41177163#41177163
 */
export function UnRx<T = any>(): ClassDecorator;
export function UnRx<T>(component?: any, handler?: any): ClassDecorator | ( (source: Observable<T>) => Observable<T> ) {
  return component
    ? unrx<T>(component, handler)
    : UnRx.decorateComponent
  ;
}

export namespace UnRx {
  const originalOnDestroyFunctionStore = new Map<any, () => void>();

  function ngOnDestroy(): void {
    const oldNgOnDestroy = originalOnDestroyFunctionStore.get(this.constructor);
    if (oldNgOnDestroy) {
      oldNgOnDestroy.apply(this);
    }
    unrx.kill(this);
  }

  export function decorateComponent(target: any): any {
    const proto = target.prototype;
    if (proto.ngOnDestroy) {
      originalOnDestroyFunctionStore.set(target, proto.ngOnDestroy);
    }
    proto.ngOnDestroy = ngOnDestroy;
    return target;
  }

  /**
   * Send a "kill" signal to the specified `component` instance.
   * This will immediately unsubscribe all subscriptions with the `UnRx` pipe registered under the specified component instance.
   */
  export function kill(killGroup: any): void;
  /**
   * Send a "kill" signal to a specific `token` in the specified `component` instance.
   * This will immediately unsubscribe all subscriptions with the `UnRx` pipe registered under the specified `component` instance and `token`.
   *
   */
  export function kill(component: any, ...tokens: any[]): void;
  export function kill(component: any, ...tokens: any[]): void {
    unrx.kill(component, ...tokens);
  }

}
