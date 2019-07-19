import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { RowHeightExample } from './row-height.component';
import { UncontrolledRowHeightExample } from './uncontrolled-row-height.component';
import { ControlledRowHeightExample } from './controlled-row-height.component';

@NgModule({
  declarations: [ RowHeightExample, UncontrolledRowHeightExample, ControlledRowHeightExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ RowHeightExample, UncontrolledRowHeightExample, ControlledRowHeightExample ],
  entryComponents: [ RowHeightExample, UncontrolledRowHeightExample, ControlledRowHeightExample ],
})
export class RowHeightExampleModule { }
