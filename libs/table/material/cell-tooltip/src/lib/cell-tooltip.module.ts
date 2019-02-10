import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PblTableModule, PblTablePluginController, PblTableConfigService } from '@pebula/table';
import { PblTableTargetEventsModule } from '@pebula/table/target-events';

import { PblTableCellTooltipDirective } from './cell-tooltip.directive';

@NgModule({
  imports: [ CommonModule, MatTooltipModule, OverlayModule, PblTableModule, PblTableTargetEventsModule ],
  declarations: [ PblTableCellTooltipDirective ],
  exports: [ PblTableCellTooltipDirective, MatTooltipModule ],
})
export class PblTableCellTooltipModule {
  constructor(@Optional() @SkipSelf() parentModule: PblTableCellTooltipModule,
              configService: PblTableConfigService) {
    if (parentModule) {
      return;
    }

    PblTablePluginController.created
      .subscribe( event => {
        // Do not remove the explicit reference to `PblTableCellTooltipDirective`
        // We use `PblTableCellTooltipDirective.PLUGIN_KEY` to create a direct reference to `PblTableCellTooltipDirective`
        // which will disable dead code elimination for the `PblTableCellTooltipDirective` plugin.
        // If it is not set, using the plugin will only work when it is used in templates, other wise, if used programmatically (`autoSetAll`)
        // CLI prod builds will remove the plugin's code.
        const cellTooltipConfig = configService.get(PblTableCellTooltipDirective.PLUGIN_KEY);
        if (cellTooltipConfig && cellTooltipConfig.autoSetAll === true) {
          const pluginCtrl = event.controller;
          let subscription = pluginCtrl.events
            .subscribe( evt => {
              if (evt.kind === 'onInit') {
                if (!pluginCtrl.hasPlugin(PblTableCellTooltipDirective.PLUGIN_KEY)) {
                  pluginCtrl.createPlugin(PblTableCellTooltipDirective.PLUGIN_KEY);
                }
                subscription.unsubscribe();
                subscription = undefined;
              }
            });
        }
      });
  }
}
