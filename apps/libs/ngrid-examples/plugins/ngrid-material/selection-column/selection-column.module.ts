import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridStickyModule } from '@pebula/ngrid/sticky';
import { PblNgridCheckboxModule } from '@pebula/ngrid-material/selection-column';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { SelectionColumnExample } from './selection-column.component';
import { BulkModeAndVirtualScrollExample } from './bulk-mode-and-virtual-scroll.component';

@NgModule({
  declarations: [ SelectionColumnExample, BulkModeAndVirtualScrollExample ],
  imports: [
    MatButtonToggleModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule, PblNgridStickyModule, PblNgridCheckboxModule,
  ],
  exports: [ SelectionColumnExample, BulkModeAndVirtualScrollExample ],
  entryComponents: [ SelectionColumnExample, BulkModeAndVirtualScrollExample ],
})
export class SelectionColumnExampleModule { }
