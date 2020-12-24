import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { PblNgridConfigService } from '@pebula/ngrid/core';
import { PblNgridModule, PblNgridPluginController, ngridPlugin } from '@pebula/ngrid';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';

import { PblNgridCellTooltipDirective, PLUGIN_KEY } from './cell-tooltip.directive';

@NgModule({
  imports: [ CommonModule, NgbTooltipModule, PblNgridModule, PblNgridTargetEventsModule ],
  declarations: [ PblNgridCellTooltipDirective ],
  exports: [ PblNgridCellTooltipDirective, NgbTooltipModule ],
})
export class PblNgridBsCellTooltipModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY, factory: 'create' }, PblNgridCellTooltipDirective);

  constructor(@Optional() @SkipSelf() parentModule: PblNgridBsCellTooltipModule,
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
          pluginCtrl.onInit()
          .subscribe( evt => pluginCtrl.ensurePlugin(PblNgridCellTooltipDirective.PLUGIN_KEY) );
        }
      });
  }
}
