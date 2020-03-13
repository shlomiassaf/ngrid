import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridOverlayPanelModule } from '@pebula/ngrid/overlay-panel';
import { PblNgridContextMenuModule } from '@pebula/ngrid-material/context-menu';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { ContextMenuExample } from './context-menu.component';
import { CustomHeaderExample } from './custom-header.component';

@NgModule({
  declarations: [ ContextMenuExample, CustomHeaderExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridOverlayPanelModule, PblNgridContextMenuModule,
  ],
  exports: [ ContextMenuExample, CustomHeaderExample ],
})
@BindNgModule(ContextMenuExample, CustomHeaderExample)
export class ContextMenuExampleModule { }
