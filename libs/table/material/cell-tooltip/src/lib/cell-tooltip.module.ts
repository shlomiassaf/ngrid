import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SgTableModule, SgTablePluginController, SgTableConfigService } from '@sac/table';
import { SgTableTargetEventsModule } from '@sac/table/target-events';

import { SgTableCellTooltipDirective } from './cell-tooltip.directive';

@NgModule({
  imports: [ CommonModule, MatTooltipModule, OverlayModule, SgTableModule, SgTableTargetEventsModule ],
  declarations: [ SgTableCellTooltipDirective ],
  exports: [ SgTableCellTooltipDirective, MatTooltipModule ],
})
export class SgTableCellTooltipModule {
  constructor(@Optional() @SkipSelf() parentModule: SgTableCellTooltipModule,
              configService: SgTableConfigService) {
    if (parentModule) {
      return;
    }

    SgTablePluginController.created
      .subscribe( event => {
        // Do not remove the explicit reference to `SgTableCellTooltipDirective`
        // We use `SgTableCellTooltipDirective.PLUGIN_KEY` to create a direct reference to `SgTableCellTooltipDirective`
        // which will disable dead code elimination for the `SgTableCellTooltipDirective` plugin.
        // If it is not set, using the plugin will only work when it is used in templates, other wise, if used programmatically (`autoSetAll`)
        // CLI prod builds will remove the plugin's code.
        const cellTooltipConfig = configService.get(SgTableCellTooltipDirective.PLUGIN_KEY);
        if (cellTooltipConfig && cellTooltipConfig.autoSetAll === true) {
          const pluginCtrl = event.controller;
          let subscription = pluginCtrl.events
            .subscribe( evt => {
              if (evt.kind === 'onInit') {
                if (!pluginCtrl.hasPlugin(SgTableCellTooltipDirective.PLUGIN_KEY)) {
                  pluginCtrl.createPlugin(SgTableCellTooltipDirective.PLUGIN_KEY);
                }
                subscription.unsubscribe();
                subscription = undefined;
              }
            });
        }
      });
  }
}
