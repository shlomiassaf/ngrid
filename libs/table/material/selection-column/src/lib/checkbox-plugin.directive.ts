import { Directive, Injector, Input, OnDestroy, ComponentFactoryResolver, ComponentRef } from '@angular/core';

import { SgTableComponent, SgTablePluginController, TablePlugin, KillOnDestroy } from '@sac/table';

import { SgTableCheckboxComponent } from './table-checkbox.component';

declare module '@sac/table/lib/ext/types' {
  interface SgTablePluginExtension {
    matCheckboxSelection?: SgTableMatCheckboxSelectionDirective;
  }
}

const PLUGIN_KEY: 'matCheckboxSelection' = 'matCheckboxSelection';

@TablePlugin({ id: PLUGIN_KEY })
@Directive({ selector: 'sg-table[matCheckboxSelection]' })
@KillOnDestroy()
export class SgTableMatCheckboxSelectionDirective implements OnDestroy {
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
          this.cmpRef = this.cfr.resolveComponentFactory(SgTableCheckboxComponent).create(this.injector);
          this.cmpRef.instance.table = this.table;
        }
        this.cmpRef.instance.name = value;
        this.cmpRef.changeDetectorRef.detectChanges();
      }
    }
  }
  private _name: string;
  private cmpRef: ComponentRef<SgTableCheckboxComponent>;
  private _removePlugin: (table: SgTableComponent<any>) => void;

  constructor(private table: SgTableComponent<any>,
              private cfr: ComponentFactoryResolver,
              private injector: Injector,
              pluginCtrl: SgTablePluginController) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);
  }

  ngOnDestroy() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
    this._removePlugin(this.table);
  }
}
