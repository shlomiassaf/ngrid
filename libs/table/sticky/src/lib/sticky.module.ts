import { Subscription } from 'rxjs';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { SgTableModule, SgTablePluginController, SgTableConfigService } from '@sac/table';
import { SgTableStickyPluginDirective, setStickyRow, setStickyColumns } from './sticky/sticky-plugin';

declare module '@sac/table/lib/table/services/config' {
  interface SgTableConfig {
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
  imports: [ CommonModule, CdkTableModule, SgTableModule ],
  declarations: [ SgTableStickyPluginDirective ],
  exports: [ SgTableStickyPluginDirective ],
})
export class SgTableStickyModule {
  constructor(@Optional() @SkipSelf() parentModule: SgTableStickyModule,
  configService: SgTableConfigService) {
    if (parentModule) {
      return;
    }

    SgTablePluginController.created
      .subscribe( event => {
        const { table, controller } = event;
        if (controller && !controller.hasPlugin('sticky')) {
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
        }
      });
  }
}
