import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { ExampleCommonModule } from '../../../example-common';
import { ColumnsSimpleModelExample } from './simple-model.component';

@NgModule({
  declarations: [ ColumnsSimpleModelExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ ColumnsSimpleModelExample ],
  entryComponents: [ ColumnsSimpleModelExample ],
})
export class ColumnsSimpleModelExampleModule { }
