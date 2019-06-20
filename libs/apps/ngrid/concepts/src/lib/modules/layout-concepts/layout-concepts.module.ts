import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';

import { PblNgridModule, PblNgridRegistryService } from '@pebula/ngrid';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridDragModule } from '@pebula/ngrid/drag';

import { SharedModule, ExampleGroupRegistryService } from '@pebula/apps/ngrid/shared';
import { LayoutIntroductionGridExampleComponent } from './layout-introduction/layout-introduction.component';
import { LayoutGridHeightGridExampleComponent } from './layout-grid-height/layout-grid-height.component';


const MATERIAL = [
  MatButtonModule,
  MatCheckboxModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  MatDatepickerModule, MatNativeDateModule,
];

const DECLARATION = [
  LayoutIntroductionGridExampleComponent,
  LayoutGridHeightGridExampleComponent,
];

const ROUTES = [
  { path: 'introduction', component: LayoutIntroductionGridExampleComponent, data: { title: 'Introduction' } },
  { path: 'height-and-scrolling', component: LayoutGridHeightGridExampleComponent, data: { title: 'Height & Scrolling' } },
];

@NgModule({
  declarations: DECLARATION,
  imports: [
    RouterModule.forChild(ROUTES),
    MATERIAL,
    SharedModule,
    PblNgridModule,
    PblNgridTargetEventsModule,
    PblNgridDragModule.withDefaultTemplates(),
  ],
  providers: [ PblNgridRegistryService ],
})
export class LayoutConceptsModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerSubGroupRoutes('layout', ROUTES);
  }
}
