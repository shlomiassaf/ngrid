import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridMatSortModule } from '@pebula/ngrid-material/sort';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { MatSortExample } from './mat-sort.component';
import { ActiveColumnAndDirectionExample } from './active-column-and-direction.component';
import { ProgrammaticExample } from './programmatic.component';

@NgModule({
  declarations: [ MatSortExample, ActiveColumnAndDirectionExample, ProgrammaticExample ],
  imports: [
    MatButtonModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule, PblNgridPaginatorModule, PblNgridMatSortModule,
  ],
  exports: [ MatSortExample, ActiveColumnAndDirectionExample, ProgrammaticExample ],
  entryComponents: [ MatSortExample, ActiveColumnAndDirectionExample, ProgrammaticExample ],
})
export class MatSortExampleModule { }
