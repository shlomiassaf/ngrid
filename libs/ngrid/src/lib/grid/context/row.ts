import { _PblNgridComponent } from '../../tokens';
import { PblColumn } from '../column/model';
import { PblNgridExtensionApi } from '../../ext/grid-ext-api';
import { CellContextState, RowContextState, PblNgridRowContext, ExternalRowContextState } from './types';
import { PblCellContext } from './cell';
import { PblNgridRowComponent } from '../row/row.component';

export class PblRowContext<T> implements PblNgridRowContext<T> {
  /** Data for the row that this cell is located within. */
  get $implicit(): T | undefined { return this._$implicit; }
  set $implicit(value: T | undefined) {
    if (this._$implicit !== value) {
      this._$implicit = value;
      this.updateRowData();
    }
  };

  /** Index of the data object in the provided data array. */
  index?: number;
  /** Index of the data object in the provided data array. */
  get dataIndex() { return this.index; }
  set dataIndex(value: number) { this.index = value; }

  /** Index location of the rendered row that this cell is located within. */
  renderIndex?: number;
  /** Length of the number of total rows. */
  count?: number;
  /** True if this cell is contained in the first row. */
  first?: boolean;
  /** True if this cell is contained in the last row. */
  last?: boolean;
  /** True if this cell is contained in a row with an even-numbered index. */
  even?: boolean;
  /** True if this cell is contained in a row with an odd-numbered index. */
  odd?: boolean;

  /** The index at the datasource */
  dsIndex: number;
  identity: any;
  firstRender: boolean;
  outOfView: boolean;

  readonly grid: _PblNgridComponent<T>;
  private _attachedRow: PblNgridRowComponent<T>;
  private external: any = {};

  /**
   * Returns the length of cells context stored in this row
   */
  get length(): number { return this.cells?.length ?? 0; }

  private cells: PblCellContext<T>[];

  private _$implicit?: T;
  private _updatePending: boolean;

  constructor(_data: T, dsIndex: number, private extApi: PblNgridExtensionApi<T>) {
    this.dsIndex = dsIndex;
    this._$implicit = _data;
    this.identity = this.extApi.contextApi.getRowIdentity(dsIndex, _data);

    this.grid = extApi.grid;
    this._rebuildCells(this.extApi.grid.columnApi.columns);
  }

  static defaultState<T = any>(identity: any, dsIndex: number, cellsCount: number): RowContextState<T> {
    const cells: CellContextState<T>[] = [];
    for (let i = 0; i < cellsCount; i++) {
      cells.push(PblCellContext.defaultState());
    }
    return { identity, dsIndex, cells, firstRender: true, external: {} };
  }

  getExternal<P extends keyof ExternalRowContextState>(key: P): ExternalRowContextState[P] {
    return this.external[key];
  }

  setExternal<P extends keyof ExternalRowContextState>(key: P, value: ExternalRowContextState[P], saveState = false) {
    this.external[key] = value;
    if (saveState) {
      this.saveState();
    }
  }

  getState(): RowContextState<T> {
    return {
      identity: this.identity,
      dsIndex: this.dsIndex,
      firstRender: this.firstRender,
      cells: this.cells.map( c => c.getState() ),
      external: this.external,
    };
  }

  fromState(state: RowContextState<T>): void {
    this.firstRender = state.firstRender;
    this.dsIndex = state.dsIndex;
    this.external = state.external;
    for (let i = 0, len = this.cells.length; i < len; i++) {
      this.cells[i].fromState(state.cells[i], this);
    }
  }

  saveState() {
    this.extApi.contextApi.saveState(this);
  }

  /**
   * Returns the cell context for the column at the specified position.
   * > The position is relative to ALL columns (NOT RENDERED COLUMNS)
   */
  cell(index: number | PblColumn): PblCellContext<T> | undefined {
    const idx = typeof index === 'number' ? index : this.grid.columnApi.indexOf(index);
    return this.cells[idx];
  }

  getCells(): PblCellContext<T>[] {
    return (this.cells && this.cells.slice()) || [];
  }

  updateCell(cell: PblCellContext<T>): void {
    this.cells[cell.index] = cell.clone();
  }

  attachRow(row: PblNgridRowComponent<T>) {
    this.detachRow(this._attachedRow);
    this._attachedRow = row;
    if (this._updatePending) {
      this.updateRowData();
    }
  }

  detachRow(row: PblNgridRowComponent<T>) {
    if (row && this._attachedRow === row) {
      this.saveState();
      this._attachedRow = undefined;
    }
  }

  _rebuildCells(columns: PblColumn[]) {
    const cells = this.cells = [];
    const len = columns.length;

    for (let columnIndex = 0; columnIndex < len; columnIndex++) {
      const cellContext = PblCellContext.create<T>(this, columns[columnIndex], this.extApi);
      cells.push(cellContext);
    }
  }

  private updateRowData() {
    if (this._attachedRow) {
      this._updatePending = false;
      this.extApi.contextApi._updateRowContext(this, this._attachedRow.rowIndex);
      this._attachedRow.updateRow();
    } else {
      this._updatePending = !!this._$implicit;
    }
  }
}
