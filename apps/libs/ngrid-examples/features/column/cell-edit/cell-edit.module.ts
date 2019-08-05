import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { CellEditExample } from './cell-edit.component';
import { CellEditGlobalTriggerExample } from './cell-edit-global-trigger.component';
import { CellEditDirectivesExample } from './cell-edit-directives.component';

const COMPONENTS = [ CellEditExample, CellEditGlobalTriggerExample, CellEditDirectivesExample ];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    FormsModule,
    ExampleCommonModule,
    MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule,
    PblNgridModule, PblNgridTargetEventsModule,
  ],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
})
export class CellEditExampleModule { }
