import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { DropContainerExample } from './drop-container.component';
import { ColumnBinExample } from './column-bin.component';

@NgModule({
  declarations: [ DropContainerExample, ColumnBinExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    MatButtonModule, MatMenuModule, MatBadgeModule,
    PblNgridModule,
    PblNgridDragModule,
  ],
  exports: [ DropContainerExample, ColumnBinExample ],
})
@BindNgModule(DropContainerExample, ColumnBinExample)
export class DropContainerExampleModule { }
