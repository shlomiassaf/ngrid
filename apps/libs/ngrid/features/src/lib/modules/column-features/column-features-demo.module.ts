import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { PblNgridModule, PblNgridRegistryService } from '@pebula/ngrid';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridStatePluginModule } from '@pebula/ngrid/state';

import { SharedModule, ExampleGroupRegistryService } from '@pebula/apps/ngrid/shared';

const MATERIAL = [
  MatButtonToggleModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
  MatDatepickerModule, MatNativeDateModule,
];

const DECLARATION = [
  ColumnGroupGridExampleComponent,
  CellEditGridExampleComponent,
  ColumnReorderGridExampleComponent,
  ColumnResizingGridExampleComponent,
  ColumnFilteringGridExampleComponent,
  ColumnSortingGridExampleComponent,
  SwitchingColumnDefinitionsGridExampleComponent,
];


@NgModule({
  declarations: DECLARATION,
  imports: [
    MATERIAL,
    SharedModule,
    PblNgridModule,
    PblNgridTargetEventsModule,
    PblNgridDragModule.withDefaultTemplates(),
    PblNgridStatePluginModule,
  ],
  providers: [ PblNgridRegistryService ],
})
export class ColumnFeaturesDemoModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerSubGroupRoutes('columns', ROUTES);
  }
}
