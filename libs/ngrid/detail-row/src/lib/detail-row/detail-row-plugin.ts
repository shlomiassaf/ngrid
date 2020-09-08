import { Directive, EventEmitter, Injector, Input, OnDestroy, Output, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { PblNgridComponent, PblNgridPluginController } from '@pebula/ngrid';

import { PblNgridDetailRowComponent } from './row';
import { PblNgridDetailRowParentRefDirective, PblNgridDefaultDetailRowParentComponent } from './directives';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    detailRow?: PblNgridDetailRowPluginDirective<any>;
  }
}

export const PLUGIN_KEY: 'detailRow' = 'detailRow';

export const ROW_WHEN_TRUE = () => true;
export const ROW_WHEN_FALSE = () => false;

export function toggleDetailRow<T = any>(grid: PblNgridComponent<T>, row: T, forceState?: boolean): boolean | void {
  const controller = PblNgridPluginController.find(grid);
  if (controller) {
    const plugin = controller.getPlugin(PLUGIN_KEY);
    if (plugin) {
      return plugin.toggleDetailRow(row, forceState);
    }
  }
}

export interface PblDetailsRowToggleEvent<T = any> {
  row: T;
  expended: boolean;
  toggle(): void;
}

@Directive({ selector: 'pbl-ngrid[detailRow]', exportAs: 'pblNgridDetailRow' })
export class PblNgridDetailRowPluginDirective<T> implements OnDestroy {
  /**
   * Detail row control (none / all rows / selective rows)
   *
   * A detail row is an additional row added below a row rendered with the context of the row above it.
   *
   * You can enable/disable detail row for the entire grid by setting `detailRow` to true/false respectively.
   * To control detail row per row, provide a predicate.
   */
  @Input() get detailRow(): ( (index: number, rowData: T) => boolean ) | boolean { return this._detailRow; }
  set detailRow(value: ( (index: number, rowData: T) => boolean ) | boolean ) {
    if (this._detailRow !== value) {
      const grid = this.grid;

      if (typeof value === 'function') {
        this._isSimpleRow = (index: number, rowData: T) => !(value as any)(index, rowData);
        this._isDetailRow = value;
      } else {
        value = coerceBooleanProperty(value);
        this._isDetailRow = value ? ROW_WHEN_TRUE : ROW_WHEN_FALSE;
        this._isSimpleRow = value ? ROW_WHEN_FALSE : ROW_WHEN_TRUE;
      }
      this._detailRow = value;

      if (grid.isInit) {
        this.updateTable();
      }
    }
  }

  @Input() set singleDetailRow(value: boolean) {
    value = coerceBooleanProperty(value);
    if (this._forceSingle !== value) {
      this._forceSingle = value;
      if (value && this._openedRow && this._openedRow.expended) {
        this._detailRowRows.forEach( r => {
          if (r.row !== this._openedRow.row) {
            r.toggle(false);
          }
        });
      }
    }
  }

  /**
   * A list of columns that will not trigger a detail row toggle when clicked.
   */
  @Input() excludeToggleFrom: string[];

  /**
   * Set the behavior when the row's context is changed while the detail row is opened (another row is displayed in place of the current row).
   *
   * - ignore: don't do anything, leave as is (for manual intervention)
   * - close: close the detail row
   * - render: re-render the row with the new context
   *
   * The default behavior is `render`
   *
   * This scenario will pop-up when using pagination and the user move between pages or change the page size.
   * It might also happen when the data is updated due to custom refresh calls on the datasource or any other scenario that might invoke a datasource update.
   *
   * The `ignore` phase, when used, will not trigger an update, leaving the detail row opened and showing data from the previous row.
   * The `ignore` is intended for use with `toggledRowContextChange`, which will emit when the row context has changed, this will allow the developer to
   * toggle the row (mimic `close`) or update the context manually. For example, if toggling open the detail row invokes a "fetch" operation that retrieves data for the detail row
   * this will allow updates on context change.
   *
   * > Note that `toggledRowContextChange` fires regardless of the value set in `whenContextChange`
   */
  @Input() whenContextChange: 'ignore' | 'close' | 'render' = 'render';

  /**
   * Emits whenever a detail row instance is toggled on/off
   * Emits an event handler with the row, the toggle state and a toggle operation method.
   */
  @Output() toggleChange = new EventEmitter<PblDetailsRowToggleEvent<T>>();
  /**
   * Emits whenever the row context has changed while the row is toggled open.
   * This scenario is unique and will occur only when a detail row is opened AND the parent row has changed.
   *
   * For example, when using pagination and the user navigates to the next/previous set or when the rows per page size is changed.
   * It might also occur when the data is updated due to custom refresh calls on the datasource or any other scenario that might invoke a datasource update.
   *
   * Emits an event handler with the row, the toggle state and a toggle operation method.
   */
  @Output() toggledRowContextChange = new EventEmitter<PblDetailsRowToggleEvent<T>>();

  private _openedRow?: PblDetailsRowToggleEvent<T>;
  private _forceSingle: boolean;
  private _isSimpleRow: (index: number, rowData: T) => boolean = ROW_WHEN_TRUE;
  private _isDetailRow: (index: number, rowData: T) => boolean = ROW_WHEN_FALSE;
  private _detailRowRows = new Map<any, PblNgridDetailRowComponent>();
  private _detailRow: ( (index: number, rowData: T) => boolean ) | boolean;
  private _detailRowDef: PblNgridDetailRowParentRefDirective<T>;
  private _defaultParentRef: ComponentRef<PblNgridDefaultDetailRowParentComponent>;
  private _removePlugin: (grid: PblNgridComponent<any>) => void;

