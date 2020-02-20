import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { GridFillerExample } from './grid-filler.component';
import { GridFillerFixedVirtualScrollExample } from './grid-filler-fixed-virtual-scroll.component';
import { GridFillerDisabledExample } from './grid-filler-disabled.component';
import { GridFillerNoVirtualScrollExample } from './grid-filler-no-virtual-scroll.component';

@NgModule({
  declarations: [ GridFillerExample, GridFillerFixedVirtualScrollExample, GridFillerDisabledExample, GridFillerNoVirtualScrollExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule,
  ],
  exports: [ GridFillerExample, GridFillerFixedVirtualScrollExample, GridFillerDisabledExample, GridFillerNoVirtualScrollExample ],
})
@BindNgModule(GridFillerExample, GridFillerFixedVirtualScrollExample, GridFillerDisabledExample, GridFillerNoVirtualScrollExample)
export class GridFillerExampleModule { }
