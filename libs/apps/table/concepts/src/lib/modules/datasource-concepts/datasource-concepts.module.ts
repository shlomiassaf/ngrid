import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';

import { NegTableModule, NegTableRegistryService } from '@pebula/table';
import { NegTablePaginatorModule } from '@pebula/table/material/paginator';

import { SharedModule, ExampleGroupRegistryService } from '@pebula/apps/table/shared';
import { DatasourceQuickthroughTableExampleComponent } from './datasource-quickthrough/datasource-quickthrough.component';
import { DatasourceIntroductionlTableExampleComponent } from './datasource-introduction/datasource-introduction.component';
import { DatasourceFactoryTableExampleComponent } from './datasource-factory/datasource-factory.component';

const MATERIAL = [
  MatButtonModule,
  MatFormFieldModule,
  MatDatepickerModule, MatNativeDateModule,
];

const DECLARATION = [
  DatasourceQuickthroughTableExampleComponent,
  DatasourceIntroductionlTableExampleComponent,
  DatasourceFactoryTableExampleComponent,
];

const ROUTES = [
  { path: 'datasource-quickthrough', component: DatasourceQuickthroughTableExampleComponent, data: { title: 'Quick-through' } },
  { path: 'datasource-introduction', component: DatasourceIntroductionlTableExampleComponent, data: { title: 'Introduction' } },
  { path: 'datasource-factory', component: DatasourceFactoryTableExampleComponent, data: { title: 'Datasource Factory' } },
];

@NgModule({
  declarations: DECLARATION,
  imports: [
    RouterModule.forChild(ROUTES),
    MATERIAL,
    SharedModule,
    NegTableModule,
    NegTablePaginatorModule,
  ],
  providers: [ NegTableRegistryService ],
})
export class DatasourceConceptsModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerSubGroupRoutes('datasource', ROUTES);
  }
}
