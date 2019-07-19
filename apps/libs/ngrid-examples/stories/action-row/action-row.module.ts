import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule  } from '@angular/material/form-field';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { ActionRowExample, MyGridActionRowComponent } from './action-row.component';

@NgModule({
  declarations: [ ActionRowExample, MyGridActionRowComponent ],
  imports: [
    MatIconModule, MatInputModule, MatButtonModule, MatFormFieldModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule, PblNgridPaginatorModule,
  ],
  exports: [ ActionRowExample, MyGridActionRowComponent ],
  entryComponents: [ ActionRowExample, MyGridActionRowComponent ],
})
export class ActionRowExampleModule { }
