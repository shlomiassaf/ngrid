import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';
import { PblNgridMatSortModule } from '@pebula/ngrid-material/sort';
import { ContextExampleExample } from './context-example.component';

@NgModule({
  declarations: [ ContextExampleExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule, PblNgridTargetEventsModule, PblNgridPaginatorModule, PblNgridMatSortModule,
  ],
  exports: [ ContextExampleExample ],
})
@BindNgModule(ContextExampleExample)
export class ContextExampleExampleModule { }
