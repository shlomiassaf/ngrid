import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { BlockUiExample } from './block-ui.component';

const COMPONENTS = [ BlockUiExample ];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
})
export class BlockUiExampleModule { }
