import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

import { PblNgridModule, PblNgridRegistryService } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridStickyModule } from '@pebula/ngrid/sticky';
import { PblNgridStatePluginModule } from '@pebula/ngrid/state';
import { PblNgridTransposeModule } from '@pebula/ngrid/transpose';
import { PblNgridDetailRowModule } from '@pebula/ngrid/detail-row';
import { PblNgridOverlayPanelModule } from '@pebula/ngrid/overlay-panel';
import { PblNgridMatSortModule } from '@pebula/ngrid-material/sort';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';
import { PblNgridContextMenuModule } from '@pebula/ngrid-material/context-menu';
import { PblNgridCellTooltipModule } from '@pebula/ngrid-material/cell-tooltip';
import { PblNgridCheckboxModule } from '@pebula/ngrid-material/selection-column';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { CommonGridTemplatesModule, CommonGridTemplatesComponent } from '../common-grid-templates';
import { ComplexDemo1Example } from './complex-demo1.component';

@NgModule({
  declarations: [ ComplexDemo1Example ],
  imports: [
    CommonModule,
    MatFormFieldModule, MatSelectModule, MatProgressBarModule, MatSlideToggleModule, MatCheckboxModule, MatRadioModule,

    ExampleCommonModule,
    CommonGridTemplatesModule,

    PblNgridModule.withCommon([ { component: CommonGridTemplatesComponent } ]),
    PblNgridDragModule.withDefaultTemplates(),
    PblNgridTargetEventsModule,
    PblNgridBlockUiModule,
    PblNgridStickyModule,
    PblNgridStatePluginModule,
    PblNgridTransposeModule,
    PblNgridDetailRowModule,
    PblNgridOverlayPanelModule,
    PblNgridMatSortModule,
    PblNgridPaginatorModule,
    PblNgridContextMenuModule,
    PblNgridCellTooltipModule,
    PblNgridCheckboxModule,
  ],
  exports: [ ComplexDemo1Example ],
  providers: [ PblNgridRegistryService ],
})
@BindNgModule(ComplexDemo1Example)
export class ComplexDemo1ExampleModule { }
