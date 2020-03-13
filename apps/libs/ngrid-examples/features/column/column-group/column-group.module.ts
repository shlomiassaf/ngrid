import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { ColumnGroupExample } from './column-group.component';
import { MultiHeaderColumnGroupExample } from './multi-header-column-group.component';

@NgModule({
  declarations: [ ColumnGroupExample, MultiHeaderColumnGroupExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ ColumnGroupExample, MultiHeaderColumnGroupExample ],
})
@BindNgModule(ColumnGroupExample, MultiHeaderColumnGroupExample)
export class ColumnGroupExampleModule { }
