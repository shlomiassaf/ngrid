import { Directive, Injector, Input, OnDestroy, ComponentFactoryResolver, ComponentRef } from '@angular/core';

import { SgTableComponent, KillOnDestroy } from '@sac/table';
import { SgTableCheckboxComponent } from './table-checkbox.component';

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

  constructor(private table: SgTableComponent<any>, private cfr: ComponentFactoryResolver, private injector: Injector) { }

  ngOnDestroy() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
  }
}
