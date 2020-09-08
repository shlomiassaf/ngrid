import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule  } from '@angular/material/form-field';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { ActionRowExample, MyGridActionRowComponent } from './action-row.component';

@NgModule({
  declarations: [ ActionRowExample, MyGridActionRowComponent ],
  imports: [
    CommonModule,
    MatIconModule, MatInputModule, MatButtonModule, MatFormFieldModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule, PblNgridPaginatorModule,
  ],
  exports: [ ActionRowExample ],
})
@BindNgModule(ActionRowExample)
export class ActionRowExampleModule { }
