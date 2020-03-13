import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { ColumnsSimpleModelExample } from './simple-model.component';

@NgModule({
  declarations: [ ColumnsSimpleModelExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ ColumnsSimpleModelExample ],
})
@BindNgModule(ColumnsSimpleModelExample)
export class ColumnsSimpleModelExampleModule { }
