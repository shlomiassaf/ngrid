import { EmbeddedViewRef, ViewContainerRef, NgZone, ComponentFactory } from '@angular/core';
import { PblNgridExtensionApi } from '../../ext/grid-ext-api';
import { PblCdkTableComponent } from '../pbl-cdk-table/pbl-cdk-table.component';
import { unrx } from '../utils/unrx';
import { PblNgridBaseRowComponent } from './base-row.component';
import { PblNgridCellFactoryResolver } from './cell-factory.service';
import { PblNgridMetaRowComponent } from './meta-row.component';
import { GridRowType, PblRowTypeToCellTypeMap } from './types';

export interface RowsApi<T = any> {
  syncRows(rowType?: 'all' | boolean, detectChanges?: boolean): void;
  syncRows(rowType: 'header' | 'data' | 'footer', detectChanges: boolean, ...rows: number[]): void;
  syncRows(rowType: 'header' | 'data' | 'footer', ...rows: number[]): void;
}

export class PblRowsApi<T = any> implements RowsApi<T> {

  cdkTable: PblCdkTableComponent<T>;

  private rows = new Map<GridRowType, Set<PblNgridBaseRowComponent<any, T>>>();
  private columnRows = new Set<PblNgridBaseRowComponent<any, T>>();
  private metaHeaderRows = new Set<PblNgridMetaRowComponent>();
  private metaFooterRows = new Set<PblNgridMetaRowComponent>();

  constructor(private readonly extApi: PblNgridExtensionApi<T>,
              private readonly zone: NgZone,
              public readonly cellFactory: PblNgridCellFactoryResolver) {
    extApi.onConstructed(() => this.cdkTable = extApi.cdkTable);

    extApi.columnStore.columnRowChange()
      .pipe(unrx(this))
      .subscribe( event => {
        event.changes.forEachOperation((record, previousIndex, currentIndex) => {
          for (const r of this.columnRows) {
            if (record.previousIndex == null) {
              r._createCell(record.item, currentIndex);
            } else if (currentIndex == null) {
              r._destroyCell(previousIndex);
            } else {
              r._moveCell(previousIndex, currentIndex);
            }
          }
        });
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
                r.row.rowDef.cols.splice(currentIndex, 0, col);
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
    let rows = this.rows.get(row.rowType);
    if (!rows) {
      rows = new Set<PblNgridBaseRowComponent<any, T>>();
      this.rows.set(row.rowType, rows);
    }
    rows.add(row);

    switch (row.rowType) {
      case 'data':
      case 'header':
      case 'footer':
        this.columnRows.add(row);
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
    const rows = this.rows.get(row.rowType);
    if (rows) {
      rows.delete(row);
    }
    switch (row.rowType) {
      case 'data':
      case 'header':
      case 'footer':
        this.columnRows.delete(row);
        break;
      case 'meta-header':
        this.metaHeaderRows.delete(row as any);
        break;
      case 'meta-footer':
        this.metaFooterRows.delete(row as any);
        break;
    }
  }

  /**
   * Force run change detection for rows.
   * You can run it for specific groups or for all rows.
   */
  syncRows(rowType?: 'all' | boolean, detectChanges?: boolean): void;
  syncRows(rowType: 'header' | 'data' | 'footer', detectChanges: boolean, ...rows: number[]): void;
  syncRows(rowType: 'header' | 'data' | 'footer', ...rows: number[]): void;
  syncRows(rowType: 'header' | 'data' | 'footer' | 'all' | boolean = false, ...rows: any[]): void {
    if (!NgZone.isInAngularZone()) {
      this.zone.run(() => this.syncRows(rowType as any, ...rows));
      return;
    }

    const detectChanges: boolean = typeof rowType === 'boolean'
      ? rowType
      : typeof rows[0] === 'boolean'
        ? rows.shift()
        : false
    ;

    let vcRef: ViewContainerRef;
    switch(rowType) {
      case 'header':
        vcRef = this.cdkTable._headerRowOutlet.viewContainer;
        break;
      case 'data':
        vcRef = this.cdkTable._rowOutlet.viewContainer;
        break;
      case 'footer':
        vcRef = this.cdkTable._footerRowOutlet.viewContainer;
        break;
      default: // boolean or 'all'
        this.cdkTable.cdRef.markForCheck();
        if (detectChanges) {
          this.cdkTable.cdRef.detectChanges();
        }
        return;
    }

    const useSpecificRows = rows.length > 0;
    const count = useSpecificRows ? rows.length : vcRef.length;

    for (let renderIndex = 0; renderIndex < count; renderIndex++) {
      const viewRef = vcRef.get(useSpecificRows ? rows[renderIndex] : renderIndex) as EmbeddedViewRef<any>;
      if (viewRef) {
        viewRef.markForCheck();
        if (detectChanges) {
          viewRef.detectChanges();
        }
      }
    }
  }
}
