import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridConfigService } from '@pebula/ngrid/core';
import { PblNgridPluginController, PblNgridModule, ngridPlugin } from '@pebula/ngrid';

import { registerBuiltInHandlers } from './core/built-in-handlers/_register';
import { PblNgridStatePlugin, PblNgridStatePluginDirective, PLUGIN_KEY } from './state-plugin';

@NgModule({
  imports: [
    CommonModule,
    PblNgridModule,
  ],
  declarations: [
    PblNgridStatePluginDirective,
  ],
  exports: [
    PblNgridStatePluginDirective,
  ],
  providers: [ ],
})
export class PblNgridStatePluginModule {

  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY, factory: 'create', runOnce: registerBuiltInHandlers }, PblNgridStatePlugin);

  constructor(configService: PblNgridConfigService) {
    PblNgridPluginController.onCreatedSafe(
      PblNgridStatePluginModule,
      (grid, controller) => {
        const targetEventsConfig = configService.get(PLUGIN_KEY);
        if (targetEventsConfig && targetEventsConfig.autoEnable === true) {
          controller.onInit()
            .subscribe(() => {
              if (!controller.hasPlugin(PLUGIN_KEY)) {
                const instance = controller.createPlugin(PLUGIN_KEY);
                if (targetEventsConfig.autoEnableOptions) {
                  instance.loadOptions = targetEventsConfig.autoEnableOptions.loadOptions;
                  instance.saveOptions = targetEventsConfig.autoEnableOptions.saveOptions;
                }
              }
            });
        }
      },
    );
  }
}
