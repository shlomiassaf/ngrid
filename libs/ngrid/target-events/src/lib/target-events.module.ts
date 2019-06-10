import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { PblNgridModule, PblNgridPluginController, PblNgridConfigService } from '@pebula/ngrid';
import { PblNgridTargetEventsPluginDirective, PLUGIN_KEY } from './target-events/target-events-plugin';
import { PblNgridCellEditDirective } from './target-events/cell-edit.directive';

@NgModule({
  imports: [ CommonModule, CdkTableModule, PblNgridModule ],
  declarations: [ PblNgridTargetEventsPluginDirective, PblNgridCellEditDirective ],
  exports: [ PblNgridTargetEventsPluginDirective, PblNgridCellEditDirective  ]
})
export class PblNgridTargetEventsModule {
  constructor(@Optional() @SkipSelf() parentModule: PblNgridTargetEventsModule,
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
                pluginCtrl.createPlugin(PLUGIN_KEY);
              }
              subscription.unsubscribe();
              subscription = undefined;
            }
          });
      }
    });
  }
}
