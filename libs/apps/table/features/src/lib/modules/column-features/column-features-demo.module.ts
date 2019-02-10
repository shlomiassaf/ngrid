import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';

import { PblTableModule, PblTableRegistryService } from '@pebula/table';
import { PblTableTargetEventsModule } from '@pebula/table/target-events';
import { PblTableDragModule } from '@pebula/table/drag';

import { SharedModule, ExampleGroupRegistryService } from '@pebula/apps/table/shared';
import { HideColumnsTableExampleComponent } from './hide-columns/hide-columns.component';
import { ColumnWidthTableExampleComponent } from './column-width/column-width.component';
import { ColumnGroupTableExampleComponent } from './column-group/column-group.component';
import { CellEditTableExampleComponent } from './cell-edit/cell-edit.component';
import { ColumnReorderTableExampleComponent } from './column-reorder/column-reorder.component';
import { ColumnResizingTableExampleComponent } from './column-resizing/column-resizing.component';

const MATERIAL = [
  MatButtonToggleModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule, MatNativeDateModule,
];

const DECLARATION = [
  HideColumnsTableExampleComponent,
  ColumnWidthTableExampleComponent,
  ColumnGroupTableExampleComponent,
  CellEditTableExampleComponent,
  ColumnReorderTableExampleComponent,
  ColumnResizingTableExampleComponent
];

const ROUTES = [
  { path: 'hide-columns', component: HideColumnsTableExampleComponent, data: { title: 'Hide Columns' } },
  { path: 'column-width', component: ColumnWidthTableExampleComponent, data: { title: 'Column Width' } },
  { path: 'column-group', component: ColumnGroupTableExampleComponent, data: { title: 'Column Group' } },
  { path: 'cell-edit', component: CellEditTableExampleComponent, data: { title: 'Cell Edit' } },
  { path: 'column-reorder', component: ColumnReorderTableExampleComponent, data: { title: 'Column Reorder' } },
  { path: 'column-resizing', component: ColumnResizingTableExampleComponent, data: { title: 'Column Resizing' } },
];

@NgModule({
  declarations: DECLARATION,
  imports: [
    RouterModule.forChild(ROUTES),
    MATERIAL,
    SharedModule,
    PblTableModule,
    PblTableTargetEventsModule,
    PblTableDragModule.withDefaultTemplates(),
  ],
  providers: [ PblTableRegistryService ],
})
export class ColumnFeaturesDemoModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerSubGroupRoutes('columns', ROUTES);
  }
}
