import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { ExampleCommonModule } from '../../../example-common';
import { ColumnWidthFeatureExample } from './column-width.component';
import { MinColumnWidthFeatureExample } from './min-column-width.component';
import { MaxColumnWidthFeatureExample } from './max-column-width.component';

const COMPONENTS = [ ColumnWidthFeatureExample, MinColumnWidthFeatureExample, MaxColumnWidthFeatureExample ];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
})
export class ColumnWidthFeatureExampleModule { }
