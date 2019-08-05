import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { ColumnSortExample } from './column-sort.component';

@NgModule({
  declarations: [ ColumnSortExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ ColumnSortExample ],
  entryComponents: [ ColumnSortExample ],
})
@BindNgModule(ColumnSortExample)
export class ColumnSortExampleModule { }
