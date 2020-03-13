import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { ColumnWidthFeatureExample } from './column-width.component';
import { MinColumnWidthFeatureExample } from './min-column-width.component';

@NgModule({
  declarations: [ ColumnWidthFeatureExample, MinColumnWidthFeatureExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ ColumnWidthFeatureExample, MinColumnWidthFeatureExample ],
})
@BindNgModule(ColumnWidthFeatureExample, MinColumnWidthFeatureExample)
export class ColumnWidthFeatureExampleModule { }
