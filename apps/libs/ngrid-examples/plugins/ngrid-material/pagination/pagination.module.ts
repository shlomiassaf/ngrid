import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { PaginationExample } from './pagination.component';
import { AsyncPageNumberExample } from './async-page-number.component';
import { AsyncTokenExample } from './async-token.component';

@NgModule({
  declarations: [ PaginationExample, AsyncPageNumberExample, AsyncTokenExample ],
  imports: [
    CommonModule,
    MatButtonModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule, PblNgridPaginatorModule,
  ],
  exports: [ PaginationExample, AsyncPageNumberExample, AsyncTokenExample ],
})
@BindNgModule(PaginationExample, AsyncPageNumberExample, AsyncTokenExample)
export class PaginationExampleModule { }
