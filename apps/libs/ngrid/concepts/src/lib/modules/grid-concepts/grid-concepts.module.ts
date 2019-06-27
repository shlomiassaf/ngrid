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
import { GridLayoutGridExampleComponent } from './grid-layout/grid-layout.component';
import { GridHeightGridExampleComponent } from './grid-height/grid-height.component';
import { TheRegistryGridExampleComponent } from './the-registry/the-registry.component';

const MATERIAL = [
  MatButtonModule,
  MatCheckboxModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  MatDatepickerModule, MatNativeDateModule,
];

const DECLARATION = [
  GridLayoutGridExampleComponent,
  GridHeightGridExampleComponent,
  TheRegistryGridExampleComponent,
];

const ROUTES = [
  { path: 'grid-layout', component: GridLayoutGridExampleComponent, data: { title: 'Grid Layout' } },
  { path: 'height-and-scrolling', component: GridHeightGridExampleComponent, data: { title: 'Height & Scrolling' } },
  { path: 'the-registry', component: TheRegistryGridExampleComponent, data: { title: 'The Registry' } },
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
export class GridConceptsModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerSubGroupRoutes('grid', ROUTES);
  }
}
