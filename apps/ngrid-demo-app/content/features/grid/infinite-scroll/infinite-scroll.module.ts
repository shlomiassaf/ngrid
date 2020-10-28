import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PblNgridInfiniteScrollModule } from '@pebula/ngrid/infinite-scroll';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { InfiniteScrollExample } from './infinite-scroll.component';
import { InfiniteScrollDataSourceExample } from './infinite-scroll-data-source.component';
import { IndexBasedPagingExample } from './index-based-paging.component';
import { CustomTriggersExample } from './custom-triggers.component';

@NgModule({
  declarations: [ InfiniteScrollExample, InfiniteScrollDataSourceExample, IndexBasedPagingExample, CustomTriggersExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    MatProgressBarModule,
    PblNgridModule, PblNgridTargetEventsModule, PblNgridInfiniteScrollModule,
  ],
  exports: [ InfiniteScrollExample, InfiniteScrollDataSourceExample, IndexBasedPagingExample, CustomTriggersExample ],
  entryComponents: [InfiniteScrollDataSourceExample, IndexBasedPagingExample],
})
@BindNgModule(InfiniteScrollExample, InfiniteScrollDataSourceExample, IndexBasedPagingExample, CustomTriggersExample)
export class InfiniteScrollExampleModule { }
