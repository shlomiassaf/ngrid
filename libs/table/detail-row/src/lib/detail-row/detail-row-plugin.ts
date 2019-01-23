import { Directive, EmbeddedViewRef, EventEmitter, Injector, Input, OnDestroy, Output, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { UnRx } from '@neg/utils';
import { NegTableComponent, NegTablePluginController, TablePlugin, NegTableRowContext } from '@neg/table';

import { NegTableDetailRowComponent } from './row';
import { NegTableDetailRowParentRefDirective, NegTableDefaultDetailRowParentComponent } from './directives';

declare module '@neg/table/lib/ext/types' {
  interface NegTablePluginExtension {
    detailRow?: NegTableDetailRowPluginDirective<any>;
  }
}

export const PLUGIN_KEY: 'detailRow' = 'detailRow';

export const ROW_WHEN_TRUE = () => true;
export const ROW_WHEN_FALSE = () => false;

export function toggleDetailRow<T = any>(table: NegTableComponent<T>, row: T, forceState?: boolean): boolean | void {
  const controller = NegTablePluginController.find(table);
  if (controller) {
    const plugin = controller.getPlugin(PLUGIN_KEY);
    if (plugin) {
      return plugin.toggleDetailRow(row, forceState);
    }
  }
}

export interface NegDetailsRowToggleEvent<T = any> {
  row: T;
  expended: boolean;
  toggle(): void;
}

@TablePlugin({ id: PLUGIN_KEY })
@Directive({ selector: 'neg-table[detailRow]' })
@UnRx()
export class NegTableDetailRowPluginDirective<T> implements OnDestroy {
  /**
   * Detail row control (none / all rows / selective rows)
   *
   * A detail row is an additional row added below a row rendered with the context of the row above it.
   *
   * You can enable/disable detail row for the entire table by setting `detailRow` to true/false respectively.
   * To control detail row per row, provide a predicate.
   */
  @Input() get detailRow(): ( (index: number, rowData: T) => boolean ) | boolean { return this._detailRow; }
  set detailRow(value: ( (index: number, rowData: T) => boolean ) | boolean ) {
    if (this._detailRow !== value) {
      const table = this.table;

      if (typeof value === 'function') {
        this._isSimpleRow = (index: number, rowData: T) => !(value as any)(index, rowData);
        this._isDetailRow = value;
      } else {
        value = coerceBooleanProperty(value);
        this._isDetailRow = value ? ROW_WHEN_TRUE : ROW_WHEN_FALSE;
        this._isSimpleRow = value ? ROW_WHEN_FALSE : ROW_WHEN_TRUE;
      }
      this._detailRow = value;

      if (table.isInit) {
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

  @Output() toggleChange = new EventEmitter<NegDetailsRowToggleEvent<T>>();

  private _openedRow?: NegDetailsRowToggleEvent<T>;
  private _forceSingle: boolean;
  private _isSimpleRow: (index: number, rowData: T) => boolean = ROW_WHEN_TRUE;
  private _isDetailRow: (index: number, rowData: T) => boolean = ROW_WHEN_FALSE;
  private _detailRowRows = new Map<any, NegTableDetailRowComponent>();
  private _detailRow: ( (index: number, rowData: T) => boolean ) | boolean;
  private _detailRowDef: NegTableDetailRowParentRefDirective<T>;
  private _defaultParentRef: ComponentRef<NegTableDefaultDetailRowParentComponent>;
  private _removePlugin: (table: NegTableComponent<any>) => void;

  constructor(private table: NegTableComponent<any>, pluginCtrl: NegTablePluginController<T>, private injector: Injector) {
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

        table.registry.changes
          .subscribe( changes => {
            for (const c of changes) {
              switch (c.type) {
                case 'detailRowParent':
                  if (c.op === 'remove') {
                    table._cdkTable.removeRowDef(c.value);
                    this._detailRowDef = undefined;
                  }
                  this.setupDetailRowParent();
                  // table._cdkTable.syncRows('data');
                  break;
              }
            }
          });

        // if we start with an initial value, then update the table cause we didn't do that
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

  addDetailRow(detailRow: NegTableDetailRowComponent): void {
    this._detailRowRows.set(detailRow.row, detailRow);
  }

  removeDetailRow(detailRow: NegTableDetailRowComponent): void {
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
    this._removePlugin(this.table);
  }

  /** @internal */
  detailRowToggled(event: NegDetailsRowToggleEvent<T>): void {
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
    const table = this.table;
    const cdkTable = table._cdkTable;
    if (this._detailRowDef) {
      cdkTable.removeRowDef(this._detailRowDef);
      this._detailRowDef = undefined;
    }
    if (this.detailRow) {
      let detailRow = table.registry.getSingle('detailRowParent');
      if (detailRow) {
        this._detailRowDef = detailRow = detailRow.clone();
        Object.defineProperty(detailRow, 'columns', { enumerable: true,  get: () => table.columnApi.visibleColumnIds });
        Object.defineProperty(detailRow, 'when', { enumerable: true,  get: () => this._isDetailRow });
        detailRow.ngOnChanges({ columns: { isFirstChange: () => true, firstChange: true, currentValue: detailRow.columns, previousValue: null }});
      } else if (!this._defaultParentRef) {
        // TODO: move to module? set in root registry? put elsewhere to avoid table sync (see event of registry change)...
        this._defaultParentRef = this.injector.get(ComponentFactoryResolver)
          .resolveComponentFactory(NegTableDefaultDetailRowParentComponent)
          .create(this.injector);
        this._defaultParentRef.changeDetectorRef.detectChanges();
        return;
      }
    }
    this.resetTableRowDefs();
  }

  private resetTableRowDefs(): void {
    const table = this.table;
    if (this._detailRowDef) {
      this._detailRow === false
        ? table._cdkTable.removeRowDef(this._detailRowDef)
        : table._cdkTable.addRowDef(this._detailRowDef)
      ;
    }
  }

  /**
   * Update the table with detail row infor.
   * Instead of calling for a change detection cycle we can assign the new predicates directly to the cdkRowDef instances.
   */
  private updateTable(): void {
    this.table._tableRowDef.when = this._isSimpleRow;
    this.setupDetailRowParent();
    // Once we changed the `when` predicate on the `CdkRowDef` we must:
    //   1. Update the row cache (property `rowDefs`) to reflect the new change
    this.table._cdkTable.updateRowDefCache();

    //   2. re-render all rows.
    // The logic for re-rendering all rows is handled in `CdkTable._forceRenderDataRows()` which is a private method.
    // This is a workaround, assignin to `multiTemplateDataRows` will invoke the setter which
    // also calls `CdkTable._forceRenderDataRows()`
    // TODO: This is risky, the setter logic might change.
    // for example, if material will chack for change in `multiTemplateDataRows` setter from previous value...
    this.table._cdkTable.multiTemplateDataRows = !!this._detailRow;
  }
}
