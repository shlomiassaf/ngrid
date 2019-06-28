import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { PblNgridModule } from '@pebula/ngrid';
import { ExampleCommonModule } from '../example-common';

import { ColumnGroupGridExample } from './column-group.component';

@NgModule({
  declarations: [ ColumnGroupGridExample ],
  imports: [
    ExampleCommonModule,
    MatCheckboxModule, MatButtonModule,
    PblNgridModule,
  ],
  exports: [ ColumnGroupGridExample ],
  entryComponents: [ ColumnGroupGridExample ],
})
export class ColumnGroupGridExampleModule { }
