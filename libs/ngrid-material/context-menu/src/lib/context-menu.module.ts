import { NgModule, Optional, SkipSelf, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PblNgridModule, PblNgridConfigService, PblNgridRegistryService } from '@pebula/ngrid';
import { PblNgridOverlayPanelModule, PblNgridOverlayPanelComponentExtension } from '@pebula/ngrid/overlay-panel';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';

import { MatHeaderContextMenuTrigger } from './header-context/header-context-menu-trigger';
import { MatHeaderContextMenuExtension } from './header-context/header-context-menu-extension';
import { PblNgridMatHeaderContextMenuPlugin } from './header-context/header-context-menu.directive';
import { MatExcelStyleHeaderMenu } from './header-context/styles/excel-style-header-menu';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    PblNgridModule,
    PblNgridOverlayPanelModule,
  ],
  declarations: [
    MatHeaderContextMenuTrigger,
    PblNgridMatHeaderContextMenuPlugin,
    MatExcelStyleHeaderMenu,
  ],
  exports: [
    PblNgridMatHeaderContextMenuPlugin,
  ],
  entryComponents: [
    // TODO: remove when ViewEngine is no longer supported by angular (V11 ???)
    MatHeaderContextMenuTrigger,
    MatExcelStyleHeaderMenu,
  ],
})
export class PblNgridContextMenuModule {
  constructor(@Optional() @SkipSelf() parentModule: PblNgridContextMenuModule,
              registry: PblNgridRegistryService,
              cfr: ComponentFactoryResolver,
              configService: PblNgridConfigService) {
    if (parentModule) {
      return;
    }
    registry.addMulti('dataHeaderExtensions', new MatHeaderContextMenuExtension(cfr));
    registry.addMulti('overlayPanels', new PblNgridOverlayPanelComponentExtension('excelMenu', MatExcelStyleHeaderMenu, cfr));
  }
}
