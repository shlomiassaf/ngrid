import { EmbeddedViewRef, ViewContainerRef, NgZone } from '@angular/core';
import { PblNgridExtensionApi } from '../../ext/grid-ext-api';
import { PblCdkTableComponent } from '../pbl-cdk-table/pbl-cdk-table.component';
import { unrx } from '../utils/unrx';
import { PblNgridBaseRowComponent } from './base-row.component';
import { PblNgridCellFactoryResolver } from './cell-factory.service';
import { PblNgridColumnRowComponent } from './columns-row.component';
import { PblNgridMetaRowComponent } from './meta-row.component';
import { PblNgridRowComponent } from './row.component';
import { GridRowType } from './types';

export interface RowsApi<T = any> {
  syncRows(rowType?: 'all' | boolean, detectChanges?: boolean): void;
  syncRows(rowType: 'header' | 'data' | 'footer', detectChanges: boolean, ...rows: number[]): void;
  syncRows(rowType: 'header' | 'data' | 'footer', ...rows: number[]): void;

  findDataRowByIndex(index: number): PblNgridRowComponent<T> | undefined;
  findDataRowByIdentity(identity: string): PblNgridRowComponent<T> | undefined;
}

export class PblRowsApi<T = any> implements RowsApi<T> {

  cdkTable: PblCdkTableComponent<T>;

  private allRows = new Set<PblNgridBaseRowComponent<GridRowType, T>>();
  private rows = new Map<GridRowType, Set<PblNgridBaseRowComponent<any, T>>>();
  private columnRows = new Set<PblNgridRowComponent<T> | PblNgridColumnRowComponent>();
  private metaHeaderRows = new Set<PblNgridMetaRowComponent>();
  private metaFooterRows = new Set<PblNgridMetaRowComponent>();
  private gridWidthRow: PblNgridColumnRowComponent;

  constructor(private readonly extApi: PblNgridExtensionApi<T>,
              private readonly zone: NgZone,
              public readonly cellFactory: PblNgridCellFactoryResolver) {
    extApi.onConstructed(() => this.cdkTable = extApi.cdkTable);

    for (const type of ['header', 'data', 'footer', 'meta-header', 'meta-footer'] as GridRowType[]) {
      this.rows.set(type, new Set<PblNgridBaseRowComponent<any, T>>());
    }

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
  }

  addRow(row: PblNgridBaseRowComponent<GridRowType, T>) {
    this.allRows.add(row);
    const rows = this.rows.get(row.rowType);
    rows.add(row);

    switch (row.rowType) {
      case 'header':
        if ((row as unknown as PblNgridColumnRowComponent).gridWidthRow) {
          this.gridWidthRow = row as unknown as PblNgridColumnRowComponent;
        }
      case 'data': // tslint:disable-line: no-switch-case-fall-through
      case 'footer':
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
      case 'footer':
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

  findDataRowByIndex(index: number): PblNgridRowComponent<T> | undefined {
    for (const r of Array.from(this.rows.get('data')) as PblNgridRowComponent<T>[]) {
      if (r.rowIndex === index) {
        return r;
      }
    }
  }

  findDataRowByIdentity(identity: string): PblNgridRowComponent<T> | undefined {
    for (const r of Array.from(this.rows.get('data')) as PblNgridRowComponent<T>[]) {
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
