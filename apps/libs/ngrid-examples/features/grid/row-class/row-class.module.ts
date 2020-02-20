import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { RowClassExample } from './row-class.component';

@NgModule({
  declarations: [ RowClassExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ RowClassExample ],
})
@BindNgModule(RowClassExample)
export class RowClassExampleModule { }
