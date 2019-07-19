import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { VirtualScrollExample } from './virtual-scroll.component';
import { ScrollingStateExample } from './scrolling-state.component';

@NgModule({
  declarations: [ VirtualScrollExample, ScrollingStateExample ],
  imports: [
    MatRadioModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule,
  ],
  exports: [ VirtualScrollExample, ScrollingStateExample ],
  entryComponents: [ VirtualScrollExample, ScrollingStateExample ],
})
export class VirtualScrollExampleModule { }
