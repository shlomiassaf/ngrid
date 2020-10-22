import { EmbeddedViewRef, ViewContainerRef, NgZone, ComponentFactory } from '@angular/core';
import { PblNgridExtensionApi } from '../../ext/grid-ext-api';
import { PblCdkTableComponent } from '../pbl-cdk-table/pbl-cdk-table.component';
import { unrx } from '../utils/unrx';
import { PblNgridBaseRowComponent } from './base-row.component';
import { PblNgridCellFactoryResolver } from './cell-factory.service';
import { GridRowType, PblRowTypeToCellTypeMap } from './types';

export interface RowsApi<T = any> {
  cdkTable: PblCdkTableComponent<T>;

  syncRows(rowType?: 'all' | boolean, detectChanges?: boolean): void;
  syncRows(rowType: 'header' | 'data' | 'footer', detectChanges: boolean, ...rows: number[]): void;
  syncRows(rowType: 'header' | 'data' | 'footer', ...rows: number[]): void;
}

export class PblRowsApi<T = any> implements RowsApi<T> {

  cdkTable: PblCdkTableComponent<T>;

  private rows = new Map<GridRowType, Set<PblNgridBaseRowComponent<any, T>>>();
  private visibleChangedRows = new Set<PblNgridBaseRowComponent<any, T>>();

  constructor(private readonly extApi: PblNgridExtensionApi<T>,
              private readonly zone: NgZone,
              public readonly cellFactory: PblNgridCellFactoryResolver) {
    extApi.onConstructed(() => this.cdkTable = extApi.cdkTable);

    extApi.columnStore.visibleChanged$
      .pipe(unrx(this))
      .subscribe( event => {
        event.changes.forEachOperation((record, previousIndex, currentIndex) => {
          for (const r of this.visibleChangedRows) {
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
        this.visibleChangedRows.add(row);
        break;
    }
  }

  removeRow(row: PblNgridBaseRowComponent<any, T>) {
    const rows = this.rows.get(row.rowType);
    if (rows) {
      rows.delete(row);
    }
    this.visibleChangedRows.delete(row);
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
