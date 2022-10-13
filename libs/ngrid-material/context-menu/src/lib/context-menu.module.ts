import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PblNgridConfigService } from '@pebula/ngrid/core';
import { PblNgridRegistryService, PblNgridModule, ngridPlugin } from '@pebula/ngrid';
import { PblNgridOverlayPanelModule, PblNgridOverlayPanelComponentExtension } from '@pebula/ngrid/overlay-panel';

import { MatHeaderContextMenuTrigger } from './header-context/header-context-menu-trigger';
import { MatHeaderContextMenuExtension } from './header-context/header-context-menu-extension';
import { PblNgridMatHeaderContextMenuPlugin, PLUGIN_KEY } from './header-context/header-context-menu.directive';
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
    ]
})
export class PblNgridContextMenuModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY }, PblNgridMatHeaderContextMenuPlugin);

  constructor(@Optional() @SkipSelf() parentModule: PblNgridContextMenuModule,
              registry: PblNgridRegistryService,
              configService: PblNgridConfigService) {
    if (parentModule) {
      return;
    }
    registry.addMulti('dataHeaderExtensions', new MatHeaderContextMenuExtension());
    registry.addMulti('overlayPanels', new PblNgridOverlayPanelComponentExtension('excelMenu', MatExcelStyleHeaderMenu));
  }
}
