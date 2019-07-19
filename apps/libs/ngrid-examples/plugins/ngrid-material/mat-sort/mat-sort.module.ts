import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { MatSortExample } from './mat-sort.component';

const COMPONENTS = [ MatSortExample ];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
})
export class MatSortExampleModule { }
