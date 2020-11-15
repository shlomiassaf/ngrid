import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { ColumnFilterExample } from './column-filter.component';

@NgModule({
  declarations: [ ColumnFilterExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ ColumnFilterExample ],
})
@BindNgModule(ColumnFilterExample)
export class ColumnFilterExampleModule { }
