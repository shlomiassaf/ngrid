import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { BlockUiExample } from './block-ui.component';
import { ManualExample } from './manual.component';

@NgModule({
  declarations: [ BlockUiExample, ManualExample ],
  imports: [
    MatButtonModule, MatProgressSpinnerModule, MatProgressBarModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule,
  ],
  exports: [ BlockUiExample, ManualExample ],
  entryComponents: [ BlockUiExample, ManualExample ],
})
export class BlockUiExampleModule { }
