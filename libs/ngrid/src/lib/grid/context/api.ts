import { BehaviorSubject, Subject, Observable, asapScheduler } from 'rxjs';
import { debounceTime, buffer, map, filter } from 'rxjs/operators';

import { ViewContainerRef, EmbeddedViewRef } from '@angular/core';
import { RowContext } from '@angular/cdk/table';

import { PblNgridExtensionApi } from '../../ext/grid-ext-api';
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
import { PblColumn } from '../columns/column';
import { ColumnApi } from '../column-api';
import { removeFromArray } from '../utils';
import { findRowRenderedIndex, resolveCellReference } from './utils';
import { PblRowContext } from './row';
import { PblCellContext } from './cell';

export class ContextApi<T = any> {
  private viewCache = new Map<number, PblRowContext<T>>();
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
      map( events => ({ prev: events[0].prev, curr: events[events.length - 1].curr }) )
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

  constructor(private extApi: PblNgridExtensionApi<T>) {
    this.vcRef = extApi.cdkTable._rowOutlet.viewContainer;
    this.columnApi = extApi.grid.columnApi;

    extApi.events
      .pipe( filter( e => e.kind === 'onDestroy' ) )
      .subscribe( e => this.destroy() );

    const updateContext = () => {
      const viewPortRect = this.getViewRect();
      const lastView = new Set(Array.from(this.viewCache.values()).map( v => v.identity ));
      const unmatchedRefs = new Map<T, [number, number]>();

      let keepProcessOutOfView = !!viewPortRect;
      for (let i = 0, len = this.vcRef.length; i < len; i++) {
        const viewRef = this.findViewRef(i);
        const rowContext = this.findRowContext(viewRef, i);
        this.viewCache.set(i, rowContext);
        lastView.delete(rowContext.identity);

        // Identity did not change but context did change
        // This is probably due to trackBy with index reference or that matched data on some property but the actual data reference changed.
        // We log these and handle them later, they come in pair and we need to switch the context between the values in the pair.

        // The pair is a 2 item tuple - 1st item is new index, 2nd item is the old index.
        // We build the pairs, each pair is a switch
        if (viewRef.context.$implicit !== rowContext.$implicit) {
          let pair = unmatchedRefs.get(rowContext.$implicit) || [-1, -1];
          pair[1] = i;
          unmatchedRefs.set(rowContext.$implicit, pair);

          pair = unmatchedRefs.get(viewRef.context.$implicit) || [-1, -1];
          pair[0] = i;
          unmatchedRefs.set(viewRef.context.$implicit, pair);
        }

        if (keepProcessOutOfView) {
          keepProcessOutOfView = processOutOfView(viewRef, viewPortRect, 'top');
        }
      }

      if (unmatchedRefs.size > 0) {
        // We have pairs but we can't just start switching because when the items move or swap we need
        // to update their values and so we need to cache one of them.
        // The operation will effect all items (N) between then origin and destination.
        // When N === 2 its a swap, when N > 2 its a move.
        // In both cases the first and last operations share the same object.
        // Also, we need to make sure that the order of operations does not use the same row as the source more then once.
        // For example, If I copy row 5 to to row 4 and then 4 to 3 I need to start from 3->4->5, if I do 5->4->3 I will get 5 in all rows.
        //
        // We use the source (pair[1]) for sorting, the sort order depends on the direction of the move (up/down).
        const arr = Array.from(unmatchedRefs.entries()).filter( entry => {
          const pair = entry[1];
          if (pair[0] === -1) {
            return false;
          } else if (pair[1] === -1) {
            const to = this.viewCache.get(pair[0]);
            to.$implicit = entry[0];
            return false;
          }
          return true;
        }).map( entry => entry[1] );

        unmatchedRefs.clear();

        if (arr.length) {
          const sortFn = arr[arr.length - 1][0] - arr[arr.length - 1][1] > 0 // check sort direction
            ? (a,b) => b[1] - a[1]
            : (a,b) => a[1] - b[1]
          ;
          arr.sort(sortFn);

          const lastOp = {
            data: this.viewCache.get(arr[0][0]).$implicit,
            state: this.viewCache.get(arr[0][0]).getState(),
            pair: arr.pop(),
          };

          for (const pair of arr) {
            // What we're doing here is switching the context wrapped by `RotContext` while the `RowContext` preserve it's identity.
            // Each row context has a state, which is valid for it's current context, if we switch context we must switch state as well and also
            // cache it.
            const to = this.viewCache.get(pair[0]);
            const from = this.viewCache.get(pair[1]);
            const state = from.getState();
            state.identity = to.identity;
            this.cache.set(to.identity, state);
            to.fromState(state);
            to.$implicit = from.$implicit;
          }

          const to = this.viewCache.get(lastOp.pair[0]);
          lastOp.state.identity = to.identity;
          this.cache.set(to.identity, lastOp.state);
          to.fromState(lastOp.state);
          to.$implicit = lastOp.data;
        }
      }

      if(viewPortRect) {
        for (let i = this.vcRef.length -1; i > -1; i--) {
          if (!processOutOfView(this.findViewRef(i), viewPortRect, 'bottom')) {
            break;
          }
        }
      }

      lastView.forEach( ident => this.cache.get(ident).firstRender = false );
    };

    updateContext();
    extApi.cdkTable.onRenderRows.subscribe(updateContext);
  }

