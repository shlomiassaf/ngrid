import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { PblNgridModule, ngridPlugin } from '@pebula/ngrid';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';

import { PLUGIN_KEY } from './detail-row/tokens';
import { PblNgridDetailRowParentRefDirective, PblNgridDetailRowDefDirective } from './detail-row/directives';
import { PblNgridDetailRowPluginDirective, PblNgridDefaultDetailRowParentComponent } from './detail-row/detail-row-plugin';
import { PblNgridDetailRowComponent } from './detail-row/row';

const DETAIL_ROW = [
  PblNgridDetailRowPluginDirective,
  PblNgridDetailRowComponent,
  PblNgridDetailRowParentRefDirective,
  PblNgridDetailRowDefDirective,
];

@NgModule({
    imports: [CommonModule, CdkTableModule, PblNgridModule, PblNgridTargetEventsModule],
    declarations: [DETAIL_ROW, PblNgridDefaultDetailRowParentComponent],
    exports: [DETAIL_ROW]
})
export class PblNgridDetailRowModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY }, PblNgridDetailRowPluginDirective);
}
