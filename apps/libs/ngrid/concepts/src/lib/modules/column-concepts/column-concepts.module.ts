import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { PblNgridModule, PblNgridRegistryService } from '@pebula/ngrid';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridDragModule } from '@pebula/ngrid/drag';

import { SharedModule, ExampleGroupRegistryService } from '@pebula/apps/ngrid/shared';
import { ColumnQuickthroughGridExampleComponent } from './column-quickthrough/column-quickthrough.component';
import { ColumnModelGridExampleComponent } from './column-model/column-model.component';
import { ColumnFactoryGridExampleComponent } from './column-factory/column-factory.component';
import { ColumnTemplatesGridExampleComponent } from './column-templates/column-templates.component';

const MATERIAL = [
  MatButtonToggleModule,
  MatFormFieldModule,
  MatDatepickerModule, MatNativeDateModule,
];

const DECLARATION = [
  ColumnQuickthroughGridExampleComponent,
  ColumnModelGridExampleComponent,
  ColumnFactoryGridExampleComponent,
  ColumnTemplatesGridExampleComponent,
];

const ROUTES = [
  { path: 'column-quickthrough', component: ColumnQuickthroughGridExampleComponent, data: { title: 'Quick-through' } },
  { path: 'column-model', component: ColumnModelGridExampleComponent, data: { title: 'Introduction' } },
  { path: 'column-factory', component: ColumnFactoryGridExampleComponent, data: { title: 'Column Factory' } },
  { path: 'column-templates', component: ColumnTemplatesGridExampleComponent, data: { title: 'Column Templates' } },
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
export class ColumnConceptsModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerSubGroupRoutes('columns', ROUTES);
  }
}
