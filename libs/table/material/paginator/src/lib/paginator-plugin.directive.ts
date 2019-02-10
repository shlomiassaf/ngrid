import { Directive, Injector, Input, OnDestroy, ComponentFactoryResolver, ComponentRef, DoCheck } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { PblTableComponent, PblTablePluginController, TablePlugin } from '@pebula/table';

import { PblPaginatorComponent } from './table-paginator.component';

declare module '@pebula/table/lib/ext/types' {
  interface PblTablePluginExtension {
    matPaginator?: PblTableMatPaginatorDirective;
  }
}

const PLUGIN_KEY: 'matPaginator' = 'matPaginator';

@TablePlugin({ id: PLUGIN_KEY })
@Directive({ selector: 'pbl-ngrid[matPaginator]' })
export class PblTableMatPaginatorDirective implements OnDestroy, DoCheck {
  /**
   * Add's a selection column using material's `mat-checkbox` in the column specified.
   */
  @Input() get matPaginator(): boolean { return this._enabled; }
  set matPaginator(value: boolean ) {
    value = coerceBooleanProperty(value);
    if (value !== this._enabled) {
      this._enabled = value;
      if (!value) {
        if (this.cmpRef) {
          this.cmpRef.destroy();
          this.cmpRef = undefined;
        }
        this.ngDoCheck = PblTableMatPaginatorDirective.prototype.ngDoCheck;
      } else {
        if (!this.cmpRef) {
          this.cmpRef = this.cfr.resolveComponentFactory(PblPaginatorComponent).create(this.injector);
          this.instance = this.cmpRef.instance;
          this.instance.table = this.table;
        }
        const ngDoCheck = () => {
          if (this.instance.paginator !== (this.table.ds && this.table.ds.paginator)) {
            this.instance.paginator = this.table.ds.paginator;
          }
        };
        this.ngDoCheck = ngDoCheck;
        ngDoCheck();
        this.cmpRef.changeDetectorRef.detectChanges();
      }
    }
  }
  private _enabled: boolean;
  private cmpRef: ComponentRef<PblPaginatorComponent>;
  private instance: PblPaginatorComponent;
  private _removePlugin: (table: PblTableComponent<any>) => void;

  constructor(private table: PblTableComponent<any>,
              private cfr: ComponentFactoryResolver,
              private injector: Injector,
              pluginCtrl: PblTablePluginController) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);
  }

  ngDoCheck(): void { }

  ngOnDestroy() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
    this._removePlugin(this.table);
  }

  private setPaginator(): void {
    if (this.table.ds) {
      this.instance.paginator = this.table.ds.paginator;
    }
  }
}
