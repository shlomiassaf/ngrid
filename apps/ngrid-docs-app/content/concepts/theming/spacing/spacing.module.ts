import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag/';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { SpacingExample } from './spacing.component';

@NgModule({
  declarations: [ SpacingExample ],
  imports: [
    MatRadioModule,
    ExampleCommonModule,
    PblNgridModule,
    PblNgridDragModule,
  ],
  exports: [ SpacingExample ],
})
@BindNgModule(SpacingExample)
export class SpacingExampleModule { }
