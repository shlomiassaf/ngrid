import { NgModule } from '@angular/core';
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

  constructor(configService: PblNgridConfigService) {
    PblNgridPluginController.onCreatedSafe(
      PblNgridClipboardPluginModule,
      (grid, controller) => {
        const config = configService.get(PLUGIN_KEY, {});
        if (config.autoEnable === true) {
          controller.onInit()
            .subscribe(() => {
              if (!controller.hasPlugin(PLUGIN_KEY)) {
                controller.createPlugin(PLUGIN_KEY);
              }
            });
        }
      },
    );
  }
}
