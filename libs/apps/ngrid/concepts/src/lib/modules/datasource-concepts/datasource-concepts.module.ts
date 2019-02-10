import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';

import { PblNgridModule, PblNgridRegistryService } from '@pebula/ngrid';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';

import { SharedModule, ExampleGroupRegistryService } from '@pebula/apps/ngrid/shared';
import { DatasourceQuickthroughGridExampleComponent } from './datasource-quickthrough/datasource-quickthrough.component';
import { DatasourceIntroductionlGridExampleComponent } from './datasource-introduction/datasource-introduction.component';
import { DatasourceFactoryGridExampleComponent } from './datasource-factory/datasource-factory.component';

const MATERIAL = [
  MatButtonModule,
  MatFormFieldModule,
  MatDatepickerModule, MatNativeDateModule,
];

const DECLARATION = [
  DatasourceQuickthroughGridExampleComponent,
  DatasourceIntroductionlGridExampleComponent,
  DatasourceFactoryGridExampleComponent,
];

const ROUTES = [
  { path: 'datasource-quickthrough', component: DatasourceQuickthroughGridExampleComponent, data: { title: 'Quick-through' } },
  { path: 'datasource-introduction', component: DatasourceIntroductionlGridExampleComponent, data: { title: 'Introduction' } },
  { path: 'datasource-factory', component: DatasourceFactoryGridExampleComponent, data: { title: 'Datasource Factory' } },
];

@NgModule({
  declarations: DECLARATION,
  imports: [
    RouterModule.forChild(ROUTES),
    MATERIAL,
    SharedModule,
    PblNgridModule,
    PblNgridPaginatorModule,
  ],
  providers: [ PblNgridRegistryService ],
})
export class DatasourceConceptsModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerSubGroupRoutes('datasource', ROUTES);
  }
}
