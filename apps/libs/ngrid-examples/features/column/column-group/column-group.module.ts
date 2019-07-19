import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { ColumnGroupExample } from './column-group.component';
import { MultiHeaderColumnGroupExample } from './multi-header-column-group.component';

const COMPONENTS = [ ColumnGroupExample, MultiHeaderColumnGroupExample ];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
})
export class ColumnGroupExampleModule { }
