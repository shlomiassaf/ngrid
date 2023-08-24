import { BehaviorSubject, Subject, Observable, asapScheduler } from 'rxjs';
import { debounceTime, buffer, map, filter, take } from 'rxjs/operators';
import { ViewContainerRef } from '@angular/core';

import { ON_DESTROY, removeFromArray } from '@pebula/ngrid/core';
import { PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';
import { PblColumn } from '../column/model';
import { ColumnApi } from '../column/management';
import {
  RowContextState,
  CellContextState,
  PblNgridCellContext,
  PblNgridRowContext,
  CellReference,
  GridDataPoint,
  PblNgridFocusChangedEvent,
  PblNgridSelectionChangedEvent
} from './types';
import { findRowRenderedIndex, resolveCellReference } from './utils';
import { PblRowContext } from './row';
import { PblCellContext } from './cell';

export class ContextApi<T = any> {
  private viewCache = new Map<number, PblRowContext<T>>();
  private viewCacheGhost = new Set<any>();
  private cache = new Map<any, RowContextState<T>>();
  private vcRef: ViewContainerRef;
  private columnApi: ColumnApi<T>;

  private activeFocused: GridDataPoint;
  private activeSelected: GridDataPoint[] = [];
  private focusChanged$ = new BehaviorSubject<PblNgridFocusChangedEvent>({ prev: undefined, curr: undefined });
  private selectionChanged$ = new Subject<PblNgridSelectionChangedEvent>();

  /**
   * Notify when the focus has changed.
   *
   * > Note that the notification is not immediate, it will occur on the closest micro-task after the change.
   */
  readonly focusChanged: Observable<PblNgridFocusChangedEvent> = this.focusChanged$
    .pipe(
      buffer<PblNgridFocusChangedEvent>(this.focusChanged$.pipe(debounceTime(0, asapScheduler))),
      map( events => ({ prev: events[0]?.prev, curr: events[events.length - 1]?.curr }) )
    );

  /**
   * Notify when the selected cells has changed.
   */
  readonly selectionChanged: Observable<PblNgridSelectionChangedEvent> = this.selectionChanged$.asObservable();

  /**
   * The reference to currently focused cell context.
   * You can retrieve the actual context or context cell using `findRowInView` and / or `findRowInCache`.
   *
   * > Note that when virtual scroll is enabled the currently focused cell does not have to exist in the view.
   * If this is the case `findRowInView` will return undefined, use `findRowInCache` instead.
   */
  get focusedCell(): GridDataPoint | undefined {
    return this.activeFocused ? {...this.activeFocused } : undefined;
  }

  /**
   * The reference to currently selected range of cell's context.
   * You can retrieve the actual context or context cell using `findRowInView` and / or `findRowInCache`.
   *
   * > Note that when virtual scroll is enabled the currently selected cells does not have to exist in the view.
   * If this is the case `findRowInView` will return undefined, use `findRowInCache` instead.
   */
  get selectedCells(): GridDataPoint[] {
    return this.activeSelected.slice();
  }

  constructor(private extApi: PblNgridInternalExtensionApi<T>) {
    this.columnApi = extApi.columnApi;
    extApi.events
      .pipe(
        filter( e => e.kind === 'onDataSource'),
        take(1),
      ).subscribe(() => {
        this.vcRef = extApi.cdkTable._rowOutlet.viewContainer;
        this.syncViewAndContext();
        extApi.cdkTable.onRenderRows.subscribe(() => this.syncViewAndContext());
      });

    extApi.events.pipe(ON_DESTROY).subscribe( e => this.destroy() );
  }

  /**
   * Focus the provided cell.
   * If a cell is not provided will un-focus (blur) the currently focused cell (if there is one).
   * @param cellRef A Reference to the cell
   */
  focusCell(cellRef?: CellReference): void {
    if (!cellRef) {
      if (this.activeFocused) {
        const { rowIdent, colIndex } = this.activeFocused;
        this.activeFocused = undefined;
        this.updateState(rowIdent, colIndex, { focused: false });
        this.emitFocusChanged(this.activeFocused);
        const rowContext = this.findRowInView(rowIdent);
        if (rowContext) {
          this.extApi.grid.rowsApi.syncRows('data', rowContext.index);
        }
      }
    } else {
      const ref = resolveCellReference(cellRef, this as any);
      if (ref) {
        this.focusCell();
        if (ref instanceof PblCellContext) {
          if (!ref.focused && !this.extApi.grid.viewport.isScrolling) {
            this.updateState(ref.rowContext.identity, ref.index, { focused: true });

            this.activeFocused = { rowIdent: ref.rowContext.identity, colIndex: ref.index };

            this.selectCells( [ this.activeFocused ], true);

            this.extApi.grid.rowsApi.syncRows('data', ref.rowContext.index);
          }
        } else {
          this.updateState(ref[0].identity, ref[1], { focused: true });
          this.activeFocused = { rowIdent: ref[0].identity, colIndex: ref[1] };
        }
        this.emitFocusChanged(this.activeFocused);
      }
    }
  }

  /**
   * Select all provided cells.
   * @param cellRef A Reference to the cell
   * @param clearCurrent Clear the current selection before applying the new selection.
   * Default to false (add to current).
   */
  selectCells(cellRefs: CellReference[], clearCurrent?: boolean): void {
    const toMarkRendered = new Set<number>();

    if (clearCurrent) {
      this.unselectCells();
    }

    const added: GridDataPoint[] = [];

    for (const cellRef of cellRefs) {
      const ref = resolveCellReference(cellRef, this as any);
      if (ref instanceof PblCellContext) {
        if (!ref.selected && !this.extApi.grid.viewport.isScrolling) {
          const rowIdent = ref.rowContext.identity
          const colIndex = ref.index;
          this.updateState(rowIdent, colIndex, { selected: true });

          const dataPoint = { rowIdent, colIndex };
          this.activeSelected.push(dataPoint);
          added.push(dataPoint);

          toMarkRendered.add(ref.rowContext.index);
        }
      } else if (ref) {
        const [ rowState, colIndex ] = ref;
        if (!rowState.cells[colIndex].selected) {
          this.updateState(rowState.identity, colIndex, { selected: true });
          this.activeSelected.push( { rowIdent: rowState.identity, colIndex } );
        }
      }
    }

    if (toMarkRendered.size > 0) {
      this.extApi.grid.rowsApi.syncRows('data', ...Array.from(toMarkRendered.values()));
    }

    this.selectionChanged$.next({ added, removed: [] });
  }

  /**
   * Unselect all provided cells.
   * If cells are not provided will un-select all currently selected cells.
   * @param cellRef A Reference to the cell
   */
  unselectCells(cellRefs?: CellReference[]): void {
    const toMarkRendered = new Set<number>();
    let toUnselect: CellReference[] = this.activeSelected;
    let removeAll = true;

    if(Array.isArray(cellRefs)) {
      toUnselect = cellRefs;
      removeAll = false;
    } else {
      this.activeSelected = [];
    }

    const removed: GridDataPoint[] = [];

    for (const cellRef of toUnselect) {
      const ref = resolveCellReference(cellRef, this as any);
      if (ref instanceof PblCellContext) {
        if (ref.selected) {
          const rowIdent = ref.rowContext.identity
          const colIndex = ref.index;
          this.updateState(rowIdent, colIndex, { selected: false });
          if (!removeAll) {
            const wasRemoved = removeFromArray(this.activeSelected, item => item.colIndex === colIndex && item.rowIdent === rowIdent);
            if (wasRemoved) {
              removed.push({ rowIdent, colIndex })
            }
          }
          toMarkRendered.add(ref.rowContext.index);
        }
      } else if (ref) {
        const [ rowState, colIndex ] = ref;
        if (rowState.cells[colIndex].selected) {
          this.updateState(rowState.identity, colIndex, { selected: false });
          if (!removeAll) {
            const wasRemoved = removeFromArray(this.activeSelected, item => item.colIndex === colIndex && item.rowIdent === rowState.identity);
            if (wasRemoved) {
              removed.push({ rowIdent: rowState.identity, colIndex })
            }
          }
        }
      }
    }

    if (toMarkRendered.size > 0) {
      this.extApi.grid.rowsApi.syncRows('data', ...Array.from(toMarkRendered.values()));
    }

    this.selectionChanged$.next({ added: [], removed });
  }

  /**
   * Clears the entire context, including view cache and memory cache (rows out of view)
   * @param syncView If true will sync the view and the context right after clearing which will ensure the view cache is hot and synced with the actual rendered rows
   * Some plugins will expect a row to have a context so this might be required.
   * The view and context are synced every time rows are rendered so make sure you set this to true only when you know there is no rendering call coming down the pipe.
   */
  clear(syncView?: boolean): void {
    this.viewCache.clear();
    this.viewCacheGhost.clear();
    this.cache.clear();
    if (syncView === true) {
      for (const r of this.extApi.rowsApi.dataRows()) {
        this.viewCache.set(r.rowIndex, r.context);
        // we're clearing the existing view state on the component
        // If in the future we want to update state and not clear, remove this one
        // and instead just take the state and put it in the cache.
        // e.g. if on column swap we want to swap cells in the context...
        r.context.fromState(this.getCreateState(r.context));
        this.syncViewAndContext();
      }
    }
  }

  saveState(context: PblNgridRowContext<T>) {
    if (context instanceof PblRowContext) {
      this.cache.set(context.identity, context.getState());
    }
  }

  getRow(row: number | HTMLElement): PblNgridRowContext<T> | undefined {
    const index = typeof row === 'number' ? row : findRowRenderedIndex(row);
    return this.rowContext(index);
  }

  getCell(cell: HTMLElement | GridDataPoint): PblNgridCellContext | undefined
  /**
   * Return the cell context for the cell at the point specified
   * @param row
   * @param col
   */
  getCell(row: number, col: number): PblNgridCellContext | undefined;
  getCell(rowOrCellElement: number | HTMLElement | GridDataPoint, col?: number): PblNgridCellContext | undefined {
    if (typeof rowOrCellElement === 'number') {
      const rowContext = this.rowContext(rowOrCellElement);
      if (rowContext) {
        return rowContext.cell(col);
      }
    } else {
      const ref = resolveCellReference(rowOrCellElement, this as any);
      if (ref instanceof PblCellContext) {
        return ref;
      }
    }
  }

  getDataItem(cell: CellReference): any {
    const ref = resolveCellReference(cell, this as any);
    if (ref instanceof PblCellContext) {
      return ref.col.getValue(ref.rowContext.$implicit);
    } else if (ref) {
      const row = this.extApi.grid.ds.source[ref[0].dsIndex];
      const column = this.extApi.grid.columnApi.findColumnAt(ref[1]);
      return column.getValue(row);
    }
  }

  createCellContext(renderRowIndex: number, column: PblColumn): PblCellContext<T> {
    const rowContext = this.rowContext(renderRowIndex);
    const colIndex = this.columnApi.indexOf(column);
    return rowContext.cell(colIndex);
  }

  rowContext(renderRowIndex: number): PblRowContext<T> | undefined {
    return this.viewCache.get(renderRowIndex);
  }

  updateState(rowIdentity: any, columnIndex: number, cellState: Partial<CellContextState<T>>): void;
  updateState(rowIdentity: any, rowState: Partial<RowContextState<T>>): void;
  updateState(rowIdentity: any, rowStateOrCellIndex: Partial<RowContextState<T>> | number, cellState?: Partial<CellContextState<T>>): void {
    const currentRowState = this.cache.get(rowIdentity);
    if (currentRowState) {
      if (typeof rowStateOrCellIndex === 'number') {
        const currentCellState = currentRowState.cells[rowStateOrCellIndex];
        if (currentCellState) {
          Object.assign(currentCellState, cellState);
        }
      } else {
        Object.assign(currentRowState, rowStateOrCellIndex);
      }
      const rowContext = this.findRowInView(rowIdentity);
      if (rowContext) {
        rowContext.fromState(currentRowState);
      }
    }
  }

  /**
   * Try to find a specific row, using the row identity, in the current view.
   * If the row is not in the view (or even not in the cache) it will return undefined, otherwise returns the row's context instance (`PblRowContext`)
   * @param rowIdentity The row's identity. If a specific identity is used, please provide it otherwise provide the index of the row in the datasource.
   */
  findRowInView(rowIdentity: any): PblRowContext<T> | undefined {
    const rowState = this.cache.get(rowIdentity);
    if (rowState) {
      const renderRowIndex = rowState.dsIndex - this.extApi.grid.ds.renderStart;
      const rowContext = this.viewCache.get(renderRowIndex);
      if (rowContext && rowContext.identity === rowIdentity) {
        return rowContext;
      }
    }
  }

  /**
   * Try to find a specific row context, using the row identity, in the context cache.
   * Note that the cache does not hold the context itself but only the state that can later be used to retrieve a context instance. The context instance
   * is only used as context for rows in view.
   * @param rowIdentity The row's identity. If a specific identity is used, please provide it otherwise provide the index of the row in the datasource.
   */
  findRowInCache(rowIdentity: any): RowContextState<T> | undefined;
  /**
   * Try to find a specific row context, using the row identity, in the context cache.
   * Note that the cache does not hold the context itself but only the state that can later be used to retrieve a context instance. The context instance
   * is only used as context for rows in view.
   * @param rowIdentity The row's identity. If a specific identity is used, please provide it otherwise provide the index of the row in the datasource.
   * @param offset When set, returns the row at the offset from the row with the provided row identity. Can be any numeric value (e.g 5, -6, 4).
   * @param create Whether to create a new state if the current state does not exist.
   */
  findRowInCache(rowIdentity: any, offset: number, create: boolean): RowContextState<T> | undefined;
  findRowInCache(rowIdentity: any, offset?: number, create?: boolean): RowContextState<T> | undefined {
    const rowState = this.cache.get(rowIdentity);

    if (!offset) {
      return rowState;
    } else {
      const dsIndex = rowState.dsIndex + offset;
      const identity = this.getRowIdentity(dsIndex);
      if (identity !== null) {
        let result = this.findRowInCache(identity);
        if (!result && create && dsIndex < this.extApi.grid.ds.length) {
          result = PblRowContext.defaultState(identity, dsIndex, this.columnApi.columns.length);
          this.cache.set(identity, result);
        }
        return result;
      }
    }
  }

  getRowIdentity(dsIndex: number, rowData?: T): string | number | null {
    const { ds } = this.extApi.grid;
    const { primary } = this.extApi.columnStore;

    const row = rowData || ds.source[dsIndex];
    if (!row) {
      return null;
    } else {
      return primary ? primary.getValue(row) : dsIndex;
    }
  }

  /** @internal */
  _createRowContext(data: T, renderRowIndex: number): PblRowContext<T> {
    const context = new PblRowContext<T>(data, this.extApi.grid.ds.renderStart + renderRowIndex, this.extApi);
    context.fromState(this.getCreateState(context));
    this.addToViewCache(renderRowIndex, context);
    return context;
  }

  _updateRowContext(rowContext: PblRowContext<T>, renderRowIndex: number) {
    const dsIndex = this.extApi.grid.ds.renderStart + renderRowIndex;
    const identity = this.getRowIdentity(dsIndex, rowContext.$implicit);
    if (rowContext.identity !== identity) {
      rowContext.saveState();
      rowContext.dsIndex = dsIndex;
      rowContext.identity = identity;
      rowContext.fromState(this.getCreateState(rowContext));
      this.addToViewCache(renderRowIndex, rowContext)
    }
  }

  private addToViewCache(rowIndex: number, rowContext: PblRowContext<T>) {
    this.viewCache.set(rowIndex, rowContext);
    this.viewCacheGhost.delete(rowContext.identity);
  }

  private getCreateState(context: PblRowContext<T>) {
    let state = this.cache.get(context.identity);
    if (!state) {
      state = PblRowContext.defaultState(context.identity, context.dsIndex, this.columnApi.columns.length);
      this.cache.set(context.identity, state);
    }
    return state;
  }

  private emitFocusChanged(curr: PblNgridFocusChangedEvent['curr']): void {
    this.focusChanged$.next({
      prev: this.focusChanged$.value.curr,
      curr,
    });
  }

  private destroy(): void {
    this.focusChanged$.complete();
    this.selectionChanged$.complete();
  }

  private syncViewAndContext() {
    this.viewCacheGhost.forEach( ident => {
      if (!this.findRowInView(ident)) {
        this.cache.get(ident).firstRender = false
      }
    });
    this.viewCacheGhost = new Set(Array.from(this.viewCache.values()).filter( v => v.firstRender ).map( v => v.identity ));
  }
}

