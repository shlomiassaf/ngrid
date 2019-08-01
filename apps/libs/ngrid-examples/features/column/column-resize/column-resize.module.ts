import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { ColumnResizeExample } from './column-resize.component';
import { ResizingWithTheApiExample } from './resizing-with-the-api.component';
import { ResizeBoundariesExample } from './resize-boundaries.component';
import { CustomResizingExample } from './custom-resizing.component';

@NgModule({
  declarations: [ ColumnResizeExample, ResizingWithTheApiExample, ResizeBoundariesExample, CustomResizingExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
    PblNgridDragModule.withDefaultTemplates(),
  ],
  exports: [ ColumnResizeExample, ResizingWithTheApiExample, ResizeBoundariesExample, CustomResizingExample ],
  entryComponents: [ ColumnResizeExample, ResizingWithTheApiExample, ResizeBoundariesExample, CustomResizingExample ],
})
export class ColumnResizeExampleModule { }