import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { SgTableModule, SgTableExternalPluginService, SgTableConfigService } from '@sac/table';
import { SgTableStickyPluginDirective, setStickyRow, setStickyColumns, hasStickyPlugin } from './sticky/sticky-plugin';

declare module '@sac/table/src/lib/table/services/config' {
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
              extPlugins: SgTableExternalPluginService,
              config: SgTableConfigService) {
    if (parentModule) {
      return;
    }
    const stickyPluginConfig = config.get('stickyPlugin');
    if (stickyPluginConfig) {
      extPlugins.onNewTable.subscribe( table => {
        if (!hasStickyPlugin(table)) {

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
  }
}
