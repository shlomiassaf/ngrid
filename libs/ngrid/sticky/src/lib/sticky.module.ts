import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { PblNgridModule, PblNgridPluginController, PblNgridConfigService, ngridPlugin } from '@pebula/ngrid';
import { PblNgridStickyPluginDirective, setStickyRow, setStickyColumns, PLUGIN_KEY } from './sticky/sticky-plugin';

declare module '@pebula/ngrid/lib/grid/services/config' {
  interface PblNgridConfig {
    stickyPlugin?: {
      headers?: Array<'table' | number>;
      footers?: Array<'table' | number>;
      columnStart?: Array<string | number>;
      columnEnd?: Array<string | number>;
    }
  }
}

const MAPPER = <T>(v: T): [T, boolean] => [v, true];

@NgModule({
  imports: [ CommonModule, CdkTableModule, PblNgridModule ],
  declarations: [ PblNgridStickyPluginDirective ],
  exports: [ PblNgridStickyPluginDirective ],
})
export class PblNgridStickyModule {

  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY }, PblNgridStickyPluginDirective);

  constructor(configService: PblNgridConfigService) {
    PblNgridPluginController.onCreatedSafe(
      PblNgridStickyModule,
      (grid, controller) => {
        if (controller && !controller.hasPlugin('sticky')) {
          controller.onInit()
            .subscribe(() => {
              const stickyPluginConfig = configService.get('stickyPlugin');
              if (stickyPluginConfig) {
                if (stickyPluginConfig.headers) {
                  setStickyRow(grid, 'header', stickyPluginConfig.headers.map(MAPPER));
                }
                if (stickyPluginConfig.footers) {
                  setStickyRow(grid, 'footer', stickyPluginConfig.footers.map(MAPPER));
                }
                if (stickyPluginConfig.columnStart) {
                  setStickyColumns(grid, 'start', stickyPluginConfig.columnStart.map(MAPPER));
                }
                if (stickyPluginConfig.columnEnd) {
                  setStickyColumns(grid, 'end', stickyPluginConfig.columnEnd.map(MAPPER));
                }
              }
            });
        }
      },
    );
  }
}
