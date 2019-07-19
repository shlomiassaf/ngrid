import { NgModule } from '@angular/core';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { ReuseExample } from './reuse.component';

const COMPONENTS = [ ReuseExample ];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    ExampleCommonModule,
    PblNgridModule, PblNgridPaginatorModule, PblNgridBlockUiModule,
  ],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
})
export class ReuseExampleModule { }
