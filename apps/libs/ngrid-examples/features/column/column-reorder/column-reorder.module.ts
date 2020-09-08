import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { ColumnReorderExample } from './column-reorder.component';
import { MovingWithTheApiExample } from './moving-with-the-api.component';
import { LockingColumnsExample } from './locking-columns.component';
import { GroupColumnsLockExample } from './group-columns-lock.component';

@NgModule({
  declarations: [ ColumnReorderExample, MovingWithTheApiExample, LockingColumnsExample, GroupColumnsLockExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule,
    PblNgridDragModule.withDefaultTemplates(),
  ],
  exports: [ ColumnReorderExample, MovingWithTheApiExample, LockingColumnsExample, GroupColumnsLockExample ],
})
@BindNgModule(ColumnReorderExample, MovingWithTheApiExample, LockingColumnsExample, GroupColumnsLockExample)
export class ColumnReorderExampleModule { }
