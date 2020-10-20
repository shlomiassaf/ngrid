import { EmbeddedViewRef, ViewContainerRef, NgZone, ComponentFactory, InjectionToken } from '@angular/core';
import { PblNgridExtensionApi } from '../../ext/grid-ext-api';
import { PblNgridCellDirective } from '../cell/cell.component';
import { PblCdkTableComponent } from '../pbl-cdk-table/pbl-cdk-table.component';
import { unrx } from '../utils/unrx';
import { PblNgridRowComponent } from './row.component';

export const NGRID_CELL_FACTORY = new InjectionToken<ComponentFactory<PblNgridCellDirective>>('ComponentFactory<PblNgridCellDirective>');

export interface RowsApi<T = any> {
  cdkTable: PblCdkTableComponent<T>;

  syncRows(rowType?: 'all' | boolean, detectChanges?: boolean): void;
  syncRows(rowType: 'header' | 'data' | 'footer', detectChanges: boolean, ...rows: number[]): void;
  syncRows(rowType: 'header' | 'data' | 'footer', ...rows: number[]): void;
}

export class PblRowsApi<T = any> implements RowsApi<T> {

  cdkTable: PblCdkTableComponent<T>;

  private dataRows = new Set<PblNgridRowComponent<T>>();

  constructor(private readonly extApi: PblNgridExtensionApi<T>,
              private readonly zone: NgZone,
              public readonly _factory: ComponentFactory<PblNgridCellDirective>) {
    extApi.onConstructed(() => this.cdkTable = extApi.cdkTable);

    extApi.columnStore.visibleChanged$
      .pipe(unrx(this))
      .subscribe( event => {
        event.changes.forEachOperation((record, previousIndex, currentIndex) => {
          for (const r of this.dataRows) {
            if (record.previousIndex == null) {
              r._createCell(record.item, currentIndex);
            } else if (currentIndex == null) {
              r._destroyCell(record.item, true);
            } else {
              r._moveCell(previousIndex, currentIndex);
            }
          }
        });
      });
  }

  addRow(row: PblNgridRowComponent<T>) {
    this.dataRows.add(row);
  }

  removeRow(row: PblNgridRowComponent<T>) {
    this.dataRows.delete(row);
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
