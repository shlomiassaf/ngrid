import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { NegColumnDefinition } from '../columns/types';
import { NegColumn } from '../columns/column';
import { NegMetaColumnStore } from '../columns/column-store';
import { StaticColumnWidthLogic } from '../col-width-logic/static-column-width';

/**
 * Normalize an NegColumnDefinition id
 */
export function normalizeId(value: string): string {
  return value.replace(/ /g, '_');
}

/**
 * Given an object (item) and a path, returns the value at the path
 */
export function deepPathGet(item: any, col: NegColumnDefinition): any {
  if ( col.path ) {
    for ( const p of col.path ) {
      item = item[ p ];
      if ( !item ) return;
    }
  }
  return item[ col.prop ];
}

/**
 * Given an object (item) and a path, returns the value at the path
 */
export function deepPathSet(item: any, col: NegColumnDefinition, value: any): void {
  if ( col.path ) {
    for ( const p of col.path ) {
      item = item[ p ];
      if ( !item ) return;
    }
  }
  item[ col.prop ] = value;
}

export function updateColumnWidths(rowWidth: StaticColumnWidthLogic, tableColumns: NegColumn[], metaColumns: NegMetaColumnStore[]): void {
  const { pct, px } = rowWidth.defaultColumnWidth;
  for (const c of tableColumns) {
    let width;
    if (c.width) {
      width = c.width;
    } else {
      width =`calc(${pct}% - ${px}px)`
    }
    c.cWidth = width;
    c.cMinWidth = c.minWidth ? `${c.minWidth}px` : '';
    c.cMaxWidth = c.maxWidth ? `${c.maxWidth}px` : c.cWidth;
  }

  for (const m of metaColumns) {
    for (const c of [m.header, m.footer]) {
      if (c) {
        c.cWidth = c.width || '';
        c.cMinWidth = c.minWidth ? `${c.minWidth}px` : '';
        c.cMaxWidth = c.maxWidth ? `${c.maxWidth}px` : c.cWidth;
      }
    }

    // We don't handle groups because they are handled by `NegTableComponent.resizeRows()`
    // which set the width for each.
  }
}

//#region untilComponentDestroyed
/**
 * Emits the values emitted by the source Observable until a the angular component instance is destroyed. (`ngOnDestory` is called).
 * If the component already implements `ngOnDestroy` it will wrap it.
 *
 * You can also destroy on-demand by providing a handler and use `KillOnDestroy.kill` to unsubscribe.
 * Note that using the same handler id for multiple subscriptions will kill all of them together, i.e. the handler is also a group.
 *
 * > WARNING: Do not apply operators that subscribe internally (e.g. combineLatest, switchMap) after the `killOnDestroy` operator.
 * Internal subscriptions will not unsubscribe automatically. For more information see https://blog.angularindepth.com/rxjs-avoiding-takeuntil-leaks-fb5182d047ef
 */
export function KillOnDestroy<T>(component: any, handler?: any): (source: Observable<T>) => Observable<T>;
/**
 * A Decorator that add support for automatic unsubscription on angular components.
 * Based on work from:
 *   - https://github.com/w11k/ng2-rx-componentdestroyed/blob/master/src/index.ts
 *   - https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription/41177163#41177163
 */
export function KillOnDestroy<T = any>(): ClassDecorator;
export function KillOnDestroy<T>(component?: any, handler?: any): ClassDecorator | ( (source: Observable<T>) => Observable<T> ) {
  if (component) {
    return KillOnDestroy.killOnDestroy<T>(component, handler);
  } else {
    return KillOnDestroy.monkyPatchOnDestroy;
  }
}
export namespace KillOnDestroy {
  const ALL_HANDLERS_TOKEN = {};
  const originalOnDestoryFunctionStore = new Map<any, () => void>();
  const notifierStore = new WeakMap<any, Subject<any>>();

  function getNotifier(component: any, create = false): Subject<any> | undefined {
    let notifier = notifierStore.get(component);
    if (!notifier && create === true) {
      notifierStore.set(component, notifier = new Subject<any>());
    }
    return notifier;
  }

  function ngOnDestroy(): void {
    const oldNgOnDestroy = originalOnDestoryFunctionStore.get(this.constructor);
    if (oldNgOnDestroy) {
      oldNgOnDestroy.apply(this);
    }
    killAll(this);
  }

  function killAll(obj: any): void {
    const notifier = getNotifier(obj);
    if (notifier) {
      notifier.next(ALL_HANDLERS_TOKEN);
      notifier.complete();
      notifierStore.delete(obj);
    }
  }

  export function monkyPatchOnDestroy(target: any): any {
    const proto = target.prototype;
    if (proto.ngOnDestroy) {
      originalOnDestoryFunctionStore.set(target, proto.ngOnDestroy);
    }
    proto.ngOnDestroy = ngOnDestroy;
    return target;
  }

  export function killOnDestroy<T>(component: any, handler?: any): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => source.pipe(
      takeUntil(getNotifier(component, true).pipe(filter( h => h === ALL_HANDLERS_TOKEN || (handler && h === handler ) )))
    );
  }

   /**
   * Immediately unsubscribe from all subscriptions registered through `killOnDestroy`.
   */
  export function kill(component: any): void;
    /**
   * Immediately unsubscribe from all subscriptions registered through `killOnDestroy` that are flagged with the provided handler/s
   */
  export function kill(component: any, ...handlers: any[]): void;
  export function kill(component: any, ...handlers: any[]): void {
    if (handlers.length === 0) {
      killAll(component);
    } else {
      const notifier = getNotifier(component);
      if (notifier) {
        for (const h of handlers) {
          notifier.next(h);
        }
      }
    }
  }
}
//#endregion untilComponentDestroyed
