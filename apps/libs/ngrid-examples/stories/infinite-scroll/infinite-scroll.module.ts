import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { InfiniteScrollExample } from './infinite-scroll.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [ InfiniteScrollExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    MatProgressBarModule,
    PblNgridModule,
  ],
  exports: [ InfiniteScrollExample ],
})
@BindNgModule(InfiniteScrollExample)
export class InfiniteScrollExampleModule { }
