import { RowContext } from '@angular/cdk/table';

import { PblColumn } from '../columns/column';
import { PblNgridExtensionApi } from '../../ext/grid-ext-api';
import { PblNgridComponent } from '../ngrid.component';
import { CellContextState, RowContextState, PblNgridRowContext } from './types';
import { PblCellContext } from './cell';

declare module '@angular/cdk/table/row.d' {
  export interface CdkCellOutletRowContext<T> {
    pblRowContext: PblNgridRowContext<T>;
  }
  export interface CdkCellOutletMultiRowContext<T> {
    pblRowContext: PblNgridRowContext<T>;
  }
}

export class PblRowContext<T> implements PblNgridRowContext<T> {
  /** Data for the row that this cell is located within. */
  $implicit?: T;
  /** Index of the data object in the provided data array. */
  index?: number;
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

  gridInstance: PblNgridComponent<T>;

  firstRender: boolean;
  outOfView: boolean;

  /** @deprecated use grid instead */
  readonly table: PblNgridComponent<T>;

  readonly grid: PblNgridComponent<T>;

  /**
   * Returns the length of cells context stored in this row
   */
  get length(): number {
    return (this.cells && this.cells.length) || 0;
  }

  get pblRowContext(): PblNgridRowContext<T> { return this; }
  set pblRowContext(value: PblNgridRowContext<T>) { }

  private cells: PblCellContext<T>[];

  constructor(public identity: any, public dataIndex: number, private extApi: PblNgridExtensionApi<T>) {
    /*  TODO: material2#14198
        The row context come from the `cdk` and it can be of 2 types, depending if multiple row templates are used or not.
        `index` is used for single row template mode and `renderIndex` for multi row template mode.

        There library and/or plugins require access to the rendered index and having 2 locations is a problem...
        It's a bug trap, adding more complexity and some time access issue because the `CdkTable` instance is not always available.

        This is a workaround for have a single location for the rendered index.
        I chose to `index` as the single location although `renderIndex` will probably be chosen by the material team.
        This is because it's less likely to occur as most tables does not have multi row templates (detail row)
        A refactor will have to be done in the future.
        There is a pending issue to do so in https://github.com/angular/material2/issues/14198
        Also related: https://github.com/angular/material2/issues/14199
    */
    const applyWorkaround = extApi.cdkTable.multiTemplateDataRows;
    if (applyWorkaround) {
      Object.defineProperty(this, 'index', { get: function() { return this.renderIndex; } });
    }

    this.grid = this.table = extApi.grid;

    const cells = this.cells = [];
    const { columns } = extApi.grid.columnApi;
    const len = columns.length;

    for (let columnIndex = 0; columnIndex < len; columnIndex++) {
      const cellContext = PblCellContext.create<T>(this, columns[columnIndex], extApi);
      cells.push(cellContext);
    }
  }

  static defaultState<T = any>(identity: any, dataIndex: number, cellsCount: number): RowContextState<T> {
    const cells: CellContextState<T>[] = [];
    for (let i = 0; i < cellsCount; i++) {
      cells.push(PblCellContext.defaultState());
    }
    return { identity, dataIndex, cells, firstRender: true };
  }

  getState(): RowContextState<T> {
    return {
      identity: this.identity,
      dataIndex: this.dataIndex,
      firstRender: this.firstRender,
      cells: this.cells.map( c => c.getState() ),
    };
  }

  fromState(state: RowContextState<T>): void {
    this.identity = state.identity;
    this.firstRender = state.firstRender;
    this.dataIndex = state.dataIndex;
    for (let i = 0, len = this.cells.length; i < len; i++) {
      this.cells[i].fromState(state.cells[i], this);
    }
  }

  updateContext(context: RowContext<T>): void {
    context.dataIndex = this.dataIndex;
    Object.assign(this, context);
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
    /**
   * Updates the `outOfView` property.
   */
  updateOutOfViewState(): void {
    this.extApi.contextApi.updateOutOfViewState(this);
  }
}
