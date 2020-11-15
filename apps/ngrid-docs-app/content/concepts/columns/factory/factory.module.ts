import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { ColumnsFactoryExample } from './factory.component';

@NgModule({
  declarations: [ ColumnsFactoryExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ ColumnsFactoryExample ],
})
@BindNgModule(ColumnsFactoryExample)
export class ColumnsFactoryExampleModule { }

