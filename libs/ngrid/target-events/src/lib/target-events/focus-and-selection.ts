import { takeUntil, switchMap, filter, tap } from 'rxjs/operators';
import { LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW } from '@angular/cdk/keycodes';

import { GridDataPoint } from '@pebula/ngrid';
import { PblNgridRowEvent, PblNgridCellEvent, PblNgridDataCellEvent } from './events';
import { PblNgridTargetEventsPlugin } from './target-events-plugin';
import { isCellEvent, isDataCellEvent, rangeBetween, getInnerCellsInRect } from './utils';

const isOsx = /^mac/.test(navigator.platform.toLowerCase())
const isMainMouseButtonClick = (event: PblNgridDataCellEvent<any, MouseEvent>) => event.source.button === 0;

export function handleFocusAndSelection(targetEvents: PblNgridTargetEventsPlugin) {
  const isCellFocusMode = () => targetEvents.table.focusMode === 'cell';

  const handlers = createHandlers(targetEvents);

  // Handle array keys move (with shift for selection, without for cell focus change)
  targetEvents.keyDown
    .pipe(filter(isCellFocusMode))
    .subscribe(handlers.handleKeyDown);

  // Handle mouse down on cell (focus) and then moving for selection.
  targetEvents.mouseDown
    .pipe(
      filter(isCellFocusMode),
      filter(isDataCellEvent),
      filter(isMainMouseButtonClick),
      tap( event => {
        event.source.stopPropagation();
        event.source.preventDefault();
      }),
      tap(handlers.handleMouseDown), // handle mouse down focus
      switchMap( () => targetEvents.cellEnter.pipe(takeUntil(targetEvents.mouseUp)) ),
      filter(isDataCellEvent),
      filter(isMainMouseButtonClick)
    )
    .subscribe(handlers.handleSelectionChangeByMouseClickAndMove); // now handle movements until mouseup

}

