import { first, filter } from 'rxjs/operators';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PblNgridModule, PblNgridConfigService, PblNgridPluginController, ngridPlugin } from '@pebula/ngrid';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';

import { PLUGIN_KEY, PblNgridClipboardPlugin } from './clipboard.plugin';

@NgModule({
  imports: [ CommonModule, PblNgridModule, PblNgridTargetEventsModule ],
  declarations: [ PblNgridClipboardPlugin ],
  exports: [ PblNgridClipboardPlugin ],
})
export class PblNgridClipboardPluginModule {

  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY, factory: 'create' }, PblNgridClipboardPlugin);

  constructor(@Optional() @SkipSelf() parentModule: PblNgridClipboardPluginModule,
              configService: PblNgridConfigService) {

    if (parentModule) {
      return;
    }
    PblNgridPluginController.created
      .subscribe( event => {
        const config = configService.get(PLUGIN_KEY, {});
        if (config.autoEnable === true) {
          const pluginCtrl = event.controller;
          pluginCtrl.events
            .pipe(
              filter( e => e.kind === 'onInit' ),
              first(),
            )
            .subscribe( e => {
              if (!pluginCtrl.hasPlugin(PLUGIN_KEY)) {
                pluginCtrl.createPlugin(PLUGIN_KEY);
              }
            });
        }
      });
  }
}
