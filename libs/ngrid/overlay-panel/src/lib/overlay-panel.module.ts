import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';

import { PblNgridOverlayPanelFactory } from './overlay-panel.service';
import { PblNgridOverlayPanelDef } from './overlay-panel-def';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    BidiModule,
  ],
  declarations: [
    PblNgridOverlayPanelDef,
  ],
  exports: [
    PblNgridOverlayPanelDef,
  ],
  providers: [
    PblNgridOverlayPanelFactory,
  ],
})
export class PblNgridOverlayPanelModule {

}
