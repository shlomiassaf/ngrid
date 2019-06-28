import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { PblNgridModule } from '@pebula/ngrid';
import { ExampleCommonModule } from '../../../example-common';

import { GridHeightGridExample } from './grid-height.component';

@NgModule({
  declarations: [ GridHeightGridExample ],
  imports: [
    ExampleCommonModule,
    MatCheckboxModule, MatButtonModule,
    PblNgridModule,
  ],
  exports: [ GridHeightGridExample ],
  entryComponents: [ GridHeightGridExample ],
})
export class GridHeightGridExampleModule { }
