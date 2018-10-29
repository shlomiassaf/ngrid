import { Directive, Injector, Input, OnDestroy, ComponentFactoryResolver, ComponentRef, DoCheck } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NegTableComponent, NegTablePluginController, TablePlugin } from '@neg/table';

import { NegPaginatorComponent } from './table-paginator.component';

declare module '@neg/table/lib/ext/types' {
  interface NegTablePluginExtension {
    matPaginator?: NegTableMatPaginatorDirective;
  }
}

const PLUGIN_KEY: 'matPaginator' = 'matPaginator';

@TablePlugin({ id: PLUGIN_KEY })
@Directive({ selector: 'neg-table[matPaginator]' })
export class NegTableMatPaginatorDirective implements OnDestroy, DoCheck {
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
        this.ngDoCheck = NegTableMatPaginatorDirective.prototype.ngDoCheck;
      } else {
        if (!this.cmpRef) {
          this.cmpRef = this.cfr.resolveComponentFactory(NegPaginatorComponent).create(this.injector);
          this.instance = this.cmpRef.instance;
          this.instance.table = this.table;
        }
        const ngDoCheck = () => {
          if (this.instance.paginator !== (this.table.dataSource && this.table.dataSource.paginator)) {
            this.instance.paginator = this.table.dataSource.paginator;
          }
        };
        this.ngDoCheck = ngDoCheck;
        ngDoCheck();
        this.cmpRef.changeDetectorRef.detectChanges();
      }
    }
  }
  private _enabled: boolean;
  private cmpRef: ComponentRef<NegPaginatorComponent>;
  private instance: NegPaginatorComponent;
  private _removePlugin: (table: NegTableComponent<any>) => void;

  constructor(private table: NegTableComponent<any>,
              private cfr: ComponentFactoryResolver,
              private injector: Injector,
              pluginCtrl: NegTablePluginController) {
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
    if (this.table.dataSource) {
      this.instance.paginator = this.table.dataSource.paginator;
    }
  }
}
