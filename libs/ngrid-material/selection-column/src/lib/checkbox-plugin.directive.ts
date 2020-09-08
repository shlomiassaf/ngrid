import { Directive, Injector, Input, OnDestroy, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { PblNgridComponent, PblNgridPluginController } from '@pebula/ngrid';

import { PblNgridCheckboxComponent } from './table-checkbox.component';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    matCheckboxSelection?: PblNgridMatCheckboxSelectionDirective;
  }
}

export const PLUGIN_KEY: 'matCheckboxSelection' = 'matCheckboxSelection';

@Directive({ selector: 'pbl-ngrid[matCheckboxSelection]' })
export class PblNgridMatCheckboxSelectionDirective implements OnDestroy {

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
  @Input() get matCheckboxSelection(): string { return this._name; }
  set matCheckboxSelection(value: string ) {
    if (value !== this._name) {
      this._name = value;
      if (!value) {
        if (this.cmpRef) {
          this.cmpRef.destroy();
          this.cmpRef = undefined;
        }
      } else {
        if (!this.cmpRef) {
          this.cmpRef = this.cfr.resolveComponentFactory(PblNgridCheckboxComponent).create(this.injector);
          this.cmpRef.instance.table = this.table;
          if (this._bulkSelectMode) {
            this.cmpRef.instance.bulkSelectMode = this._bulkSelectMode;
          }
          this.cmpRef.instance.color = this._color;
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

  @Input() get matCheckboxSelectionColor(): ThemePalette { return this._color; }
  set matCheckboxSelectionColor(value: ThemePalette) {
    if (value !== this._color) {
      this._color = value;
      if (this.cmpRef) {
        this.cmpRef.instance.color = value;
      }
    }
  }

  private _name: string;
  private _bulkSelectMode: 'all' | 'view' | 'none';
  private _color: ThemePalette = 'primary';
  private cmpRef: ComponentRef<PblNgridCheckboxComponent>;
  private _removePlugin: (table: PblNgridComponent<any>) => void;
  private _isCheckboxDisabled: (row: any) => boolean;

  constructor(private table: PblNgridComponent<any>,
              private cfr: ComponentFactoryResolver,
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
