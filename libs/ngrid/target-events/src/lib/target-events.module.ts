import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { PblNgridModule, PblNgridPluginController, PblNgridConfigService, ngridPlugin } from '@pebula/ngrid';
import { PblNgridTargetEventsPlugin, PblNgridTargetEventsPluginDirective, PLUGIN_KEY, runOnce } from './target-events/target-events-plugin';
import { PblNgridCellEditDirective } from './target-events/cell-edit.directive';

@NgModule({
  imports: [ CommonModule, CdkTableModule, PblNgridModule ],
  declarations: [ PblNgridTargetEventsPluginDirective, PblNgridCellEditDirective ],
  exports: [ PblNgridTargetEventsPluginDirective, PblNgridCellEditDirective  ]
})
export class PblNgridTargetEventsModule {

  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY, factory: 'create', runOnce }, PblNgridTargetEventsPlugin );

  constructor(configService: PblNgridConfigService) {
    PblNgridPluginController.onCreatedSafe(
      PblNgridTargetEventsModule,
      (grid, controller) => {
        const targetEventsConfig = configService.get(PLUGIN_KEY);
        if (targetEventsConfig && targetEventsConfig.autoEnable === true) {
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
