import { PblNgridExtensionApi } from '../../ext/grid-ext-api';
import { PblNgridComponent } from '../ngrid.component';
import { CellContextState, PblNgridCellContext, PblNgridMetaCellContext, PblNgridRowContext } from './types';
import { PblColumn, PblMetaColumn } from '../column/model';
import { PblRowContext } from './row';

export class MetaCellContext<T = any, TCol extends PblMetaColumn | PblColumn = PblMetaColumn> implements PblNgridMetaCellContext<T, TCol> {
  col: TCol;
  grid: PblNgridComponent<any>;
  get $implicit(): MetaCellContext<T, TCol> { return this; }

  protected constructor() {}

  // workaround, we need a parameter-less constructor since @ngtools/webpack@8.0.4
  // Non @Injectable classes are now getting addded with hard reference to the ctor params which at the class creation point are undefined
  // forwardRef() will not help since it's not inject by angular, we instantiate the class..
  // probably due to https://github.com/angular/angular-cli/commit/639198499973e0f437f059b3c933c72c733d93d8
  static create<T = any, TCol extends PblMetaColumn | PblColumn = PblMetaColumn>(col: TCol, grid: PblNgridComponent<T>): MetaCellContext<T, TCol> {
    const instance = new MetaCellContext<T, TCol>();
    instance.col = col;
    instance.grid = grid;
    return instance;
  }

}

export class PblCellContext<T = any> implements PblNgridCellContext<T> {
  get $implicit(): PblCellContext<T> { return this; }
  get row(): T { return this.rowContext.$implicit; };
  get value(): any { return this.col.getValue(this.row); }
  set value(v: any) { this.col.setValue(this.row, v); }

  get rowContext(): PblNgridRowContext<T> { return this._rowContext; }
  get editing(): boolean { return this._editing; }
  get focused(): boolean { return this._focused; }
  get selected(): boolean { return this._selected; }

  readonly grid: PblNgridComponent<any>;
  readonly index: number;

  private _editing = false;
  private _focused = false;
  private _selected = false;

  private _rowContext: PblRowContext<T>;
  public col: PblColumn;
  private extApi: PblNgridExtensionApi<T>;

  protected constructor() { }

  // workaround, we need a parameter-less constructor since @ngtools/webpack@8.0.4
  // Non @Injectable classes are now getting addded with hard reference to the ctor params which at the class creation point are undefined
  // forwardRef() will not help since it's not inject by angular, we instantiate the class..
  // probably due to https://github.com/angular/angular-cli/commit/639198499973e0f437f059b3c933c72c733d93d8
  static create<T = any>(rowContext: PblRowContext<T>, col: PblColumn, extApi: PblNgridExtensionApi<T>): PblCellContext<T> {
    const instance = new PblCellContext<T>();

    instance._rowContext = rowContext;
    instance.col = col;
    instance.extApi = extApi;

    Object.defineProperties(instance, {
      grid: { value: extApi.grid },
      index: { value: extApi.grid.columnApi.indexOf(col) },
    });

    return instance;
  }

  static defaultState<T = any>(): CellContextState<T> {
    return { editing: false, focused: false, selected: false };
  }

  clone(col?: PblColumn): PblCellContext<T> {
    const ctx = PblCellContext.create<T>(this._rowContext, col || this.col, this.extApi);
    ctx.fromState(this.getState(), this._rowContext, true);
    return ctx;
  }

  getState(): CellContextState<T> {
    return {
      editing: this._editing,
      focused: this._focused,
      selected: this._selected,
    };
  }

  fromState(state: CellContextState<T>, rowContext: PblRowContext<T>, skipRowUpdate?: boolean): void {
    const requiresReset = !skipRowUpdate && this._editing === state.editing;

    this._rowContext = rowContext;
    this._editing = state.editing;
    this._focused = state.focused;
    this._selected = state.selected;

    if (requiresReset) {
      rowContext.updateCell(this);
    }
  }

  startEdit(markForCheck?: boolean): void {
    if (this.col.editorTpl && !this.editing) {
      this._editing = true;
      this._rowContext.updateCell(this);
      if (markForCheck) {
        this.grid.rowsApi.syncRows('data', true, this.rowContext.index);
      }
    }
  }

  stopEdit(markForCheck?: boolean): void {
    if (this.editing && !this.grid.viewport.isScrolling) {
      this._editing = false;
      this._rowContext.updateCell(this);
      if (markForCheck) {
        this.grid.rowsApi.syncRows('data', this.rowContext.index);
      }
    }
  }
}
