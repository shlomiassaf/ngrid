import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PblNgridModule } from '@pebula/ngrid';

import { ColumnWidthExample } from './column-width.component';

@NgModule({
  declarations: [ ColumnWidthExample ],
  imports: [
    CommonModule,
    PblNgridModule,
    RouterModule.forChild([{path: '', component: ColumnWidthExample}]),
  ]
})
export class ColumnWidthExampleModule { }
