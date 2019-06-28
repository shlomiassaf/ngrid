import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { ExampleCommonModule } from '../../../example-common';
import { ColumnsFactoryExample } from './factory.component';

@NgModule({
  declarations: [ ColumnsFactoryExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ ColumnsFactoryExample ],
  entryComponents: [ ColumnsFactoryExample ],
})
export class ColumnsFactoryExampleModule { }
