import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { ReuseExample } from './reuse.component';

@NgModule({
  declarations: [ ReuseExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridPaginatorModule, PblNgridBlockUiModule,
  ],
  exports: [ ReuseExample ],
})
@BindNgModule(ReuseExample)
export class ReuseExampleModule { }
