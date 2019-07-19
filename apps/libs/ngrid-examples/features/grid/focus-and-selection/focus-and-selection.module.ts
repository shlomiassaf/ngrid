import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { FocusAndSelectionExample } from './focus-and-selection.component';

const COMPONENTS = [ FocusAndSelectionExample ];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    MatButtonModule, MatFormFieldModule, MatSelectModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule,
  ],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
})
export class FocusAndSelectionExampleModule { }
