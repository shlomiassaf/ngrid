import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { RowOrderingExample } from './row-ordering.component';

@NgModule({
  declarations: [ RowOrderingExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
    PblNgridDragModule.withDefaultTemplates(),
  ],
  exports: [ RowOrderingExample ],
})
@BindNgModule(RowOrderingExample)
export class RowOrderingExampleModule { }
