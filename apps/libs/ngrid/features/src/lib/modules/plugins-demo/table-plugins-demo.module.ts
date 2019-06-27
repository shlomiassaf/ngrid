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
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { PblNgridModule, PblNgridRegistryService } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridStatePluginModule } from '@pebula/ngrid/state';
import { PblNgridTransposeModule } from '@pebula/ngrid/transpose';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridDetailRowModule } from '@pebula/ngrid/detail-row';
import { PblNgridStickyModule } from '@pebula/ngrid/sticky';
import { PblNgridOverlayPanelModule } from '@pebula/ngrid/overlay-panel';

import { SharedModule, ExampleGroupRegistryService } from '@pebula/apps/ngrid/shared';

import { BlockUiGridExampleComponent } from './block-ui';
import { TransposeGridExampleComponent } from './transpose/transpose.component';
import { DetailRowExampleComponent } from './detail-row/detail-row.component';
import { TargetEventsGridExampleComponent } from './target-events/target-events.component';
import { StatePersistenceGridExampleComponent } from './state-persistence/state-persistence.component'
import { OverlayPanelGridExampleComponent } from './overlay-panel/overlay-panel.component'

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
  MatSliderModule,
  MatButtonToggleModule,
];

const DECLARATION = [
  BlockUiGridExampleComponent,
  TransposeGridExampleComponent,
  DetailRowExampleComponent,
  TargetEventsGridExampleComponent,
  StatePersistenceGridExampleComponent,
  OverlayPanelGridExampleComponent,
];

const ROUTES = [
  { path: 'target-events', component: TargetEventsGridExampleComponent, data: { title: 'Target Events' } },
  { path: 'state-persistence', component: StatePersistenceGridExampleComponent, data: { title: 'State Persistence' } },
  { path: 'detail-row', component: DetailRowExampleComponent, data: { title: 'Detail Row' } },
  { path: 'overlay-panel', component: OverlayPanelGridExampleComponent, data: { title: 'Overlay Panel' } },
  { path: 'block-ui', component: BlockUiGridExampleComponent, data: { title: 'Block UI' } },
  { path: 'transpose', component: TransposeGridExampleComponent, data: { title: 'Transpose' } },
];

@NgModule({
  declarations: DECLARATION,
  imports: [
    RouterModule.forChild(ROUTES),
    SharedModule,
    MATERIAL, MatRippleModule,
    PblNgridModule,
    PblNgridDragModule,
    PblNgridStatePluginModule,
    PblNgridTargetEventsModule,
    PblNgridBlockUiModule,
    PblNgridTransposeModule,
    PblNgridDetailRowModule,
    PblNgridStickyModule,
    PblNgridOverlayPanelModule,
  ],
  exports: [ MatRippleModule ], // we need this for detail-row
  providers: [ PblNgridRegistryService ],
})
export class TablePluginsDemoModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerSubGroupRoutes('plugins', ROUTES);
  }
}
