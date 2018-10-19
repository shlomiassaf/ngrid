import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { SgTableModule } from '@sac/table';
import { SgTableTargetEventsModule } from '@sac/table/target-events';

import { SgTableDetailRowParentRefDirective, SgTableDetailRowDefDirective, SgTableDefaultDetailRowParentComponent } from './detail-row/directives';
import { SgTableDetailRowPluginDirective } from './detail-row/detail-row-plugin';
import { SgTableDetailRowComponent } from './detail-row/row';

const DETAIL_ROW = [
  SgTableDetailRowPluginDirective,
  SgTableDetailRowComponent,
  SgTableDetailRowParentRefDirective,
  SgTableDetailRowDefDirective,
];

@NgModule({
  imports: [ CommonModule, CdkTableModule, SgTableModule, SgTableTargetEventsModule ],
  declarations: [ DETAIL_ROW, SgTableDefaultDetailRowParentComponent ],
  exports: [ DETAIL_ROW ],
  entryComponents: [ SgTableDetailRowComponent, SgTableDefaultDetailRowParentComponent ]
})
export class SgTableDetailRowModule { }
