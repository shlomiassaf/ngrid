import { PblNgridExtensionApi } from '../../ext/table-ext-api';
import { PblNgridComponent } from '../table.component';
import { CellContextState, PblNgridCellContext, PblNgridMetaCellContext, PblNgridRowContext } from './types';
import { PblColumn } from '../columns/column';
import { PblMetaColumn } from '../columns/meta-column';
import { PblRowContext } from './row';

export class MetaCellContext<T = any, TCol extends PblMetaColumn | PblColumn = PblMetaColumn> implements PblNgridMetaCellContext<T, TCol> {
  get $implicit(): MetaCellContext<T, TCol> { return this; }
  constructor(public col: TCol, public table: PblNgridComponent<any>) {}
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

  readonly table: PblNgridComponent<any>;
  readonly index: number;

  private _editing = false;
  private _focused = false;
  private _selected = false;

  constructor(private _rowContext: PblRowContext<T>, public col: PblColumn, private extApi: PblNgridExtensionApi<T>) {
    this.table = extApi.table;
    this.index = this.table.columnApi.indexOf(col);
  }

  static defaultState<T = any>(): CellContextState<T> {
    return { editing: false, focused: false, selected: false };
  }

  clone(): PblCellContext<T> {
    const ctx = new PblCellContext<T>(this._rowContext, this.col, this.extApi);
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
        this.table._cdkTable.syncRows('data', true, this.rowContext.index);
      }
    }
  }

  stopEdit(markForCheck?: boolean): void {
    if (this.editing && !this.table.viewport.isScrolling) {
      this._editing = false;
      this._rowContext.updateCell(this);
      if (markForCheck) {
        this.table._cdkTable.syncRows('data', this.rowContext.index);
      }
    }
  }
}
