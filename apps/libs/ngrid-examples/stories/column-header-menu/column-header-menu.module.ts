import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridMatSortModule } from '@pebula/ngrid-material/sort';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { ColumnHeaderMenuExample } from './column-header-menu.component';

const COMPONENTS = [ ColumnHeaderMenuExample ];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    MatIconModule, MatMenuModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule, PblNgridMatSortModule,
  ],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
})
export class ColumnHeaderMenuExampleModule { }
