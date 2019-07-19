import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridStatePluginModule } from '@pebula/ngrid/state';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { StatePersistenceExample } from './state-persistence.component';

@NgModule({
  declarations: [ StatePersistenceExample ],
  imports: [
    MatButtonModule, MatSliderModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridStatePluginModule,
  ],
  exports: [ StatePersistenceExample ],
  entryComponents: [ StatePersistenceExample ],
})
export class StatePersistenceExampleModule { }
