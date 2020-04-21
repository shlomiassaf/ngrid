import { NgModule, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule, MatSortHeader } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

import { PblNgridModule, PblNgridRegistryService, ngridPlugin } from '@pebula/ngrid';
import { PblNgridMatSortDirective, PLUGIN_KEY } from './mat-sort.directive';
import { MatSortExtension } from './mat-sort-component-extension';

@NgModule({
  imports: [ CommonModule, MatButtonModule, MatSortModule, PblNgridModule ],
  declarations: [ PblNgridMatSortDirective ],
  exports: [ PblNgridMatSortDirective, MatSortModule ],
  // TODO: remove when ViewEngine is no longer supported by angular (V11 ???)
  entryComponents: [ MatSortHeader ],
})
export class PblNgridMatSortModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY }, PblNgridMatSortDirective);

  constructor(private registry: PblNgridRegistryService, cfr: ComponentFactoryResolver) {
    registry.addMulti('dataHeaderExtensions', new MatSortExtension(cfr));
  }
}
