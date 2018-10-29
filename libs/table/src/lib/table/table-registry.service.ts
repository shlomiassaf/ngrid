import { Subject, Observable } from 'rxjs';
import {
  Injectable,
  Optional,
  SkipSelf,
  OnDestroy,
  Type
} from '@angular/core';

import {
  NegTableCellDefDirective,
  NegTableHeaderCellDefDirective,
  NegTableFooterCellDefDirective,
  NegTableNoDataRefDirective,
  NegTablePaginatorRefDirective
} from './directives';

import { NegColumn } from './columns/column';
import { KillOnDestroy } from './utils';

export interface RegistryChangedEvent {
  op: 'add' | 'remove';
  type: keyof NegTableMultiRegistryMap | keyof NegTableSingleRegistryMap;
  value: any;
}

export interface NegTableHeaderSortContainer {
  column: NegColumn;
}
/**
 * A map of valid single-item value that can be registered, and their type.
 */
export interface NegTableSingleRegistryMap {
  sortContainer?: Type<NegTableHeaderSortContainer>;
  noData?: NegTableNoDataRefDirective;
  paginator?: NegTablePaginatorRefDirective;
}

/**
 * A map of valid multi-item value that can be registered, and their type (the single type, i.e. T in Array<T>)
 */
export interface NegTableMultiRegistryMap {
  headerCell?: NegTableHeaderCellDefDirective<any>;
  tableCell?: NegTableCellDefDirective<any>;
  footerCell?: NegTableFooterCellDefDirective<any>;
}

/**
 * A Registry for templates of table parts.
 *
 * The registry is hierarchical, where each instance of a registry has a parent which allows cascading templates.
 * The hierarchy is manged by angular's DI.
 *
 * > The root registry does not have a parent.
 *
 * Each instance of a registry (including root) is a hierarchy by itself, composed of 2 internal levels.
 * The first level (L1 below) is used for fixed templates, the second level (L2 below) is used for dynamic tempaltes.
 *
 * - Root Registry
 *   - Child Registry
 *     - ChildOfChild Registry
 *
 * In the exapmle above there are 3 registries: Root, Child and ChildOfChild.
 *
 * When searching for a template in `ChildOfChild` it will search in the following order (top to bottom):
 *   - ChildOfChild
 *   - Child
 *   - Root
 *
 * If a registry does not contain the template the search will move to the next one.
 */
@Injectable()
@KillOnDestroy()
export class NegTableRegistryService implements OnDestroy {

  readonly changes: Observable<RegistryChangedEvent[]>;
  get parent(): NegTableRegistryService | undefined { return this._parent; }

  protected root: NegTableRegistryService & { bufferedData?: RegistryChangedEvent[] };

  protected _multi: { [K in keyof NegTableMultiRegistryMap]: Array<NegTableMultiRegistryMap[K]> } = {};
  protected _multiDefaults: NegTableMultiRegistryMap = {};
  protected _singles: NegTableSingleRegistryMap = {};

  protected readonly changes$: Subject<RegistryChangedEvent[]>;

  constructor(@Optional() @SkipSelf() private _parent?: NegTableRegistryService) {
    this.changes$ = new Subject();
    this.changes = this.changes$.asObservable();
    if (this._parent) {
      this._parent.changes.pipe(KillOnDestroy(this)).subscribe(this.changes$);
      this.root = this._parent.root;
    } else {
      this.root = this;
    }
  }

  getRoot(): NegTableRegistryService { return this.root; }

  /**
   * Returns the registered value for the single `kind`.
   * If not found will try to search the parent.
   */
  getSingle<P extends keyof NegTableSingleRegistryMap>(kind: P): NegTableSingleRegistryMap[P] | undefined {
    return this._singles[kind] || (this._parent && this._parent.getSingle(kind));
  }

  setSingle<P extends keyof NegTableSingleRegistryMap>(kind: P, value: NegTableSingleRegistryMap[P] | undefined): void {
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
  getMultiDefault<P extends keyof NegTableMultiRegistryMap>(kind: P): NegTableMultiRegistryMap[P] | undefined {
    return this._multiDefaults[kind] || (this._parent && this._parent.getMultiDefault(kind));
  }

  setMultiDefault<P extends keyof NegTableMultiRegistryMap>(kind: P, value: NegTableMultiRegistryMap[P] | undefined): void {
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
  getMulti<T extends keyof NegTableMultiRegistryMap>(kind: T): Array<NegTableMultiRegistryMap[T]> | undefined {
    return this._multi[kind];
  }

  addMulti<T extends keyof NegTableMultiRegistryMap>(kind: T, cellDef: NegTableMultiRegistryMap[T]): void {
    const multi = this.getMulti(kind) || (this._multi[kind] = []);
    multi.push(cellDef);
    if (cellDef.name === '*') {
      this.setMultiDefault(kind, cellDef);
    }
    this.emitChanges({ op: 'add', type: kind, value: cellDef })
  }

  removeMulti<T extends keyof NegTableMultiRegistryMap>(kind: T, cellDef: NegTableMultiRegistryMap[T]): void {
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
