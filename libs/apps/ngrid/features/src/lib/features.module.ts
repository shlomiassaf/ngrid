import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

import { PblNgridRegistryService } from '@pebula/ngrid';
import { SharedModule, ExampleGroupRegistryService } from '@pebula/apps/ngrid/shared';
import { FeaturesHomePageComponent } from './components';

const TABLE_EXAMPLES = [
  FeaturesHomePageComponent,
];

const ROUTES = [
  { path: '', loadChildren: './modules/table-demo/table-table-demo.module#TableTableDemoModule' },
  { path: '', loadChildren: './modules/column-features/column-features-demo.module#ColumnFeaturesDemoModule' },
  { path: '', loadChildren: './modules/plugins-demo/table-plugins-demo.module#TablePluginsDemoModule' },
  { path: '', loadChildren: './modules/ngrid-material-demo/ngrid-material-demo.module#NgridMaterialDemoModule' },
  { path: '', loadChildren: './modules/sticky-plugin-demo/table-sticky-plugin-demo.module#TableStickyPluginDemoModule' },
];


@NgModule({
  declarations: TABLE_EXAMPLES,
  imports: [
    RouterModule.forChild([
      { path: '', component: FeaturesHomePageComponent, children: ROUTES },
    ]),
    SharedModule,
  ],
  providers: [ PblNgridRegistryService, ExampleGroupRegistryService ],
})
export class FeaturesModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerGroup({ id: 'columns', title: 'Columns' });
    registry.registerGroup({ id: 'table', title: 'Table' });
    registry.registerGroup({ id: 'plugins', title: 'Plugins' });
    registry.registerGroup({ id: 'ngridMaterial', title: '@pebula/ngrid-material' });
  }
}

declare module '@pebula/apps/ngrid/shared/src/lib/example-group/example-group-registry.service' {
  interface ExampleGroupMap {
    columns: ExampleGroupMetadata;
    datasource: ExampleGroupMetadata;
    table: ExampleGroupMetadata;
    plugins: ExampleGroupMetadata;
    'ngridMaterial': ExampleGroupMetadata;
  }
}
