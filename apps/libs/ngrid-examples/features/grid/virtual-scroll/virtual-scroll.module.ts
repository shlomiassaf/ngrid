import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { VirtualScrollExample } from './virtual-scroll.component';
import { ScrollingStateExample } from './scrolling-state.component';

@NgModule({
  declarations: [ VirtualScrollExample, ScrollingStateExample ],
  imports: [
    CommonModule,
    MatRadioModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule,
  ],
  exports: [ VirtualScrollExample, ScrollingStateExample ],
})
@BindNgModule(VirtualScrollExample, ScrollingStateExample)
export class VirtualScrollExampleModule { }
