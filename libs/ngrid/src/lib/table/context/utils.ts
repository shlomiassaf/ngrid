import { PblNgridExtensionApi } from '../../ext/table-ext-api';
import { ColumnApi } from '../column-api';
import { RowContextState, PblNgridCellContext, CellReference, GridDataPoint } from './types';
import { PblRowContext } from './row';
import { PblCellContext } from './cell';

/** IE 11 compatible matches implementation. */
export function matches(element: Element, selector: string): boolean {
  return element.matches ?
      element.matches(selector) :
      (element as any)['msMatchesSelector'](selector);
}

/** IE 11 compatible closest implementation. */
export function closest(element: EventTarget|Element|null|undefined, selector: string): Element | null {
  if (!(element instanceof Node)) { return null; }

  let curr: Node|null = element;
  while (curr != null && !(curr instanceof Element && matches(curr, selector))) {
    curr = curr.parentNode;
  }

  return (curr || null) as Element|null;
}

export function findRowRenderedIndex(el: HTMLElement): number {
  const rows = Array.from(closest(el, 'pbl-cdk-table').querySelectorAll('pbl-ngrid-row'));
  return rows.indexOf(el);
}

export function findCellRenderedIndex(el: HTMLElement): [number, number] {
  const rowEl = closest(el, 'pbl-ngrid-row') as HTMLElement;
  const cells = Array.from(rowEl.querySelectorAll('pbl-ngrid-cell'));
  return [ findRowRenderedIndex(rowEl), cells.indexOf(el) ];
}

/**
 * Resolves the context from one of the possible types in `CellReference`.
 * If the context is within the view it will return the `PblCellContext instance, otherwise it will
 * return a tuple with the first item being the row context state and the seconds item pointing to the cell index.
 *
 * If no context is found, returns undefined.
 */
export function resolveCellReference(cellRef: CellReference,
                                     context: { viewCache: Map<number, PblRowContext<any>>, cache: Map<any, RowContextState>, columnApi: ColumnApi<any>, extApi: PblNgridExtensionApi }): PblCellContext | [RowContextState, number] | undefined {
  let rowIdent: any;
  let colIndex: number;

  if (isGridDataPoint(cellRef)) {
    rowIdent = cellRef.rowIdent;
    colIndex = cellRef.colIndex;
  } else if (isCellContext(cellRef)) {
    rowIdent = cellRef.rowContext.identity;
    colIndex = cellRef.index;
  } else {
    const [ r, c ] = findCellRenderedIndex(cellRef);
    const rowContext = context.viewCache.get(r);
    if (rowContext) {
      const column = context.columnApi.findColumnAt(c);
      const columnIndex = context.columnApi.indexOf(column);
      return rowContext.cell(columnIndex);
    } else {
      return;
    }
  }

  const rowState = context.cache.get(rowIdent);
  if (rowState) {
     const rowContext = context.extApi.table.contextApi.findRowInView(rowState.identity);
     if (rowContext) {
       return rowContext.cell(colIndex);
     } else {
       const cellState = rowState.cells[colIndex];
       if (cellState) {
         return [ rowState, colIndex ];
       }
     }
  }
}

function isGridDataPoint(obj: any): obj is GridDataPoint {
  return 'rowIdent' in obj && 'colIndex' in obj;
}

function isCellContext(obj: any): obj is PblNgridCellContext {
  return 'rowContext' in obj && 'index' in obj;
}
