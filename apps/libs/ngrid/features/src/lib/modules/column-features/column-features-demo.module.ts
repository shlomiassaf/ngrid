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
import { ColumnGroupGridExampleComponent } from './column-group/column-group.component';
import { CellEditGridExampleComponent } from './cell-edit/cell-edit.component';
import { ColumnFilteringGridExampleComponent } from './column-filtering/column-filtering.component';
import { ColumnSortingGridExampleComponent } from './column-sorting/column-sorting.component';
import { ColumnReorderGridExampleComponent } from './column-reorder/column-reorder.component';
import { ColumnResizingGridExampleComponent } from './column-resizing/column-resizing.component';
import { SwitchingColumnDefinitionsGridExampleComponent } from './switching-column-definitions/switching-column-definitions.component';

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

const ROUTES = [
  { path: 'column-group', component: ColumnGroupGridExampleComponent, data: { title: 'Column Group' } },
  { path: 'column-filtering', component: ColumnFilteringGridExampleComponent, data: { title: 'Column Filtering' } },
  { path: 'column-sorting', component: ColumnSortingGridExampleComponent, data: { title: 'Column Sorting' } },
  { path: 'cell-edit', component: CellEditGridExampleComponent, data: { title: 'Cell Edit' } },
  { path: 'column-reorder', component: ColumnReorderGridExampleComponent, data: { title: 'Column Reorder' } },
  { path: 'column-resizing', component: ColumnResizingGridExampleComponent, data: { title: 'Column Resizing' } },
  { path: 'switching-column-definitions', component: SwitchingColumnDefinitionsGridExampleComponent, data: { title: 'Switching Column Definitions' } },
];

@NgModule({
  declarations: DECLARATION,
  imports: [
    RouterModule.forChild(ROUTES),
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
