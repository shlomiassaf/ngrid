import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

import { PblNgridRegistryService } from '@pebula/ngrid';
import { SharedModule, ExampleGroupRegistryService } from '@pebula/apps/ngrid/shared';
import { ConceptsHomePageComponent } from './components';

const TABLE_EXAMPLES = [
  ConceptsHomePageComponent,
];

const ROUTES = [
  { path: '', loadChildren: './modules/layout-concepts/layout-concepts.module#LayoutConceptsModule' },
  { path: '', loadChildren: './modules/datasource-concepts/datasource-concepts.module#DatasourceConceptsModule' },
  { path: '', loadChildren: './modules/column-concepts/column-concepts.module#ColumnConceptsModule' },
  { path: '', loadChildren: './modules/theming-concepts/theming-concepts.module#ThemingConceptsModule' },
];


@NgModule({
  declarations: TABLE_EXAMPLES,
  imports: [
    RouterModule.forChild([
      { path: '', component: ConceptsHomePageComponent, children: ROUTES },
    ]),
    SharedModule,
  ],
  providers: [ PblNgridRegistryService, ExampleGroupRegistryService ],
})
export class ConceptsModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerGroup({ id: 'layout', title: 'Layout' });
    registry.registerGroup({ id: 'datasource', title: 'Data Source' });
    registry.registerGroup({ id: 'columns', title: 'Columns' });
    registry.registerGroup({ id: 'theming', title: 'Theming' });
  }
}

declare module '@pebula/apps/ngrid/shared/src/lib/example-group/example-group-registry.service' {
  interface ExampleGroupMap {
    theming: ExampleGroupMetadata;
    layout: ExampleGroupMetadata;
    columns: ExampleGroupMetadata;
    datasource: ExampleGroupMetadata;
  }
}
