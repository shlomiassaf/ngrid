import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { PblNgridModule } from '@pebula/table';
import { PblNgridTargetEventsModule } from '@pebula/table/target-events';

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
  entryComponents: [ PblNgridDetailRowComponent, PblNgridDefaultDetailRowParentComponent ]
})
export class PblNgridDetailRowModule { }
