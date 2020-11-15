import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridOverlayPanelModule } from '@pebula/ngrid/overlay-panel';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { OverlayPanelExample } from './overlay-panel.component';

const COMPONENTS = [ OverlayPanelExample ];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    MatButtonModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridOverlayPanelModule,
  ],
  exports: COMPONENTS,
})
@BindNgModule(OverlayPanelExample)
export class OverlayPanelExampleModule { }
