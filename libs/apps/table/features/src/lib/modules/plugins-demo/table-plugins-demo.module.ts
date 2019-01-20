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

import { NegTableModule, NegTableRegistryService } from '@neg/table';
import { NegTableDragModule } from '@neg/table/drag';
import { NegTableTargetEventsModule } from '@neg/table/target-events';
import { NegTableTransposeModule } from '@neg/table/transpose';
import { NegTableBlockUiModule } from '@neg/table/block-ui';
import { NegTableDetailRowModule } from '@neg/table/detail-row';
import { NegTableStickyModule } from '@neg/table/sticky';
import { NegTableMaterialModule } from '@neg/table/material';

import { SharedModule, ExampleGroupRegistryService } from '@neg/apps/table/shared';

import { BlockUiTableExampleComponent } from './block-ui';
import { CellTooltipTableExampleComponent } from './cell-tooltip/cell-tooltip.component';
import { SelectionColumnTableExampleComponent } from './selection-column/selection-column.component';
import { MatSortTableExampleComponent } from './mat-sort';
import { TransposeTableExampleComponent } from './transpose/transpose.component';
import { DetailRowExampleComponent } from './detail-row/detail-row.component';
import { TargetEventsTableExampleComponent } from './target-events/target-events.component';

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
  BlockUiTableExampleComponent,
  CellTooltipTableExampleComponent,
  SelectionColumnTableExampleComponent,
  MatSortTableExampleComponent,
  TransposeTableExampleComponent,
  DetailRowExampleComponent,
  TargetEventsTableExampleComponent,
];

const ROUTES = [
  { path: 'target-events', component: TargetEventsTableExampleComponent, data: { title: 'Target Events' } },
  { path: 'block-ui', component: BlockUiTableExampleComponent, data: { title: 'Block UI' } },
  { path: 'cell-tooltip', component: CellTooltipTableExampleComponent, data: { title: 'Cell Tooltip' } },
  { path: 'selection-column', component: SelectionColumnTableExampleComponent, data: { title: 'Selection Column' } },
  { path: 'mat-sort', component: MatSortTableExampleComponent, data: { title: 'Sorting with mat-sort' } },
  { path: 'transpose', component: TransposeTableExampleComponent, data: { title: 'Transpose' } },
  { path: 'detail-row', component: DetailRowExampleComponent, data: { title: 'Detail Row' } },
];

@NgModule({
  declarations: DECLARATION,
  imports: [
    RouterModule.forChild(ROUTES),
    SharedModule,
    MATERIAL, MatRippleModule,
    NegTableModule,
    NegTableDragModule,
    NegTableTargetEventsModule,
    NegTableBlockUiModule,
    NegTableTransposeModule,
    NegTableDetailRowModule,
    NegTableStickyModule,
    NegTableMaterialModule,
  ],
  exports: [ MatRippleModule ], // we need this for detail-row
  providers: [ NegTableRegistryService ],
})
export class TablePluginsDemoModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerSubGroupRoutes('plugins', ROUTES);
  }
}