function createHandlers(targetEvents: PblNgridTargetEventsPlugin) {
  const { contextApi } = targetEvents.table;

  function focusCell(rowIdent: any, colIndex: number, markForCheck?: boolean): void {
    contextApi.focusCell({ rowIdent, colIndex }, markForCheck);
  }

  function handleMouseDown(event: PblNgridDataCellEvent<any, MouseEvent>): void {
    if (contextApi.focusedCell && event.source.shiftKey) {
      handleSelectionChangeByMouseClickAndMove(event);
    } else if (isOsx ? event.source.metaKey : event.source.ctrlKey) {
      if (event.context.selected) {
        contextApi.unselectCells([ event.context ]);
      } else {
        contextApi.selectCells([ event.context ]);
      }
    } else {
      focusCell(event.context.rowContext.identity, event.context.index);
    }
  }

  function handleKeyDown(event: PblNgridRowEvent | PblNgridCellEvent): void {
    const source: KeyboardEvent = event.source as any;
    if (isCellEvent(event)) {
      const sourceCell = event.cellTarget;

      let coeff: 1 | -1 = 1;
      let axis: 'h' | 'v';

      switch (source.keyCode) {
        case UP_ARROW:
          coeff = -1;
        case DOWN_ARROW: // tslint:disable-line: no-switch-case-fall-through
          axis = 'v';
          break;
        case LEFT_ARROW:
          coeff = -1;
        case RIGHT_ARROW: // tslint:disable-line: no-switch-case-fall-through
          axis = 'h';
          break;
        default:
          return;
      }

      const cellContext = contextApi.getCell(sourceCell);
      const activeFocus = contextApi.focusedCell || {
        rowIdent: cellContext.rowContext.identity,
        colIndex: cellContext.index,
      };

      if (!!source.shiftKey) {
        handleSelectionChangeByArrows(activeFocus, axis === 'h' ? [coeff, 0] : [0, coeff]);
      } else {
        handleSingleItemFocus(activeFocus, axis === 'h' ? [coeff, 0] : [0, coeff])
      }
    }
  }

  /**
   * Handle selection changes caused ONLY by the use of the arrow keys with SHIFT key.
   *
   * The implementation is NOT incremental, it will re-calculate the selected cell on every arrow key press (every call to this function).
   *
   * First. A simple adjacent cell detection is performed to determine the direction of the current selected cells relative to the
   * source cell (usually the focused cell). We only care about 4 cells, adjacent to the source Cell: Top, Left, Bottom, Right
   *
   *    │ T │
   * ───┼───┼───
   *  R │ C │ L
   * ───┼───┼───
   *    │ B │
   *
   * We can only have 1 quarter selection with Arrow selection so it TL, TR, BR or BL, any other setup will clear the selection and start from scratch.
   *
   * > Note that the logic in this function is for use with arrow keys + SHIFT key, other selection logic
   * does not fit this scenario (e.g. MOUSE selection or ARROW KEYS + CTRL KEY selection)
   *
   * @param sourceCellRef A point reference to the source cell the direction is relative to
   * @param direction The direction of the new cell.
   * [1 | -1, 0] -> HORIZONTAL
   * [0, 1 | -1] -> VERTICAL
   */
  function handleSelectionChangeByArrows(sourceCellRef: GridDataPoint, direction: [0, 1 | -1] | [1 | -1, 0]) {
    const { rowIdent, colIndex } = sourceCellRef;
    const sourceCellState = contextApi.findRowInCache(rowIdent);
    const [moveH, moveV] = direction;

    const hAdj = [ sourceCellState.cells[colIndex - 1], sourceCellState.cells[colIndex + 1] ];
    const vAdj = [ contextApi.findRowInCache(rowIdent, -1, true), contextApi.findRowInCache(rowIdent, 1, true) ];

    let h = (hAdj[0] && hAdj[0].selected ? -1 : 0) + (hAdj[1] && hAdj[1].selected ? 1 : 0);
    let v = (vAdj[0] && vAdj[0].cells[colIndex].selected ? -1 : 0) + (vAdj[1] && vAdj[1].cells[colIndex].selected ? 1 : 0);

    if (h === 0) {
      h += moveH;
    }
    if (v === 0) {
      v += moveV;
    }

    const hCells: GridDataPoint[] = [];
    if (h !== 0) {
      let hContextIndex = colIndex;
      let hContext = sourceCellState.cells[colIndex];
      while (hContext && hContext.selected) {
        hCells.push({ rowIdent, colIndex: hContextIndex });
        hContextIndex += h;
        hContext = sourceCellState.cells[hContextIndex];
      }

      if (moveH) {
        if (h === moveH) {
          if (hContext) {
            hCells.push({ rowIdent, colIndex: hContextIndex });
          }
        } else {
          hCells.pop();
        }
      }
    }

    const vCells: GridDataPoint[] = [ ];
    if (v !== 0) {
      let vContextIdent = rowIdent;
      let vContext = contextApi.findRowInCache(vContextIdent, v, true);
      while (vContext && vContext.cells[colIndex].selected) {
        vContextIdent = vContext.identity;
        vCells.push({ rowIdent: vContextIdent, colIndex });
        vContext = contextApi.findRowInCache(vContextIdent, v, true);
      }

      if (moveV) {
        if (v === moveV) {
          if (vContext) {
            vCells.push({ rowIdent: vContext.identity, colIndex });
          }
        } else {
          vCells.pop();
        }
      }

    }

    const innerCells = getInnerCellsInRect(contextApi, hCells, vCells);
    contextApi.selectCells([ sourceCellRef, ...hCells, ...vCells, ...innerCells ], false, true);
  }

  function handleSelectionChangeByMouseClickAndMove(event: PblNgridDataCellEvent<any, MouseEvent>) {
    const cellContext = event.context;
    const activeFocus = contextApi.focusedCell || {
      rowIdent: cellContext.rowContext.identity,
      colIndex: cellContext.index,
    };
    const focusedRowState = contextApi.findRowInCache(activeFocus.rowIdent);

    const hCells: GridDataPoint[] = [];
    const vCells: GridDataPoint[] = [];

    for (const i of rangeBetween(activeFocus.colIndex, cellContext.index)) {
      hCells.push({ rowIdent: activeFocus.rowIdent, colIndex: i });
    }
    hCells.push({ rowIdent: activeFocus.rowIdent, colIndex: cellContext.index });

    const rowHeight = Math.abs(cellContext.rowContext.dataIndex - focusedRowState.dataIndex);
    const dir = focusedRowState.dataIndex > cellContext.rowContext.dataIndex ? -1 : 1;
    for (let i = 1; i <= rowHeight; i++) {
      const state = contextApi.findRowInCache(activeFocus.rowIdent, dir * i, true);
      vCells.push({ rowIdent: state.identity, colIndex: activeFocus.colIndex });
    }
    const innerCells = getInnerCellsInRect(contextApi, hCells, vCells);
    contextApi.selectCells([ activeFocus, ...hCells, ...vCells, ...innerCells ], false, true);
  }

  /**
   * Swap the focus from the source cell to a straight adjacent cell (not diagonal).
   * @param sourceCellRef A point reference to the source cell the direction is relative to
   * @param direction The direction of the new cell.
   * [1 | -1, 0] -> HORIZONTAL
   * [0, 1 | -1] -> VERTICAL
   */
  function handleSingleItemFocus(sourceCellRef: GridDataPoint, direction: [0, 1 | -1] | [1 | -1, 0]) {
    const rowState = contextApi.findRowInCache(sourceCellRef.rowIdent, direction[1], true);
    if (rowState) {
      contextApi.focusCell({ rowIdent: rowState.identity, colIndex: sourceCellRef.colIndex + direction[0] }, true);
    }
  }

  return {
    handleMouseDown,
    handleKeyDown,
    handleSelectionChangeByMouseClickAndMove
  }
}

