import { NgZone } from '@angular/core';
import { ON_INVALIDATE_HEADERS, unrx } from '@pebula/ngrid/core';
import { PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';
import { RowIntersectionTracker } from '../features/virtual-scroll/row-intersection';
import { PblNgridMetaRowService } from '../meta-rows/meta-row.service';
import { PblCdkTableComponent } from '../pbl-cdk-table/pbl-cdk-table.component';
import { PblNgridBaseRowComponent } from './base-row.component';
import { PblNgridCellFactoryResolver } from './cell-factory.service';
import { PblNgridColumnRowComponent } from './columns-row.component';
import { PblNgridMetaRowComponent } from './meta-row.component';
import { PblNgridRowComponent } from './row.component';
import { GridRowType } from './types';
import { updateMetaRowFirstLastClass } from './utils';

export interface RowsApi<T = any> {
  readonly metaRowService: PblNgridMetaRowService<T>;

  syncRows(rowType?: 'all' | boolean, detectChanges?: boolean): void;
  syncRows(rowType: 'header' | 'data' | 'footer', detectChanges: boolean, ...rows: number[]): void;
  syncRows(rowType: 'header' | 'data' | 'footer', ...rows: number[]): void;

  findDataRowByIndex(index: number): PblNgridRowComponent<T> | undefined;
  findDataRowByDsIndex(index: number): PblNgridRowComponent<T> | undefined;
  findDataRowByIdentity(identity: string | number): PblNgridRowComponent<T> | undefined;
  findRowByElement(element: Element): PblNgridBaseRowComponent<GridRowType, T> | undefined;

}

function isPblNgridRowComponent<T = any>(row: PblNgridBaseRowComponent<GridRowType, T>): row is PblNgridRowComponent {
  return row.rowType === 'data';
}

export class PblRowsApi<T = any> implements RowsApi<T> {

  cdkTable: PblCdkTableComponent<T>;

  readonly metaRowService: PblNgridMetaRowService<T>;

  private allByElement = new Map<Element, PblNgridBaseRowComponent<GridRowType, T>>();
  private allRows = new Set<PblNgridBaseRowComponent<GridRowType, T>>();
  private rows = new Map<GridRowType, Set<PblNgridBaseRowComponent<any, T>>>();
  private columnRows = new Set<PblNgridRowComponent<T> | PblNgridColumnRowComponent>();
  private metaHeaderRows = new Set<PblNgridMetaRowComponent>();
  private metaFooterRows = new Set<PblNgridMetaRowComponent>();
  private gridWidthRow: PblNgridColumnRowComponent;
  private intersection?: RowIntersectionTracker;

  private firstLast = {
    header: {} as { first?: Element; last?: Element },
    footer: {} as { first?: Element; last?: Element },
  };

  constructor(private readonly extApi: PblNgridInternalExtensionApi<T>,
              private readonly zone: NgZone,
              public readonly cellFactory: PblNgridCellFactoryResolver) {

    this.metaRowService = new PblNgridMetaRowService<T>(extApi);
    extApi.onConstructed(() => this.cdkTable = extApi.cdkTable);

    for (const type of ['header', 'data', 'footer', 'meta-header', 'meta-footer'] as GridRowType[]) {
      this.rows.set(type, new Set<PblNgridBaseRowComponent<any, T>>());
    }

    /* List to sync events which notify about changes in meta rows and update the first/last rows to have the class marking it is the first/last */
    this.metaRowService.sync
      .pipe(unrx(this))
      .subscribe(() => {
        this.firstLast.header = updateMetaRowFirstLastClass('header', this.extApi.element, this.firstLast.header);
        this.firstLast.footer = updateMetaRowFirstLastClass('footer', this.extApi.element, this.firstLast.footer);
      });

    extApi.columnStore.columnRowChange()
      .pipe(unrx(this))
      .subscribe( event => {
        const gridWidthRow = this.gridWidthRow;
        let requireSizeUpdate = false;

        event.changes.forEachOperation((record, previousIndex, currentIndex) => {
          if (record.previousIndex == null) {
            for (const r of this.columnRows) {
              r._createCell(record.item, currentIndex);
            }
          } else if (currentIndex == null) {
            for (const r of this.columnRows) {
              r._destroyCell(previousIndex);
            }
          } else {
            for (const r of this.columnRows) {
              r._moveCell(previousIndex, currentIndex);
            }
            if (!requireSizeUpdate && gridWidthRow) {
              const lastIndex = gridWidthRow.cellsLength - 1;
              requireSizeUpdate = currentIndex === lastIndex || previousIndex === lastIndex;
            }
          }
        });
      if (requireSizeUpdate) {
        this.gridWidthRow.updateSize();
      }
    });

    extApi.columnStore.metaRowChange()
      .pipe(unrx(this))
      .subscribe( event => {
        const rows = event.metaRow.kind === 'header' ? this.metaHeaderRows : this.metaFooterRows;
        for (const r of rows) {
          if (r.row.rowDef.rowIndex === event.metaRow.rowDef.rowIndex) {
            event.changes.forEachOperation((record, previousIndex, currentIndex) => {
              if (record.previousIndex == null) {
                const columns = this.extApi.columnStore.find(record.item);
                const col = event.metaRow.kind === 'header' ?
                  event.metaRow.isGroup ? columns.headerGroup : columns.header
                  : event.metaRow.isGroup ? columns.footerGroup : columns.footer;
                r._createCell(col as any, currentIndex);
              } else if (currentIndex == null) {
                r._destroyCell(previousIndex);
              } else {
                r._moveCell(previousIndex, currentIndex);
              }
            });
            break;
          }
        }
      });

    extApi.onConstructed(() => {
      this.intersection = extApi.viewport.intersection;
      if (this.intersection.observerMode) {
        this.intersection.intersectionChanged
          .subscribe(entries => {
            for (const e of entries) {
              const row = this.allByElement.get(e.target);
              if (isPblNgridRowComponent(row)) {
                row._setOutOfViewState(!e.isIntersecting);
              }
            }
          });
      } else {
        // only needed for non intersection observer mode
        // TODO: remove when IntersectionObserver is required
        let lastScrollState = extApi.viewport.isScrolling;
        extApi.viewport.scrolling
          .subscribe( scrolling => {
            if (scrolling === 0 && lastScrollState) {
              // TODO: be smarter here, start from edges, stop when both edge hit in view row
              // use isOutOfView location (top/bottom) to speed up
              this.forceUpdateOutOfView(...this.dataRows());
            }
            lastScrollState = !!scrolling;
          });
      }
    });

    extApi.events
      .pipe(ON_INVALIDATE_HEADERS)
      .subscribe( event => {
        const dataRows = this.dataRows();
        for (const row of dataRows) {
          row._rebuildCells();
        }
        // TODO: reset viewport and virtual scroll state/cache/calculations
      });

    // Handle item moves to update the context with the new index
    extApi.events
      .subscribe(event => {
        if (event.kind === 'onBeforeMoveItem') {
          try {
            const { fromIndex, toIndex } = event;
            const main = extApi.grid.rowsApi.findDataRowByDsIndex(fromIndex);
            if (fromIndex < toIndex) {
              for (let i = fromIndex + 1; i <= toIndex; i++) {
                extApi.grid.rowsApi.findDataRowByDsIndex(i).context.dsIndex -= 1;
              }
            } else {
              for (let i = fromIndex - 1; i >= toIndex; i--) {
                extApi.grid.rowsApi.findDataRowByDsIndex(i).context.dsIndex += 1;
              }
            }
            main.context.dsIndex = toIndex;
          } catch (err) {

          }
        }
      });
  }

  forceUpdateOutOfView(...rows: PblNgridRowComponent<T>[]) {
    if (this.intersection.observerMode) {
      const entries = this.intersection.snapshot();
      for (const e of entries) {
        const row = this.allByElement.get(e.target);
        if (isPblNgridRowComponent(row)) {
          row._setOutOfViewState(!e.isIntersecting);
        }
      }
    } else {
      const { clientRect } = this.extApi.viewport.getBoundingClientRects;
      for (const row of rows) {
        row._setOutOfViewState(isOutOfView(row, clientRect));
      }
    }
  }

  addRow(row: PblNgridBaseRowComponent<GridRowType, T>) {
    this.allRows.add(row);
    this.allByElement.set(row.element, row);
    const rows = this.rows.get(row.rowType);
    rows.add(row);

    switch (row.rowType) {
      case 'header':
        if ((row as unknown as PblNgridColumnRowComponent).gridWidthRow) {
          this.gridWidthRow = row as unknown as PblNgridColumnRowComponent;
        }
      case 'data': // tslint:disable-line: no-switch-case-fall-through
        this.intersection.track(row.element);
      case 'footer': // tslint:disable-line: no-switch-case-fall-through
        this.columnRows.add(row as any);
        break;
      case 'meta-header':
        this.metaHeaderRows.add(row as any);
        break;
      case 'meta-footer':
        this.metaFooterRows.add(row as any);
        break;
    }
  }

  removeRow(row: PblNgridBaseRowComponent<any, T>) {
    this.allRows.delete(row);
    this.allByElement.delete(row.element);
    const rows = this.rows.get(row.rowType);
    if (rows) {
      rows.delete(row);
    }

    switch (row.rowType) {
      case 'header':
        if ((row as unknown as PblNgridColumnRowComponent).gridWidthRow && (row as unknown as PblNgridColumnRowComponent) === this.gridWidthRow) {
          this.gridWidthRow = undefined;
        }
      case 'data': // tslint:disable-line: no-switch-case-fall-through
        this.intersection.untrack(row.element);
      case 'footer': // tslint:disable-line: no-switch-case-fall-through
        this.columnRows.delete(row as any);
        break;
      case 'meta-header':
        this.metaHeaderRows.delete(row as any);
        break;
      case 'meta-footer':
        this.metaFooterRows.delete(row as any);
        break;
    }
  }

  dataRows() {
    return Array.from(this.rows.get('data')) as PblNgridRowComponent<T>[];
  }

  findRowByElement(element: Element): PblNgridBaseRowComponent<GridRowType, T> | undefined {
    return this.allByElement.get(element);
  }

  findDataRowByDsIndex(index: number): PblNgridRowComponent<T> | undefined {
    for (const r of this.dataRows()) {
      if (r.context?.dsIndex === index) {
        return r;
      }
    }
  }

  findDataRowByIndex(index: number): PblNgridRowComponent<T> | undefined {
    for (const r of this.dataRows()) {
      if (r.rowIndex === index) {
        return r;
      }
    }
  }

  findDataRowByIdentity(identity: string | number): PblNgridRowComponent<T> | undefined {
    for (const r of this.dataRows()) {
      if (r.context?.identity === identity) {
        return r as PblNgridRowComponent<T>;
      }
    }
  }

  /**
   * Force run change detection for rows.
   * You can run it for specific groups or for all rows.
   */
  syncRows(rowType?: 'all' | boolean, detectChanges?: boolean): void;
  syncRows(rowType: GridRowType, detectChanges: boolean, ...rowsIndex: number[]): void;
  syncRows(rowType: GridRowType, ...rowsIndex: number[]): void;
  syncRows(rowType: GridRowType | 'all' | boolean = false, ...rowsIndex: any[]): void {
    if (!NgZone.isInAngularZone()) {
      this.zone.run(() => this.syncRows(rowType as any, ...rowsIndex));
      return;
    }

    const detectChanges: boolean = typeof rowType === 'boolean'
      ? rowType
      : typeof rowsIndex[0] === 'boolean'
        ? rowsIndex.shift()
        : false
    ;

    let rows: Set<PblNgridBaseRowComponent<GridRowType, T>>;
    let useSpecificRows = rowsIndex.length > 0;
    switch(rowType) {
      case 'header':
      case 'data':
      case 'footer':
      case 'meta-header':
      case 'meta-footer':
        rows = this.rows.get(rowType);
        break;
      default: // boolean or 'all'
        useSpecificRows = false;
        rows = this.allRows;
        break;
    }

    if (!useSpecificRows) {
      for (const r of Array.from(rows)) {
        r.ngDoCheck();
      }
    } else {
      for (const index of rowsIndex) {
        for (const r of Array.from(rows)) {
          if (r.rowIndex === index) {
            r.ngDoCheck();
          }
        }
      }
    }
  }
}

function isOutOfView(row: PblNgridRowComponent, viewPortRect: ClientRect | DOMRect, location?: 'top' | 'bottom'): boolean {
  const elRect = row.element.getBoundingClientRect();

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

  return !isInsideOfView;
}
