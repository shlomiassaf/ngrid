import { NgModule, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule, MatSortHeader } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

import { PblTableModule, PblTableRegistryService } from '@pebula/table';
import { PblTableMatSortDirective } from './mat-sort.directive';
import { MatSortExtension } from './mat-sort-component-extension';

@NgModule({
  imports: [ CommonModule, MatButtonModule, MatSortModule, PblTableModule ],
  declarations: [ PblTableMatSortDirective ],
  exports: [ PblTableMatSortDirective, MatSortModule ],
  entryComponents: [ MatSortHeader ],
})
export class PblTableMatSortModule {
  constructor(private registry: PblTableRegistryService, cfr: ComponentFactoryResolver) {
    registry.addMulti('dataHeaderExtensions', new MatSortExtension(cfr));
  }
}
