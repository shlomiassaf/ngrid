import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridPluginController, PblNgridModule, PblNgridConfigService, ngridPlugin } from '@pebula/ngrid';

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

  constructor(@Optional() @SkipSelf() parentModule: PblNgridStatePluginModule,
              configService: PblNgridConfigService) {

  if (parentModule) {
    return;
  }

  PblNgridPluginController.created
    .subscribe( event => {
      const targetEventsConfig = configService.get(PLUGIN_KEY);
      if (targetEventsConfig && targetEventsConfig.autoEnable === true) {
        const pluginCtrl = event.controller;
        let subscription = pluginCtrl.events
          .subscribe( evt => {
            if (evt.kind === 'onInit') {
              if (!pluginCtrl.hasPlugin(PLUGIN_KEY)) {
                const instance = pluginCtrl.createPlugin(PLUGIN_KEY);
                if (targetEventsConfig.autoEnableOptions) {
                  instance.loadOptions = targetEventsConfig.autoEnableOptions.loadOptions;
                  instance.saveOptions = targetEventsConfig.autoEnableOptions.saveOptions;
                }
              }
              subscription.unsubscribe();
              subscription = undefined;
            }
          });
      }
    });
  }
}
