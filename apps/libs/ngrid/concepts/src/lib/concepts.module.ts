import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

import { PblNgridRegistryService } from '@pebula/ngrid';
import { SharedModule, ExampleGroupRegistryService } from '@pebula/apps/ngrid/shared';
import { ConceptsHomePageComponent } from './components';

const TABLE_EXAMPLES = [
  ConceptsHomePageComponent,
];

const ROUTES = [
  { path: '', loadChildren: () => import('./modules/grid-concepts/grid-concepts.module').then(m => m.GridConceptsModule) },
  { path: '', loadChildren: () => import('./modules/datasource-concepts/datasource-concepts.module').then(m => m.DatasourceConceptsModule) },
  { path: '', loadChildren: () => import('./modules/column-concepts/column-concepts.module').then(m => m.ColumnConceptsModule) },
  { path: '', loadChildren: () => import('./modules/theming-concepts/theming-concepts.module').then(m => m.ThemingConceptsModule) },
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
    registry.registerGroup({ id: 'grid', title: 'Grid' });
    registry.registerGroup({ id: 'datasource', title: 'Data Source' });
    registry.registerGroup({ id: 'columns', title: 'Columns' });
    registry.registerGroup({ id: 'theming', title: 'Theming' });
  }
}

declare module '@pebula/apps/ngrid/shared/src/lib/example-group/example-group-registry.service' {
  interface ExampleGroupMap {
    theming: ExampleGroupMetadata;
    grid: ExampleGroupMetadata;
    columns: ExampleGroupMetadata;
    datasource: ExampleGroupMetadata;
  }
}
