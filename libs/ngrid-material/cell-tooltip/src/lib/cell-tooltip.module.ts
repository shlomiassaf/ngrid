import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PblNgridModule, PblNgridPluginController, PblNgridConfigService, ngridPlugin } from '@pebula/ngrid';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';

import { PblNgridCellTooltipDirective, PLUGIN_KEY } from './cell-tooltip.directive';

@NgModule({
  imports: [ CommonModule, MatTooltipModule, OverlayModule, PblNgridModule, PblNgridTargetEventsModule ],
  declarations: [ PblNgridCellTooltipDirective ],
  exports: [ PblNgridCellTooltipDirective, MatTooltipModule ],
})
export class PblNgridCellTooltipModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY, factory: 'create' }, PblNgridCellTooltipDirective);

  constructor(@Optional() @SkipSelf() parentModule: PblNgridCellTooltipModule,
              configService: PblNgridConfigService) {
    if (parentModule) {
      return;
    }

    PblNgridPluginController.created
      .subscribe( event => {
        // Do not remove the explicit reference to `PblNgridCellTooltipDirective`
        // We use `PblNgridCellTooltipDirective.PLUGIN_KEY` to create a direct reference to `PblNgridCellTooltipDirective`
        // which will disable dead code elimination for the `PblNgridCellTooltipDirective` plugin.
        // If it is not set, using the plugin will only work when it is used in templates, other wise, if used programmatically (`autoSetAll`)
        // CLI prod builds will remove the plugin's code.
        const cellTooltipConfig = configService.get(PblNgridCellTooltipDirective.PLUGIN_KEY);
        if (cellTooltipConfig && cellTooltipConfig.autoSetAll === true) {
          const pluginCtrl = event.controller;
          let subscription = pluginCtrl.events
            .subscribe( evt => {
              if (evt.kind === 'onInit') {
                if (!pluginCtrl.hasPlugin(PblNgridCellTooltipDirective.PLUGIN_KEY)) {
                  pluginCtrl.createPlugin(PblNgridCellTooltipDirective.PLUGIN_KEY);
                }
                subscription.unsubscribe();
                subscription = undefined;
              }
            });
        }
      });
  }
}
