import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NegTableModule, NegTablePluginController, NegTableConfigService } from '@pebula/table';
import { NegTableTargetEventsModule } from '@pebula/table/target-events';

import { NegTableCellTooltipDirective } from './cell-tooltip.directive';

@NgModule({
  imports: [ CommonModule, MatTooltipModule, OverlayModule, NegTableModule, NegTableTargetEventsModule ],
  declarations: [ NegTableCellTooltipDirective ],
  exports: [ NegTableCellTooltipDirective, MatTooltipModule ],
})
export class NegTableCellTooltipModule {
  constructor(@Optional() @SkipSelf() parentModule: NegTableCellTooltipModule,
              configService: NegTableConfigService) {
    if (parentModule) {
      return;
    }

    NegTablePluginController.created
      .subscribe( event => {
        // Do not remove the explicit reference to `NegTableCellTooltipDirective`
        // We use `NegTableCellTooltipDirective.PLUGIN_KEY` to create a direct reference to `NegTableCellTooltipDirective`
        // which will disable dead code elimination for the `NegTableCellTooltipDirective` plugin.
        // If it is not set, using the plugin will only work when it is used in templates, other wise, if used programmatically (`autoSetAll`)
        // CLI prod builds will remove the plugin's code.
        const cellTooltipConfig = configService.get(NegTableCellTooltipDirective.PLUGIN_KEY);
        if (cellTooltipConfig && cellTooltipConfig.autoSetAll === true) {
          const pluginCtrl = event.controller;
          let subscription = pluginCtrl.events
            .subscribe( evt => {
              if (evt.kind === 'onInit') {
                if (!pluginCtrl.hasPlugin(NegTableCellTooltipDirective.PLUGIN_KEY)) {
                  pluginCtrl.createPlugin(NegTableCellTooltipDirective.PLUGIN_KEY);
                }
                subscription.unsubscribe();
                subscription = undefined;
              }
            });
        }
      });
  }
}
