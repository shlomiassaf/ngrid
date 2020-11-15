import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { CommonCellTemplatesComponent } from './common-cell-templates.component';

@NgModule({
  declarations: [ CommonCellTemplatesComponent ],
  imports: [
    CommonModule,
    PblNgridModule,
    PblNgridBlockUiModule,
  ],
  exports: [ CommonCellTemplatesComponent ],
})
export class CommonCellTemplatesModule { }
