import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { NegTableModule } from '@pebula/table';
import { NegTableTargetEventsModule } from '@pebula/table/target-events';

import { NegTableDetailRowParentRefDirective, NegTableDetailRowDefDirective, NegTableDefaultDetailRowParentComponent } from './detail-row/directives';
import { NegTableDetailRowPluginDirective } from './detail-row/detail-row-plugin';
import { NegTableDetailRowComponent } from './detail-row/row';

const DETAIL_ROW = [
  NegTableDetailRowPluginDirective,
  NegTableDetailRowComponent,
  NegTableDetailRowParentRefDirective,
  NegTableDetailRowDefDirective,
];

@NgModule({
  imports: [ CommonModule, CdkTableModule, NegTableModule, NegTableTargetEventsModule ],
  declarations: [ DETAIL_ROW, NegTableDefaultDetailRowParentComponent ],
  exports: [ DETAIL_ROW ],
  entryComponents: [ NegTableDetailRowComponent, NegTableDefaultDetailRowParentComponent ]
})
export class NegTableDetailRowModule { }
