import { Subject, Observable } from 'rxjs';
import {
  Injectable,
  Optional,
  SkipSelf,
  OnDestroy,
} from '@angular/core';

import { UnRx } from '@pebula/utils';

import {
  PblNgridCellDefDirective,
  PblNgridEditorCellDefDirective,
  PblNgridHeaderCellDefDirective,
  PblNgridFooterCellDefDirective,

  PblNgridMultiTemplateRegistry,
  PblNgridMultiComponentRegistry,
  PblNgridDataHeaderExtensionContext,
  PblNgridDataHeaderExtensionRef,

  PblNgridNoDataRefDirective,
  PblNgridPaginatorRefDirective,
} from '../directives';

export interface RegistryChangedEvent {
  op: 'add' | 'remove';
  type: keyof PblNgridMultiRegistryMap | keyof PblNgridSingleRegistryMap;
  value: any;
}

/**
 * A map of valid single-item value that can be registered, and their type.
 */
export interface PblNgridSingleRegistryMap {
  noData?: PblNgridNoDataRefDirective;
  paginator?: PblNgridPaginatorRefDirective;
}

/**
 * A map of valid multi-item value that can be registered, and their type (the single type, i.e. T in Array<T>)
 */
export interface PblNgridMultiRegistryMap {
  headerCell?: PblNgridHeaderCellDefDirective<any>;
  tableCell?: PblNgridCellDefDirective<any>;
  editorCell?: PblNgridEditorCellDefDirective<any>;
  footerCell?: PblNgridFooterCellDefDirective<any>;
  dataHeaderExtensions?:
    (PblNgridMultiTemplateRegistry<PblNgridDataHeaderExtensionContext, 'dataHeaderExtensions'> & PblNgridDataHeaderExtensionRef)
    | (PblNgridMultiComponentRegistry<any, 'dataHeaderExtensions'> & PblNgridDataHeaderExtensionRef);
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
export class PblNgridRegistryService implements OnDestroy {

  readonly changes: Observable<RegistryChangedEvent[]>;
  get parent(): PblNgridRegistryService | undefined { return this._parent; }

  protected root: PblNgridRegistryService & { bufferedData?: RegistryChangedEvent[] };

  protected _multi: { [K in keyof PblNgridMultiRegistryMap]: Array<PblNgridMultiRegistryMap[K]> } = {};
  protected _multiDefaults: PblNgridMultiRegistryMap = {};
  protected _singles: PblNgridSingleRegistryMap = {};

  protected readonly changes$: Subject<RegistryChangedEvent[]>;

  constructor(@Optional() @SkipSelf() private _parent?: PblNgridRegistryService) {
    this.changes$ = new Subject();
    this.changes = this.changes$.asObservable();
    if (this._parent) {
      this._parent.changes.pipe(UnRx(this)).subscribe(this.changes$);
      this.root = this._parent.root;
    } else {
      this.root = this;
    }
  }

  getRoot(): PblNgridRegistryService { return this.root; }

  /**
   * Returns the registered value for the single `kind`.
   * If not found will try to search the parent.
   */
  getSingle<P extends keyof PblNgridSingleRegistryMap>(kind: P): PblNgridSingleRegistryMap[P] | undefined {
    return this._singles[kind] || (this._parent && this._parent.getSingle(kind));
  }

  setSingle<P extends keyof PblNgridSingleRegistryMap>(kind: P, value: PblNgridSingleRegistryMap[P] | undefined): void {
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
  getMultiDefault<P extends keyof PblNgridMultiRegistryMap>(kind: P): PblNgridMultiRegistryMap[P] | undefined {
    return this._multiDefaults[kind] || (this._parent && this._parent.getMultiDefault(kind));
  }

  setMultiDefault<P extends keyof PblNgridMultiRegistryMap>(kind: P, value: PblNgridMultiRegistryMap[P] | undefined): void {
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
  getMulti<T extends keyof PblNgridMultiRegistryMap>(kind: T): Array<PblNgridMultiRegistryMap[T]> | undefined {
    return this._multi[kind]
  }

  addMulti<T extends keyof PblNgridMultiRegistryMap>(kind: T, cellDef: PblNgridMultiRegistryMap[T]): void {
    const multi = this.getMulti(kind) || (this._multi[kind] = []);
    multi.push(cellDef);
    if (cellDef.name === '*') {
      this.setMultiDefault(kind, cellDef);
    }
    this.emitChanges({ op: 'add', type: kind, value: cellDef })
  }

  removeMulti<T extends keyof PblNgridMultiRegistryMap>(kind: T, cellDef: PblNgridMultiRegistryMap[T]): void {
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
