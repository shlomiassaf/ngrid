import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { PblNgridModule } from '@pebula/ngrid';

import { ExampleCommonModule } from '../../../example-common';
import { HideColumnFeatureExample } from './hide-columns.component';
import { HideColumnWithGroupHeadersFeatureExample } from './hide-columns-with-group-headers.component';

const COMPONENTS = [ HideColumnFeatureExample, HideColumnWithGroupHeadersFeatureExample ];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    ExampleCommonModule,
    MatIconModule,
    MatSelectModule,
    PblNgridModule,
  ],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
})
export class HideColumnFeatureExampleModule { }
