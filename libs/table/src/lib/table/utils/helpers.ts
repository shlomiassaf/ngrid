import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { SgColumnDefinition } from '../columns/types';
import { SgColumnStore } from '../columns/column-store';
import { SgColumn } from '../columns/column';
import { SgMetaColumn } from '../columns/meta-column';
import { SgColumnGroup } from '../columns/group-column';

/**
 * Normalize an SgColumnDefinition id
 */
export function normalizeId(value: string): string {
  return value.replace(/ /g, '_');
}

/**
 * Given an object (item) and a path, returns the value at the path
 */
export function deepPathGet(item: any, col: SgColumnDefinition): any {
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
export function deepPathSet(item: any, col: SgColumnDefinition, value: any): void {
  if ( col.path ) {
    for ( const p of col.path ) {
      item = item[ p ];
      if ( !item ) return;
    }
  }
  item[ col.prop ] = value;
}

/**
 * Returns table metadata for a given element.
 * The element can be a table cell element (any type of) OR a nested element (any level) of a table cell element.
 *
 * This function works under the following assumptions:
 *
 *   - The immediate child of a table row element is a table cell element.
 *   - Each row element MUST contains the type identifier attribute "data-rowtype" (except "data" rows)
 *   - Allowed values for "data-rowtype" are: 'header' | 'meta-header' | 'footer' | 'meta-footer' | 'data'
 *   - Row's representing data items (data-rowtype="data") can omit the type attribute and the function will infer it.
 *
 */
export function metadataFromElement(element: Element, store: SgColumnStore): [ 'meta-header', SgMetaColumn | SgColumnGroup ] | [ 'meta-footer' , SgMetaColumn ] | ['header' | 'footer', SgColumn] | ['data', SgColumn, number] | undefined  {
  while (element.parentElement) {
    if (element.parentElement.getAttribute('role') === 'row') {
      let row: Element = element.parentElement;
      const rowType: 'header' | 'meta-header' | 'footer' | 'meta-footer' | 'data' = row.getAttribute('data-rowtype') as any || 'data';

      let colIndex = 0;
      while (element = element.previousElementSibling) {
        colIndex++;
      }

      let rowIndex = 0;
      switch (rowType) {
        case 'data':
          const tagName = row.tagName;
          while (row.previousElementSibling) {
            rowIndex++;
            row = row.previousElementSibling;
          }
          while (tagName !== row.tagName) {
            rowIndex--;
            row = row.nextElementSibling;
          }
          return [rowType, store.find(store.tableRow[colIndex]).data, rowIndex];
        case 'header':
        case 'footer':
          return [rowType, store.find(store.tableRow[colIndex]).data];
        default:
          while (row.previousElementSibling && row.previousElementSibling.getAttribute('data-rowtype') === rowType) {
            rowIndex++;
            row = row.previousElementSibling;
          }
          if (rowType === 'meta-footer') {
            return [ rowType, store.find(store.metaRows.footer[rowIndex].keys[colIndex]).footer ];
          } else {
            const rowInfo = store.metaRows.header[rowIndex];
            const record = store.find(rowInfo.keys[colIndex]);
            return [ rowType, rowInfo.isGroup ? record.headerGroup : record.header ];
          }
      }
    }
    element = element.parentElement;
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
