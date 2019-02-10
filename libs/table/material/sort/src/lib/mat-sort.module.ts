import { NgModule, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule, MatSortHeader } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

import { NegTableModule, NegTableRegistryService } from '@pebula/table';
import { NegTableMatSortDirective } from './mat-sort.directive';
import { MatSortExtension } from './mat-sort-component-extension';

@NgModule({
  imports: [ CommonModule, MatButtonModule, MatSortModule, NegTableModule ],
  declarations: [ NegTableMatSortDirective ],
  exports: [ NegTableMatSortDirective, MatSortModule ],
  entryComponents: [ MatSortHeader ],
})
export class NegTableMatSortModule {
  constructor(private registry: NegTableRegistryService, cfr: ComponentFactoryResolver) {
    registry.addMulti('dataHeaderExtensions', new MatSortExtension(cfr));
  }
}
