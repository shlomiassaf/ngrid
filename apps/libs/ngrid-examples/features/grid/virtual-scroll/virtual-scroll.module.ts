import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { VirtualScrollExample } from './virtual-scroll.component';

const COMPONENTS = [ VirtualScrollExample ];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
})
export class VirtualScrollExampleModule { }
