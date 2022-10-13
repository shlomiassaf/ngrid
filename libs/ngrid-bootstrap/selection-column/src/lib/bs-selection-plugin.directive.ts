import { Directive, Injector, Input, OnDestroy, ComponentRef, EnvironmentInjector, createComponent } from '@angular/core';

import { PblNgridComponent, PblNgridPluginController } from '@pebula/ngrid';

import { PblNgridBsSelectionComponent } from './bs-selection.component';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    bsSelectionColumn?: PblNgridBsSelectionPlugin;
  }
}

export const PLUGIN_KEY: 'bsSelectionColumn' = 'bsSelectionColumn';

@Directive({ selector: 'pbl-ngrid[bsSelectionColumn]' })
export class PblNgridBsSelectionPlugin implements OnDestroy {

  @Input() get isCheckboxDisabled() { return this._isCheckboxDisabled; }
  set isCheckboxDisabled(value: (row: any) => boolean ) {
    if (value !== this._isCheckboxDisabled) {
      this._isCheckboxDisabled = value;
      if (this.cmpRef && value) {
        this.cmpRef.instance.isCheckboxDisabled = value;
        this.cmpRef.changeDetectorRef.detectChanges();
      }
    }
  }

  /**
   * Add's a selection column using material's `mat-checkbox` in the column specified.
   */
  @Input() get bsSelectionColumn(): string { return this._name; }
  set bsSelectionColumn(value: string ) {
    if (value !== this._name) {
      this._name = value;
      if (!value) {
        if (this.cmpRef) {
          this.cmpRef.destroy();
          this.cmpRef = undefined;
        }
      } else {
        if (!this.cmpRef) {
          this.cmpRef = createComponent(PblNgridBsSelectionComponent, { environmentInjector: this.injector.get(EnvironmentInjector), elementInjector: this.injector });
          this.cmpRef.instance.table = this.table;
          if (this._bulkSelectMode) {
            this.cmpRef.instance.bulkSelectMode = this._bulkSelectMode;
          }
          this.cmpRef.instance.selectionClass = this._selectionClass;
        }
        if (this.isCheckboxDisabled) {
          this.cmpRef.instance.isCheckboxDisabled = this.isCheckboxDisabled;
        }
        this.cmpRef.instance.name = value;
        this.cmpRef.changeDetectorRef.detectChanges();
      }
    }
  }

  /**
   * Defines the behavior when clicking on the bulk select checkbox (header).
   * There are 2 options:
   *
   * - all: Will select all items in the current collection
   * - view: Will select only the rendered items in the view
   *
   * The default value is `all`
   */
  @Input() get bulkSelectMode(): 'all' | 'view' | 'none' { return this._bulkSelectMode; }
  set bulkSelectMode(value: 'all' | 'view' | 'none') {
    if (value !== this._bulkSelectMode) {
      this._bulkSelectMode = value;
      if (this.cmpRef) {
        this.cmpRef.instance.bulkSelectMode = value;
      }
    }
  }

  @Input() get bsSelectionClass(): string { return this._selectionClass; }
  set matCheckboxSelectionColor(value: string) {
    if (value !== this._selectionClass) {
      this._selectionClass = value;
      if (this.cmpRef) {
        this.cmpRef.instance.selectionClass = value;
      }
    }
  }

  private _name: string;
  private _bulkSelectMode: 'all' | 'view' | 'none';
  private _selectionClass: string = '';
  private cmpRef: ComponentRef<PblNgridBsSelectionComponent>;
  private _removePlugin: (table: PblNgridComponent<any>) => void;
  private _isCheckboxDisabled: (row: any) => boolean;

  constructor(private table: PblNgridComponent<any>,
              private injector: Injector,
              pluginCtrl: PblNgridPluginController) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);
  }

  ngOnDestroy() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
    this._removePlugin(this.table);
  }
}
