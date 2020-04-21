import { filter, first } from 'rxjs/operators';
import { NgModule, Optional, SkipSelf } from '@angular/core';
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

  constructor(@Optional() @SkipSelf() parentModule: PblNgridStickyModule,
              configService: PblNgridConfigService) {
    if (parentModule) {
      return;
    }

    PblNgridPluginController.created
      .subscribe( event => {
        const { table, controller } = event;
        if (controller && !controller.hasPlugin('sticky')) {
          controller.events
            .pipe( filter( e => e.kind === 'onInit' ), first() )
            .subscribe( event => {
              const stickyPluginConfig = configService.get('stickyPlugin');
              if (stickyPluginConfig) {
                if (stickyPluginConfig.headers) {
                  setStickyRow(table, 'header', stickyPluginConfig.headers.map(MAPPER));
                }
                if (stickyPluginConfig.footers) {
                  setStickyRow(table, 'footer', stickyPluginConfig.footers.map(MAPPER));
                }
                if (stickyPluginConfig.columnStart) {
                  setStickyColumns(table, 'start', stickyPluginConfig.columnStart.map(MAPPER));
                }
                if (stickyPluginConfig.columnEnd) {
                  setStickyColumns(table, 'end', stickyPluginConfig.columnEnd.map(MAPPER));
                }
              }
            });
        }
      });
  }
}
