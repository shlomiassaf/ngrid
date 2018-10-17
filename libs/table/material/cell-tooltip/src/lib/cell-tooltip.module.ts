import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SgTableModule, SgTablePluginController, SgTableConfigService } from '@sac/table';
import { SgTableCellTooltipDirective } from './cell-tooltip.directive';

@NgModule({
  imports: [ CommonModule, MatTooltipModule, OverlayModule, SgTableModule ],
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
        const cellTooltipConfig = configService.get('cellTooltip');
        if (cellTooltipConfig && cellTooltipConfig.autoSetAll === true) {
          const pluginCtrl = event.controller;
          let subscription = pluginCtrl.events
            .subscribe( evt => {
              if (evt.kind === 'onInit') {
                if (!pluginCtrl.hasPlugin('cellTooltip')) {
                  pluginCtrl.createPlugin('cellTooltip');
                }
                subscription.unsubscribe();
                subscription = undefined;
              }
            });
        }
      });
  }
}
