import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { CustomRowExample } from './custom-row.component';

@NgModule({
  declarations: [ CustomRowExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ CustomRowExample ],
})
@BindNgModule(CustomRowExample)
export class CustomRowExampleModule { }