  /**
   * Focus the provided cell.
   * If a cell is not provided will un-focus (blur) the currently focused cell (if there is one).
   * @param cellRef A Reference to the cell
   * @param markForCheck Mark the row for change detection
   */
  focusCell(cellRef?: CellReference | boolean, markForCheck?: boolean): void {
    if (!cellRef || cellRef === true) {
      if (this.activeFocused) {
        const { rowIdent, colIndex } = this.activeFocused;
        this.activeFocused = undefined;
        this.updateState(rowIdent, colIndex, { focused: false });
        this.emitFocusChanged(this.activeFocused);
        if (markForCheck) {
          const rowContext = this.findRowInView(rowIdent);
          if (rowContext) {
            this.extApi.grid._cdkTable.syncRows('data', rowContext.index);
          }
        }
      }
    } else {
      const ref = resolveCellReference(cellRef, this as any);
      if (ref) {
        this.focusCell(markForCheck);
        if (ref instanceof PblCellContext) {
          if (!ref.focused && !this.extApi.grid.viewport.isScrolling) {
            this.updateState(ref.rowContext.identity, ref.index, { focused: true });

            this.activeFocused = { rowIdent: ref.rowContext.identity, colIndex: ref.index };

            this.selectCells( [ this.activeFocused ], markForCheck, true);

            if (markForCheck) {
              this.extApi.grid._cdkTable.syncRows('data', ref.rowContext.index);
            }
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
   * @param markForCheck Mark the row for change detection
   * @param clearCurrent Clear the current selection before applying the new selection.
   * Default to false (add to current).
   */
  selectCells(cellRefs: CellReference[], markForCheck?: boolean, clearCurrent?: boolean): void {
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

          if (markForCheck) {
            toMarkRendered.add(ref.rowContext.index);
          }
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
      this.extApi.grid._cdkTable.syncRows('data', ...Array.from(toMarkRendered.values()));
    }

    this.selectionChanged$.next({ added, removed: [] });
  }

  /**
   * Unselect all provided cells.
   * If cells are not provided will un-select all currently selected cells.
   * @param cellRef A Reference to the cell
   * @param markForCheck Mark the row for change detection
   */
  unselectCells(cellRefs?: CellReference[] | boolean, markForCheck?: boolean): void {
    const toMarkRendered = new Set<number>();
    let toUnselect: CellReference[] = this.activeSelected;
    let removeAll = true;

    if(Array.isArray(cellRefs)) {
      toUnselect = cellRefs;
      removeAll = false;
    } else {
      markForCheck = !!cellRefs;
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
          if (markForCheck) {
            toMarkRendered.add(ref.rowContext.index);
          }
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
      this.extApi.grid._cdkTable.syncRows('data', ...Array.from(toMarkRendered.values()));
    }

    this.selectionChanged$.next({ added: [], removed });
  }

  clear(): void {
    for (let i = 0, len = this.vcRef.length; i < len; i++) {
      const viewRef = this.findViewRef(i);
      viewRef.context.pblRowContext = undefined;
    }
    this.viewCache.clear();
    this.cache.clear();
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
      const row = this.extApi.grid.ds.source[ref[0].dataIndex];
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

  updateOutOfViewState(rowContext: PblRowContext<T>): void {
    const viewPortRect = this.getViewRect();
    const viewRef = this.findViewRef(rowContext.index);
    processOutOfView(viewRef, viewPortRect);
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
      const renderRowIndex = rowState.dataIndex - this.extApi.grid.ds.renderStart;
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
      const dataIndex = rowState.dataIndex + offset;
      const identity = this.getRowIdentity(dataIndex);
      if (identity !== null) {
        let result = this.findRowInCache(identity);
        if (!result && create && dataIndex < this.extApi.grid.ds.length) {
          result = PblRowContext.defaultState(identity, dataIndex, this.columnApi.columns.length);
          this.cache.set(identity, result);
        }
        return result;
      }
    }
  }

  getRowIdentity(dataIndex: number, context?: RowContext<any>): string | number | null {
    const { ds } = this.extApi.grid;
    const { primary } = this.extApi.columnStore;

    const row = context ? context.$implicit : ds.source[dataIndex];
    if (!row) {
      return null;
    } else {
      return primary ? primary.getValue(row) : dataIndex;
    }
  }

  private findViewRef(index: number): EmbeddedViewRef<RowContext<T>> {
    return this.vcRef.get(index) as EmbeddedViewRef<RowContext<T>>;
  }

  /**
   * Find/Update/Create the `RowContext` for the provided `EmbeddedViewRef` at the provided render position.
   *
   * A `RowContext` object is a wrapper for the internal context of a row in `CdkTable` with the purpose of
   * extending it for the grid features.
   *
   * The process has 2 layers of cache:
   *
   * - `RowContext` objects are stored in a view cache which is synced with the `CdkTable` row outlet viewRefs.
   * Each view ref (row) has a matching record in the `RowContext` view cache.
   *
   * - `RowContextState` object are stored in a cache which is synced with the items in the data source.
   * Each item in the datasource has a matching row `RowContextState` item (lazy), which is used to persist context
   * when `RowContext` goes in/out of the viewport.
   *
   * @param viewRef The `EmbeddedViewRef` holding the context that the returned `RowContext` should wrap
   * @param renderRowIndex The position of the view, relative to other rows.
   * The position is required for caching the context state when a specific row is thrown out of the viewport (virtual scroll).
   * Each `RowContext` gets a unique identity using the position relative to the current render range in the data source.
   */
  private findRowContext(viewRef: EmbeddedViewRef<RowContext<T>>, renderRowIndex: number): PblRowContext<T> | undefined {
    const { context } = viewRef;
    const dataIndex = this.extApi.grid.ds.renderStart + renderRowIndex;
    const identity = this.getRowIdentity(dataIndex, viewRef.context);

    let rowContext = context.pblRowContext as PblRowContext<T>;

    if (!this.cache.has(identity)) {
      this.cache.set(identity, PblRowContext.defaultState(identity, dataIndex, this.columnApi.columns.length));
    }

    if (!rowContext) {
      rowContext = context.pblRowContext = new PblRowContext<T>(identity, dataIndex, this.extApi);
      rowContext.updateContext(context);

      viewRef.onDestroy(() => {
        this.viewCache.delete(renderRowIndex);
        context.pblRowContext = undefined;
      });

    } else if (rowContext.identity !== identity) {
      // save old state before applying new state
      this.cache.set(rowContext.identity, rowContext.getState());
      rowContext.updateContext(context);

      // We
      const gap = dataIndex - rowContext.dataIndex;
      if (gap > 0) {
        const siblingViewRef = this.findViewRef(renderRowIndex + gap);
        const siblingRowContext = siblingViewRef && siblingViewRef.context.pblRowContext as PblRowContext<T>;
        if (siblingRowContext) {
          this.cache.set(siblingRowContext.identity, siblingRowContext.getState());
        }
      }
    } else {
      return rowContext;
    }
    rowContext.fromState(this.cache.get(identity));

    return rowContext;
  }

  private getViewRect(): ClientRect | DOMRect {
    return this.extApi.grid.viewport.elementRef.nativeElement.getBoundingClientRect();
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
}

function processOutOfView(viewRef: EmbeddedViewRef<RowContext<any>>, viewPortRect: ClientRect | DOMRect, location?: 'top' | 'bottom'): boolean {
  const el: HTMLElement = viewRef.rootNodes[0];
  const rowContext = viewRef.context.pblRowContext;
  const elRect = el.getBoundingClientRect();

  let isInsideOfView: boolean;
  switch (location){
    case 'top':
      isInsideOfView = elRect.bottom >= viewPortRect.top;
      break;
    case 'bottom':
      isInsideOfView = elRect.top <= viewPortRect.bottom;
      break;
    default:
      isInsideOfView = (elRect.bottom >= viewPortRect.top && elRect.top <= viewPortRect.bottom)
      break;
  }

  if (isInsideOfView) {
    if (!rowContext.outOfView) {
      return false;
    }
    rowContext.outOfView = false;
  } else {
    rowContext.outOfView = true;
  }
  return true;
}
