import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridTransposeModule } from '@pebula/ngrid/transpose';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridDetailRowModule } from '@pebula/ngrid/detail-row';
import { PblNgridStickyModule } from '@pebula/ngrid/sticky';
import { PblNgridMaterialModule } from '@pebula/ngrid/material';

import { SharedModule } from '@pebula/apps/ngrid/shared';
import { CommonTableTemplatesComponent } from './common-table-templates/common-table-templates.component';
import { AllInOneGridExampleComponent } from './all-in-one/all-in-one.component';
import { VirtualScrollPerformanceDemoGridExampleComponent } from './virtual-scroll-performance-demo/virtual-scroll-performance-demo.component';
import { SellersDemoComponent } from './sellers-demo/sellers-demo.component';

const MATERIAL = [
  MatProgressSpinnerModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatRadioModule,
  MatFormFieldModule,
  MatSlideToggleModule,
  MatButtonToggleModule,
  MatMenuModule,
  MatChipsModule,
  MatSliderModule,
];

const DECLARATION = [
  CommonTableTemplatesComponent,
  AllInOneGridExampleComponent,
  VirtualScrollPerformanceDemoGridExampleComponent,
  SellersDemoComponent,
];

@NgModule({
  declarations: DECLARATION,
  imports: [
    RouterModule.forChild([]),
    SharedModule,
    MATERIAL, MatRippleModule,
    PblNgridModule.withCommon([ { component: CommonTableTemplatesComponent } ]),
    PblNgridDragModule.withDefaultTemplates(),
    PblNgridTargetEventsModule,
    PblNgridBlockUiModule,
    PblNgridTransposeModule,
    PblNgridDetailRowModule,
    PblNgridStickyModule,
    PblNgridMaterialModule,
  ],
  exports: [ SellersDemoComponent, AllInOneGridExampleComponent, VirtualScrollPerformanceDemoGridExampleComponent ], // we need this for detail-row
})
export class TableMixDemoModule { }
