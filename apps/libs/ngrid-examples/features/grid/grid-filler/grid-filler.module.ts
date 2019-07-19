import { NgModule } from '@angular/core';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { GridFillerExample } from './grid-filler.component';
import { GridFillerFixedVirtualScrollExample } from './grid-filler-fixed-virtual-scroll.component';
import { GridFillerDisabledExample } from './grid-filler-disabled.component';
import { GridFillerNoVirtualScrollExample } from './grid-filler-no-virtual-scroll.component';

@NgModule({
  declarations: [ GridFillerExample, GridFillerFixedVirtualScrollExample, GridFillerDisabledExample, GridFillerNoVirtualScrollExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule,
  ],
  exports: [ GridFillerExample, GridFillerFixedVirtualScrollExample, GridFillerDisabledExample, GridFillerNoVirtualScrollExample ],
  entryComponents: [ GridFillerExample, GridFillerFixedVirtualScrollExample, GridFillerDisabledExample, GridFillerNoVirtualScrollExample ],
})
export class GridFillerExampleModule { }
