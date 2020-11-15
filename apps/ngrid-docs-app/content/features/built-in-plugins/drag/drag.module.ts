import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
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
