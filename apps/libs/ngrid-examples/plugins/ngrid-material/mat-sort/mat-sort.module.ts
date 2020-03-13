import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridMatSortModule } from '@pebula/ngrid-material/sort';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { MatSortExample } from './mat-sort.component';
import { ActiveColumnAndDirectionExample } from './active-column-and-direction.component';
import { ProgrammaticExample } from './programmatic.component';

@NgModule({
  declarations: [ MatSortExample, ActiveColumnAndDirectionExample, ProgrammaticExample ],
  imports: [
    CommonModule,
    MatButtonModule, MatProgressSpinnerModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule, PblNgridPaginatorModule, PblNgridMatSortModule,
  ],
  exports: [ MatSortExample, ActiveColumnAndDirectionExample, ProgrammaticExample ],
})
@BindNgModule(MatSortExample, ActiveColumnAndDirectionExample, ProgrammaticExample)
export class MatSortExampleModule { }
