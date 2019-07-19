import { NgModule } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { CommonGridTemplatesComponent } from './common-grid-templates.component';

@NgModule({
  declarations: [ CommonGridTemplatesComponent ],
  imports: [
    MatIconModule, MatProgressSpinnerModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridDragModule.withDefaultTemplates(),
  ],
  exports: [ CommonGridTemplatesComponent ],
  entryComponents: [ CommonGridTemplatesComponent ],
})
export class CommonGridTemplatesModule { }
