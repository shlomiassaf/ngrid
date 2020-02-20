import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { HideColumnFeatureExample } from './hide-columns.component';
import { HideColumnWithGroupHeadersFeatureExample } from './hide-columns-with-group-headers.component';

@NgModule({
  declarations: [ HideColumnFeatureExample, HideColumnWithGroupHeadersFeatureExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    MatIconModule,
    MatSelectModule,
    PblNgridModule,
  ],
  exports: [ HideColumnFeatureExample, HideColumnWithGroupHeadersFeatureExample ],
})
@BindNgModule(HideColumnFeatureExample, HideColumnWithGroupHeadersFeatureExample)
export class HideColumnFeatureExampleModule { }
