import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { ColumnReorderExample } from './column-reorder.component';
import { MovingWithTheApiExample } from './moving-with-the-api.component';
import { LockingColumnsExample } from './locking-columns.component';
import { GroupColumnsLockExample } from './group-columns-lock.component';

@NgModule({
  declarations: [ ColumnReorderExample, MovingWithTheApiExample, LockingColumnsExample, GroupColumnsLockExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
    PblNgridDragModule.withDefaultTemplates(),
  ],
  exports: [ ColumnReorderExample, MovingWithTheApiExample, LockingColumnsExample, GroupColumnsLockExample ],
  entryComponents: [ ColumnReorderExample, MovingWithTheApiExample, LockingColumnsExample, GroupColumnsLockExample ],
})
export class ColumnReorderExampleModule { }
