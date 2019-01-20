import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

import { NegTableRegistryService } from '@neg/table';
import { SharedModule, ExampleGroupRegistryService } from '@neg/apps/table/shared';
import { ConceptsHomePageComponent } from './components';

const TABLE_EXAMPLES = [
  ConceptsHomePageComponent,
];

const ROUTES = [
  { path: '', loadChildren: './modules/layout-concepts/layout-concepts.module#LayoutConceptsModule' },
  { path: '', loadChildren: './modules/datasource-concepts/datasource-concepts.module#DatasourceConceptsModule' },
  { path: '', loadChildren: './modules/column-concepts/column-concepts.module#ColumnConceptsModule' },
];


@NgModule({
  declarations: TABLE_EXAMPLES,
  imports: [
    RouterModule.forChild([
      { path: '', component: ConceptsHomePageComponent, children: ROUTES },
    ]),
    SharedModule,
  ],
  providers: [ NegTableRegistryService, ExampleGroupRegistryService ],
})
export class ConceptsModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerGroup({ id: 'layout', title: 'Layout' });
    registry.registerGroup({ id: 'datasource', title: 'Data Source' });
    registry.registerGroup({ id: 'columns', title: 'Columns' });
  }
}

declare module '@neg/apps/table/shared/src/lib/example-group/example-group-registry.service' {
  interface ExampleGroupMap {
    layout: ExampleGroupMetadata;
    columns: ExampleGroupMetadata;
    datasource: ExampleGroupMetadata;
  }
}
