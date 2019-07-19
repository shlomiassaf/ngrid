import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { MultiColumnFilterExample } from './multi-column-filter.component';

const COMPONENTS = [ MultiColumnFilterExample ];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
})
export class MultiColumnFilterExampleModule { }
