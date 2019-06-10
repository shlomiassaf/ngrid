import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';

import { PblNgridModule, PblNgridRegistryService } from '@pebula/ngrid';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridStatePluginModule } from '@pebula/ngrid/state';

import { SharedModule, ExampleGroupRegistryService } from '@pebula/apps/ngrid/shared';
import { HideColumnsGridExampleComponent } from './hide-columns/hide-columns.component';
import { ColumnWidthGridExampleComponent } from './column-width/column-width.component';
import { ColumnGroupGridExampleComponent } from './column-group/column-group.component';
import { CellEditGridExampleComponent } from './cell-edit/cell-edit.component';
import { ColumnReorderGridExampleComponent } from './column-reorder/column-reorder.component';
import { ColumnSortingGridExampleComponent } from './column-sorting/column-sorting.component';
import { ColumnResizingGridExampleComponent } from './column-resizing/column-resizing.component';
import { SwitchingColumnDefinitionsGridExampleComponent } from './switching-column-definitions/switching-column-definitions.component';

const MATERIAL = [
  MatButtonToggleModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule, MatNativeDateModule,
];

const DECLARATION = [
  HideColumnsGridExampleComponent,
  ColumnWidthGridExampleComponent,
  ColumnGroupGridExampleComponent,
  CellEditGridExampleComponent,
  ColumnReorderGridExampleComponent,
  ColumnResizingGridExampleComponent,
  ColumnSortingGridExampleComponent,
  SwitchingColumnDefinitionsGridExampleComponent,
];

const ROUTES = [
  { path: 'hide-columns', component: HideColumnsGridExampleComponent, data: { title: 'Hide Columns' } },
  { path: 'column-width', component: ColumnWidthGridExampleComponent, data: { title: 'Column Width' } },
  { path: 'column-group', component: ColumnGroupGridExampleComponent, data: { title: 'Column Group' } },
  { path: 'cell-edit', component: CellEditGridExampleComponent, data: { title: 'Cell Edit' } },
  { path: 'column-reorder', component: ColumnReorderGridExampleComponent, data: { title: 'Column Reorder' } },
  { path: 'column-resizing', component: ColumnResizingGridExampleComponent, data: { title: 'Column Resizing' } },
  { path: 'column-sorting', component: ColumnSortingGridExampleComponent, data: { title: 'Column Sorting' } },
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
