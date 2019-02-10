import { Subject, Observable } from 'rxjs';
import {
  Injectable,
  Optional,
  SkipSelf,
  OnDestroy,
} from '@angular/core';

import { UnRx } from '@pebula/utils';

import {
  PblTableCellDefDirective,
  PblTableEditorCellDefDirective,
  PblTableHeaderCellDefDirective,
  PblTableFooterCellDefDirective,

  PblTableMultiTemplateRegistry,
  PblTableMultiComponentRegistry,
  PblTableDataHeaderExtensionContext,
  PblTableDataHeaderExtensionRef,

  PblTableNoDataRefDirective,
  PblTablePaginatorRefDirective,
} from '../directives';

export interface RegistryChangedEvent {
  op: 'add' | 'remove';
  type: keyof PblTableMultiRegistryMap | keyof PblTableSingleRegistryMap;
  value: any;
}

/**
 * A map of valid single-item value that can be registered, and their type.
 */
export interface PblTableSingleRegistryMap {
  noData?: PblTableNoDataRefDirective;
  paginator?: PblTablePaginatorRefDirective;
}

/**
 * A map of valid multi-item value that can be registered, and their type (the single type, i.e. T in Array<T>)
 */
export interface PblTableMultiRegistryMap {
  headerCell?: PblTableHeaderCellDefDirective<any>;
  tableCell?: PblTableCellDefDirective<any>;
  editorCell?: PblTableEditorCellDefDirective<any>;
  footerCell?: PblTableFooterCellDefDirective<any>;
  dataHeaderExtensions?:
    (PblTableMultiTemplateRegistry<PblTableDataHeaderExtensionContext, 'dataHeaderExtensions'> & PblTableDataHeaderExtensionRef)
    | (PblTableMultiComponentRegistry<any, 'dataHeaderExtensions'> & PblTableDataHeaderExtensionRef);
}

/**
 * A Registry for templates of table parts.
 *
 * The registry is hierarchical, where each instance of a registry has a parent which allows cascading templates.
 * The hierarchy is manged by angular DI.
 *
 * > The root registry does not have a parent.
 *
 * Each instance of a registry (including root) is a hierarchy by itself, composed of 2 internal levels.
 * The first level (L1 below) is used for fixed templates, the second level (L2 below) is used for dynamic templates.
 *
 * - Root Registry
 *   - Child Registry
 *     - ChildOfChild Registry
 *
 * In the example above there are 3 registries: Root, Child and ChildOfChild.
 *
 * When searching for a template in `ChildOfChild` it will search in the following order (top to bottom):
 *   - ChildOfChild
 *   - Child
 *   - Root
 *
 * If a registry does not contain the template the search will move to the next one.
 */
@Injectable({ providedIn: 'root' })
@UnRx()
export class PblTableRegistryService implements OnDestroy {

  readonly changes: Observable<RegistryChangedEvent[]>;
  get parent(): PblTableRegistryService | undefined { return this._parent; }

  protected root: PblTableRegistryService & { bufferedData?: RegistryChangedEvent[] };

  protected _multi: { [K in keyof PblTableMultiRegistryMap]: Array<PblTableMultiRegistryMap[K]> } = {};
  protected _multiDefaults: PblTableMultiRegistryMap = {};
  protected _singles: PblTableSingleRegistryMap = {};

  protected readonly changes$: Subject<RegistryChangedEvent[]>;

  constructor(@Optional() @SkipSelf() private _parent?: PblTableRegistryService) {
    this.changes$ = new Subject();
    this.changes = this.changes$.asObservable();
    if (this._parent) {
      this._parent.changes.pipe(UnRx(this)).subscribe(this.changes$);
      this.root = this._parent.root;
    } else {
      this.root = this;
    }
  }

  getRoot(): PblTableRegistryService { return this.root; }

  /**
   * Returns the registered value for the single `kind`.
   * If not found will try to search the parent.
   */
  getSingle<P extends keyof PblTableSingleRegistryMap>(kind: P): PblTableSingleRegistryMap[P] | undefined {
    return this._singles[kind] || (this._parent && this._parent.getSingle(kind));
  }

  setSingle<P extends keyof PblTableSingleRegistryMap>(kind: P, value: PblTableSingleRegistryMap[P] | undefined): void {
    const previous = this.getSingle(kind);
    if (value !== previous) {
      this._singles[kind] = value;
      this.emitChanges({ op: value ? 'add' : 'remove', type: kind, value });
    }
  }

  /**
   * Returns the registered default value for the multi `kind`.
   * If not found will try to search the parent.
   */
  getMultiDefault<P extends keyof PblTableMultiRegistryMap>(kind: P): PblTableMultiRegistryMap[P] | undefined {
    return this._multiDefaults[kind] || (this._parent && this._parent.getMultiDefault(kind));
  }

  setMultiDefault<P extends keyof PblTableMultiRegistryMap>(kind: P, value: PblTableMultiRegistryMap[P] | undefined): void {
    const previous = this.getMultiDefault(kind);
    if (value !== previous) {
      this._multiDefaults[kind] = value;
      this.emitChanges({ op: value ? 'add' : 'remove', type: kind, value });
    }
  }

  /**
   * Returns the registered values for the multi `kind`.
   * If not found WILL NOT search the parent.
   */
  getMulti<T extends keyof PblTableMultiRegistryMap>(kind: T): Array<PblTableMultiRegistryMap[T]> | undefined {
    return this._multi[kind]
  }

  addMulti<T extends keyof PblTableMultiRegistryMap>(kind: T, cellDef: PblTableMultiRegistryMap[T]): void {
    const multi = this.getMulti(kind) || (this._multi[kind] = []);
    multi.push(cellDef);
    if (cellDef.name === '*') {
      this.setMultiDefault(kind, cellDef);
    }
    this.emitChanges({ op: 'add', type: kind, value: cellDef })
  }

  removeMulti<T extends keyof PblTableMultiRegistryMap>(kind: T, cellDef: PblTableMultiRegistryMap[T]): void {
    const multi = this.getMulti(kind);
    if (multi) {
      const idx = multi.indexOf(cellDef);
      if (idx > -1) {
        multi.splice(idx, 1);
      }
      this.emitChanges({ op: 'remove', type: kind, value: cellDef })
    }
  }

  ngOnDestroy(): void {
    this.changes$.complete();
  }

  /**
   * Delay all notifications sent through `changes` and buffer then until next call to `bufferEnd()`.
   * When `bufferEnd()` is called it will flush all changes.
   *
   * > It's important to note that buffering does not freeze the registry, adding and removing templates will change the
   * registry and will effect queries. Buffering block the `changes` event stream and nothing more.
   */
  bufferStart(): void {
    if (!this.root.bufferedData) {
      this.root.bufferedData = [];
    }
  }

  bufferEnd(): void {
    if (this.root.bufferedData) {
      const data = this.root.bufferedData;
      this.root.bufferedData = undefined;
      this.emitChanges(data);
    }
  }

  private emitChanges(events: RegistryChangedEvent | RegistryChangedEvent[]): void {
    const e = Array.isArray(events) ? events : [events];
    if (this.root.bufferedData) {
      this.root.bufferedData.push(...e)
    } else {
      this.changes$.next(e);
    }
  }
}
