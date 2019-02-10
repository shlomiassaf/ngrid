import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { PblNgridModule, PblNgridRegistryService } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridTransposeModule } from '@pebula/ngrid/transpose';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridDetailRowModule } from '@pebula/ngrid/detail-row';
import { PblNgridStickyModule } from '@pebula/ngrid/sticky';
import { PblNgridMaterialModule } from '@pebula/ngrid-material';

import { SharedModule, ExampleGroupRegistryService } from '@pebula/apps/ngrid/shared';
import { StoriesHomePageComponent } from './components';
import { ActionRowStoryGridExampleComponent } from './action-row/action-row.component';
import { TableActionRowComponent } from './action-row/table-action-row/table-action-row.component';

const MATERIAL = [
  MatProgressSpinnerModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatRadioModule,
  MatFormFieldModule,
  MatSlideToggleModule,
  MatButtonToggleModule,
];

const DECLARATION = [
  StoriesHomePageComponent,
  ActionRowStoryGridExampleComponent,
  TableActionRowComponent,
];

const ROUTES = [
  { path: 'action-row', component: ActionRowStoryGridExampleComponent, data: { title: 'Action Row' } },
];

@NgModule({
  declarations: DECLARATION,
  imports: [
    RouterModule.forChild([
      { path: '', component: StoriesHomePageComponent, children: [ ...ROUTES ] },
    ]),
    SharedModule,
    MATERIAL, MatRippleModule,
    PblNgridModule,
    PblNgridDragModule,
    PblNgridTargetEventsModule,
    PblNgridBlockUiModule,
    PblNgridTransposeModule,
    PblNgridDetailRowModule,
    PblNgridStickyModule,
    PblNgridMaterialModule,
  ],
  exports: [ MatRippleModule ], // we need this for detail-row
  providers: [ PblNgridRegistryService, ExampleGroupRegistryService ],
})
export class StoriesModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerGroup({ id: 'stories' });
    registry.registerSubGroupRoutes('stories', ROUTES);
  }
}

declare module '@pebula/apps/ngrid/shared/src/lib/example-group/example-group-registry.service' {
  interface ExampleGroupMap {
    stories: ExampleGroupMetadata;
  }
}
