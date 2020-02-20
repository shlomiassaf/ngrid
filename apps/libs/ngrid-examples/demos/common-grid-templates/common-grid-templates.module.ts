import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { CommonGridTemplatesComponent } from './common-grid-templates.component';

@NgModule({
  declarations: [ CommonGridTemplatesComponent ],
  imports: [
    CommonModule,
    MatIconModule, MatProgressSpinnerModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridDragModule.withDefaultTemplates(), PblNgridBlockUiModule,
  ],
  exports: [ CommonGridTemplatesComponent ],
})
export class CommonGridTemplatesModule { }
