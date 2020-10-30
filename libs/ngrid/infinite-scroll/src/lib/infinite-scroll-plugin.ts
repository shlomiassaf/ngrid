import { filter, take } from 'rxjs/operators';
import { Injector, ComponentFactoryResolver, ComponentRef } from '@angular/core';

import { PblColumn, PblNgridComponent, PblNgridPluginController } from '@pebula/ngrid';

import { PblNgridInfiniteVirtualRowRefDirective } from './infinite-virtual-row/directives';
import { PblInfiniteScrollDataSource } from './infinite-scroll-data-source/infinite-scroll-datasource';
import { INFINITE_SCROLL_DEFFERED_ROW } from './infinite-scroll-data-source/infinite-scroll-deffered-row';
import { PblNgridDefaultInfiniteVirtualRowComponent } from './default-infinite-virtual-row/default-infinite-virtual-row.component';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    infiniteScroll?: PblNgridInfiniteScrollPlugin;
  }
  interface PblNgridPluginExtensionFactories {
    infiniteScroll: keyof typeof PblNgridInfiniteScrollPlugin;
  }
}

export const PLUGIN_KEY = 'infiniteScroll' as const;

const IS_INFINITE_VIRTUAL_ROW = (index: number, rowData: any) => {
  return rowData === INFINITE_SCROLL_DEFFERED_ROW;
};
const IS_NOT_INFINITE_VIRTUAL_ROW = (index: number, rowData: any) => {
  return !IS_INFINITE_VIRTUAL_ROW(index, rowData);
};

export class PblNgridInfiniteScrollPlugin<T = any> {

  static create(grid: PblNgridComponent, injector: Injector): PblNgridInfiniteScrollPlugin {
    const pluginCtrl = PblNgridPluginController.find(grid);
    return new PblNgridInfiniteScrollPlugin(grid, pluginCtrl, injector);
  }

  private _enabled: boolean = false;
  private _infiniteVirtualRowDef: PblNgridInfiniteVirtualRowRefDirective<T>;
  private _infiniteVirtualRowRef: ComponentRef<PblNgridDefaultInfiniteVirtualRowComponent>;
  private _removePlugin: (grid: PblNgridComponent<any>) => void;

  constructor(private grid: PblNgridComponent<any>, pluginCtrl: PblNgridPluginController<T>, private injector: Injector) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);

    grid.registry.changes
      .subscribe( changes => {
        for (const c of changes) {
          switch (c.type) {
            case 'infiniteVirtualRow':
              if (c.op === 'remove') {
                grid._cdkTable.removeRowDef(c.value);
                this._infiniteVirtualRowDef = undefined;
              }
              this.setupInfiniteVirtualRow();
              break;
          }
        }
      });

    pluginCtrl.events.subscribe( event => {
      if (event.kind === 'onDataSource') {
        const prevState = this._enabled;
        this._enabled = event.curr instanceof PblInfiniteScrollDataSource;

        if (this._enabled !== prevState) {
          pluginCtrl.onInit().subscribe( () => this.updateTable() );
        }
      } else if (event.kind === 'onDestroy') {
        if (this._infiniteVirtualRowRef) {
          this._infiniteVirtualRowRef.destroy();
        }
        this._removePlugin(this.grid);
      }
    });
  }

  private setupInfiniteVirtualRow(): void {
    const grid = this.grid;
    const cdkTable = grid._cdkTable;
    if (this._infiniteVirtualRowDef) {
      cdkTable.removeRowDef(this._infiniteVirtualRowDef);
      this._infiniteVirtualRowDef = undefined;
    }
    if (this._enabled) {
      let infiniteVirtualRow = grid.registry.getSingle('infiniteVirtualRow');
      if (infiniteVirtualRow) {
        this._infiniteVirtualRowDef = infiniteVirtualRow = infiniteVirtualRow.clone();
        if (!infiniteVirtualRow.columns) {
          Object.defineProperty(infiniteVirtualRow, 'columns', { enumerable: true,  get: () => grid.columnApi.visibleColumnIds });
        }
        Object.defineProperty(infiniteVirtualRow, 'when', { enumerable: true,  get: () => IS_INFINITE_VIRTUAL_ROW });
        infiniteVirtualRow.ngOnChanges({ columns: { isFirstChange: () => true, firstChange: true, currentValue: infiniteVirtualRow.columns, previousValue: null }});
      } else if (!this._infiniteVirtualRowRef) {
        // TODO: move to module? set in root registry? put elsewhere to avoid grid sync (see event of registry change)...
        this._infiniteVirtualRowRef = this.injector.get(ComponentFactoryResolver)
          .resolveComponentFactory(PblNgridDefaultInfiniteVirtualRowComponent)
          .create(this.injector);
        this._infiniteVirtualRowRef.changeDetectorRef.detectChanges();
        return;
      }
    }
    this.resetTableRowDefs();
  }

  private resetTableRowDefs(): void {
    const grid = this.grid;
    if (this._infiniteVirtualRowDef) {
      this._enabled === false
        ? grid._cdkTable.removeRowDef(this._infiniteVirtualRowDef)
        : grid._cdkTable.addRowDef(this._infiniteVirtualRowDef)
      ;
    }
  }

  /**
   * Update the grid with detail row infor.
   * Instead of calling for a change detection cycle we can assign the new predicates directly to the cdkRowDef instances.
   */
  private updateTable(): void {
    this.grid._tableRowDef.when = !!this._enabled ? IS_NOT_INFINITE_VIRTUAL_ROW : undefined;
    this.setupInfiniteVirtualRow();
    // Once we changed the `when` predicate on the `CdkRowDef` we must:
    //   1. Update the row cache (property `rowDefs`) to reflect the new change
    this.grid._cdkTable.updateRowDefCache();

    //   2. re-render all rows.
    // The logic for re-rendering all rows is handled in `CdkTable._forceRenderDataRows()` which is a private method.
    // This is a workaround, assigning to `multiTemplateDataRows` will invoke the setter which
    // also calls `CdkTable._forceRenderDataRows()`
    // TODO: This is risky, the setter logic might change.
    // for example, if material will check for change in `multiTemplateDataRows` setter from previous value...
    this.grid._cdkTable.multiTemplateDataRows = !!this._enabled;
  }
}
