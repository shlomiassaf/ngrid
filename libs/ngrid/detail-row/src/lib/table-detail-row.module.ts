import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';

import { PblNgridDetailRowParentRefDirective, PblNgridDetailRowDefDirective, PblNgridDefaultDetailRowParentComponent } from './detail-row/directives';
import { PblNgridDetailRowPluginDirective } from './detail-row/detail-row-plugin';
import { PblNgridDetailRowComponent } from './detail-row/row';

const DETAIL_ROW = [
  PblNgridDetailRowPluginDirective,
  PblNgridDetailRowComponent,
  PblNgridDetailRowParentRefDirective,
  PblNgridDetailRowDefDirective,
];

@NgModule({
  imports: [ CommonModule, CdkTableModule, PblNgridModule, PblNgridTargetEventsModule ],
  declarations: [ DETAIL_ROW, PblNgridDefaultDetailRowParentComponent ],
  exports: [ DETAIL_ROW ],
  // TODO: remove when ViewEngine is no longer supported by angular (V11 ???)
  entryComponents: [ PblNgridDetailRowComponent, PblNgridDefaultDetailRowParentComponent ],
})
export class PblNgridDetailRowModule { }