  constructor(private grid: PblNgridComponent<any>, pluginCtrl: PblNgridPluginController<T>, private injector: Injector) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);

    let subscription = pluginCtrl.events.subscribe( event => {
      if (event.kind === 'onInit') {
        subscription.unsubscribe();
        subscription = undefined;

        // Depends on target-events plugin
        // if it's not set, create it.
        if (!pluginCtrl.hasPlugin('targetEvents')) {
          pluginCtrl.createPlugin('targetEvents');
        }

        grid.registry.changes
          .subscribe( changes => {
            for (const c of changes) {
              switch (c.type) {
                case 'detailRowParent':
                  if (c.op === 'remove') {
                    grid._cdkTable.removeRowDef(c.value);
                    this._detailRowDef = undefined;
                  }
                  this.setupDetailRowParent();
                  // grid._cdkTable.syncRows('data');
                  break;
              }
            }
          });

        // if we start with an initial value, then update the grid cause we didn't do that
        // when it was set (we cant cause we're not init)
        // otherwise just setup the parent.
        if (this._detailRow) {
          this.updateTable();
        } else {
          this.setupDetailRowParent();
        }
      }
    });
  }

  addDetailRow(detailRow: PblNgridDetailRowComponent): void {
    this._detailRowRows.set(detailRow.row, detailRow);
  }

  removeDetailRow(detailRow: PblNgridDetailRowComponent): void {
    this._detailRowRows.delete(detailRow.row);
  }

  toggleDetailRow(row: any, forceState?: boolean): boolean | void {
    const detailRow = this._detailRowRows.get(row);
    if (detailRow) {
      detailRow.toggle(forceState);
      return detailRow.expended;
    }
  }

  ngOnDestroy(): void {
    if (this._defaultParentRef) {
      this._defaultParentRef.destroy();
    }
    this._removePlugin(this.grid);
  }

  /** @internal */
  detailRowToggled(event: PblDetailsRowToggleEvent<T>): void {
    // logic for closing previous row
    const isSelf = this._openedRow && this._openedRow.row === event.row;
    if (event.expended) {
      if (this._forceSingle && this._openedRow && this._openedRow.expended && !isSelf) {
        this._openedRow.toggle();
      }
      this._openedRow = event;
    } else if (isSelf) {
      this._openedRow = undefined;
    }
    this.toggleChange.emit(event);
  }

  private setupDetailRowParent(): void {
    const grid = this.grid;
    const cdkTable = grid._cdkTable;
    if (this._detailRowDef) {
      cdkTable.removeRowDef(this._detailRowDef);
      this._detailRowDef = undefined;
    }
    if (this.detailRow) {
      let detailRow = grid.registry.getSingle('detailRowParent');
      if (detailRow) {
        this._detailRowDef = detailRow = detailRow.clone();
        Object.defineProperty(detailRow, 'columns', { enumerable: true,  get: () => grid.columnApi.visibleColumnIds });
        Object.defineProperty(detailRow, 'when', { enumerable: true,  get: () => this._isDetailRow });
        detailRow.ngOnChanges({ columns: { isFirstChange: () => true, firstChange: true, currentValue: detailRow.columns, previousValue: null }});
      } else if (!this._defaultParentRef) {
        // TODO: move to module? set in root registry? put elsewhere to avoid grid sync (see event of registry change)...
        this._defaultParentRef = this.injector.get(ComponentFactoryResolver)
          .resolveComponentFactory(PblNgridDefaultDetailRowParentComponent)
          .create(this.injector);
        this._defaultParentRef.changeDetectorRef.detectChanges();
        return;
      }
    }
    this.resetTableRowDefs();
  }

  private resetTableRowDefs(): void {
    const grid = this.grid;
    if (this._detailRowDef) {
      this._detailRow === false
        ? grid._cdkTable.removeRowDef(this._detailRowDef)
        : grid._cdkTable.addRowDef(this._detailRowDef)
      ;
    }
  }

  /**
   * Update the grid with detail row infor.
   * Instead of calling for a change detection cycle we can assign the new predicates directly to the cdkRowDef instances.
   */
  private updateTable(): void {
    this.grid._tableRowDef.when = this._isSimpleRow;
    this.setupDetailRowParent();
    // Once we changed the `when` predicate on the `CdkRowDef` we must:
    //   1. Update the row cache (property `rowDefs`) to reflect the new change
    this.grid._cdkTable.updateRowDefCache();

    //   2. re-render all rows.
    // The logic for re-rendering all rows is handled in `CdkTable._forceRenderDataRows()` which is a private method.
    // This is a workaround, assigning to `multiTemplateDataRows` will invoke the setter which
    // also calls `CdkTable._forceRenderDataRows()`
    // TODO: This is risky, the setter logic might change.
    // for example, if material will chack for change in `multiTemplateDataRows` setter from previous value...
    this.grid._cdkTable.multiTemplateDataRows = !!this._detailRow;
  }
}
