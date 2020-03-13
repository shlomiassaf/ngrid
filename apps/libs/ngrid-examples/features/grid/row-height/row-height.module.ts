import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { RowHeightExample } from './row-height.component';
import { UncontrolledRowHeightExample } from './uncontrolled-row-height.component';
import { ControlledRowHeightExample } from './controlled-row-height.component';

@NgModule({
  declarations: [ RowHeightExample, UncontrolledRowHeightExample, ControlledRowHeightExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ RowHeightExample, UncontrolledRowHeightExample, ControlledRowHeightExample ],
})
@BindNgModule(RowHeightExample, UncontrolledRowHeightExample, ControlledRowHeightExample)
export class RowHeightExampleModule { }
