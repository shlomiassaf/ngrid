import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';

import { NegTableModule, NegTableRegistryService } from '@neg/table';
import { NegTableTargetEventsModule } from '@neg/table/target-events';
import { NegTableDragModule } from '@neg/table/drag';

import { SharedModule, ExampleGroupRegistryService } from '@neg/apps/table/shared';
import { ColumnQuickthroughTableExampleComponent } from './column-quickthrough/column-quickthrough.component';
import { ColumnModelTableExampleComponent } from './column-model/column-model.component';
import { ColumnFactoryTableExampleComponent } from './column-factory/column-factory.component';
import { ColumnTemplatesTableExampleComponent } from './column-templates/column-templates.component';

const MATERIAL = [
  MatButtonToggleModule,
  MatFormFieldModule,
  MatDatepickerModule, MatNativeDateModule,
];

const DECLARATION = [
  ColumnQuickthroughTableExampleComponent,
  ColumnModelTableExampleComponent,
  ColumnFactoryTableExampleComponent,
  ColumnTemplatesTableExampleComponent,
];

const ROUTES = [
  { path: 'column-quickthrough', component: ColumnQuickthroughTableExampleComponent, data: { title: 'Quick-through' } },
  { path: 'column-model', component: ColumnModelTableExampleComponent, data: { title: 'Introduction' } },
  { path: 'column-factory', component: ColumnFactoryTableExampleComponent, data: { title: 'Column Factory' } },
  { path: 'column-templates', component: ColumnTemplatesTableExampleComponent, data: { title: 'Column Templates' } },
];

@NgModule({
  declarations: DECLARATION,
  imports: [
    RouterModule.forChild(ROUTES),
    MATERIAL,
    SharedModule,
    NegTableModule,
    NegTableTargetEventsModule,
    NegTableDragModule.withDefaultTemplates(),
  ],
  providers: [ NegTableRegistryService ],
})
export class ColumnConceptsModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerSubGroupRoutes('columns', ROUTES);
  }
}
