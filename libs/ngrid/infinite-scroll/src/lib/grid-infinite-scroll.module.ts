import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { PblNgridModule, ngridPlugin, PblNgridPluginController } from '@pebula/ngrid';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';

import './infinite-scroll-plugin'; // to make sure d.ts stay in published lib and so agumentation kicks in
import { PblNgridInfiniteScrollPlugin, PLUGIN_KEY } from './infinite-scroll-plugin';
import { PblNgridInfiniteVirtualRowRefDirective } from './infinite-virtual-row/directives';
import { PblNgridDefaultInfiniteVirtualRowComponent } from './default-infinite-virtual-row/default-infinite-virtual-row.component';
import { PblNgridInfiniteRowComponent } from './infinite-virtual-row/row';

@NgModule({
    imports: [CommonModule, CdkTableModule, PblNgridModule, PblNgridTargetEventsModule],
    declarations: [PblNgridInfiniteVirtualRowRefDirective, PblNgridInfiniteRowComponent, PblNgridDefaultInfiniteVirtualRowComponent],
    exports: [PblNgridInfiniteVirtualRowRefDirective, PblNgridInfiniteRowComponent]
})
export class PblNgridInfiniteScrollModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY, factory: 'create' }, PblNgridInfiniteScrollPlugin);

  constructor() {
    PblNgridPluginController.onCreatedSafe(
      PblNgridInfiniteScrollModule,
      (grid, controller) => {
        if (controller && controller.hasAncestor(PblNgridInfiniteScrollModule)) {
          controller.createPlugin(PLUGIN_KEY);
        }
      },
    );
  }
}
