import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PblNgridRegistryService } from '@pebula/ngrid';
import { SharedModule, ExampleGroupRegistryService } from '@pebula/apps/ngrid/shared';
import { ExtensionsHomePageComponent } from './components';

const DECLARATION = [
  ExtensionsHomePageComponent
];

const ROUTES = [
  { path: '', loadChildren: '@pebula/apps/ngrid-material#NgridMaterialDemoModule' },
];

@NgModule({
  declarations: DECLARATION,
  imports: [
    RouterModule.forChild([
      { path: '', component: ExtensionsHomePageComponent, children: ROUTES },
    ]),
    SharedModule,
  ],
  providers: [
    PblNgridRegistryService,
    ExampleGroupRegistryService
  ],
})
export class ExtensionsModule {
  constructor(registry: ExampleGroupRegistryService) {
    // registry.registerGroup({ id: 'stories' });
    // registry.registerSubGroupRoutes('stories', ROUTES);
  }
}

// declare module '@pebula/apps/ngrid/shared/src/lib/example-group/example-group-registry.service' {
  // interface ExampleGroupMap {
    // stories: ExampleGroupMetadata;
  // }
// }
