import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';
import { MatButtonModule } from '@angular/material/button';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { SwitchingColumnDefinitionsExample } from './switching-column-definitions.component';

const COMPONENTS = [ SwitchingColumnDefinitionsExample ];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    ExampleCommonModule,
    MatButtonModule,
    PblNgridModule,
  ],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
})
export class SwitchingColumnDefinitionsExampleModule { }
