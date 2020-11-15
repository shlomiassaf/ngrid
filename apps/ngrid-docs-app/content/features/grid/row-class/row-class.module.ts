import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
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
