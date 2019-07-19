import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridOverlayPanelModule } from '@pebula/ngrid/overlay-panel';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { OverlayPanelExample } from './overlay-panel.component';

const COMPONENTS = [ OverlayPanelExample ];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    MatButtonModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridOverlayPanelModule,
  ],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
})
export class OverlayPanelExampleModule { }
