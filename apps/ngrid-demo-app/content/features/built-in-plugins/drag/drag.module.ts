import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { DragExample } from './drag.component';

@NgModule({
  declarations: [ DragExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ DragExample ],
})
@BindNgModule(DragExample)
export class DragExampleModule { }
