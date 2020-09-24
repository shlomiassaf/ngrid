import { filter, first } from 'rxjs/operators';
import { InjectFlags, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { PblNgridModule, ngridPlugin, PblNgridConfigService, PblNgridPluginController } from '@pebula/ngrid';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';

import { PblNgridInfiniteScrollPlugin, PLUGIN_KEY } from './infinite-scroll-plugin';
import { PblNgridInfiniteVirtualRowRefDirective } from './infinite-virtual-row/directives';
import { PblNgridDefaultInfiniteVirtualRowComponent } from './default-infinite-virtual-row/default-infinite-virtual-row.component';

@NgModule({
  imports: [ CommonModule, CdkTableModule, PblNgridModule, PblNgridTargetEventsModule ],
  declarations: [ PblNgridInfiniteVirtualRowRefDirective, PblNgridDefaultInfiniteVirtualRowComponent ],
  exports: [ PblNgridInfiniteVirtualRowRefDirective ],
  // TODO: remove when ViewEngine is no longer supported by angular (V11 ???)
  entryComponents: [ PblNgridDefaultInfiniteVirtualRowComponent ],
})
export class PblNgridInfiniteScrollModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY, factory: 'create' }, PblNgridInfiniteScrollPlugin);

  constructor(@Optional() @SkipSelf() parentModule: PblNgridInfiniteScrollModule,
              configService: PblNgridConfigService) {
    if (parentModule) {
      return;
    }

    PblNgridPluginController.created
      .subscribe( event => {
        const { controller } = event;
        if (controller && controller.hasAncestor(PblNgridInfiniteScrollModule)) {
            controller.createPlugin(PLUGIN_KEY);
        }
      });
  }
}
