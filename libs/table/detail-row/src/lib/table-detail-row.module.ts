import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { PblTableModule } from '@pebula/table';
import { PblTableTargetEventsModule } from '@pebula/table/target-events';

import { PblTableDetailRowParentRefDirective, PblTableDetailRowDefDirective, PblTableDefaultDetailRowParentComponent } from './detail-row/directives';
import { PblTableDetailRowPluginDirective } from './detail-row/detail-row-plugin';
import { PblTableDetailRowComponent } from './detail-row/row';

const DETAIL_ROW = [
  PblTableDetailRowPluginDirective,
  PblTableDetailRowComponent,
  PblTableDetailRowParentRefDirective,
  PblTableDetailRowDefDirective,
];

@NgModule({
  imports: [ CommonModule, CdkTableModule, PblTableModule, PblTableTargetEventsModule ],
  declarations: [ DETAIL_ROW, PblTableDefaultDetailRowParentComponent ],
  exports: [ DETAIL_ROW ],
  entryComponents: [ PblTableDetailRowComponent, PblTableDefaultDetailRowParentComponent ]
})
export class PblTableDetailRowModule { }
