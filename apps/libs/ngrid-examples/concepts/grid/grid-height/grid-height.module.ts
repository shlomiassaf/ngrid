import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { GridHeightGridExample } from './grid-height.component';

@NgModule({
  declarations: [ GridHeightGridExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    MatCheckboxModule, MatButtonModule,
    PblNgridModule,
  ],
  exports: [ GridHeightGridExample ],
})
@BindNgModule(GridHeightGridExample)
export class GridHeightGridExampleModule { }
