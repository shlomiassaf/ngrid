import { filter, first } from 'rxjs/operators';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { NegTableModule, NegTablePluginController, NegTableConfigService } from '@pebula/table';
import { NegTableStickyPluginDirective, setStickyRow, setStickyColumns } from './sticky/sticky-plugin';

declare module '@pebula/table/lib/table/services/config' {
  interface NegTableConfig {
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
  imports: [ CommonModule, CdkTableModule, NegTableModule ],
  declarations: [ NegTableStickyPluginDirective ],
  exports: [ NegTableStickyPluginDirective ],
})
export class NegTableStickyModule {
  constructor(@Optional() @SkipSelf() parentModule: NegTableStickyModule,
              configService: NegTableConfigService) {
    if (parentModule) {
      return;
    }

    NegTablePluginController.created
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
