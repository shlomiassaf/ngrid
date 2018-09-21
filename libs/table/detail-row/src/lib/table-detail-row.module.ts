import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { SgTableModule } from '@sac/table';

import { SgTableDetailRowParentRefDirective, SgTableDetailRowDefDirective } from './detail-row/directives';
import { SgTableDetailRowPluginDirective } from './detail-row/detail-row-plugin';
import { SgTableDetailRowComponent } from './detail-row/row';

const DETAIL_ROW = [
  SgTableDetailRowPluginDirective,
  SgTableDetailRowComponent,
  SgTableDetailRowParentRefDirective,
  SgTableDetailRowDefDirective,
];

@NgModule({
  imports: [ CommonModule, CdkTableModule, SgTableModule ],
  declarations: [ DETAIL_ROW ],
  exports: [ DETAIL_ROW ],
  entryComponents: [ SgTableDetailRowComponent  ]
})
export class SgTableDetailRowModule { }
