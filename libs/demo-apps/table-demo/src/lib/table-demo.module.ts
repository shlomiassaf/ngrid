import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { NegTableModule, NegTableRegistryService, NegTableConfigService } from '@neg/table';
import { NegTableTargetEventsModule } from '@neg/table/target-events';
import { NegTableTransposeModule } from '@neg/table/transpose';
import { NegTableBlockUiModule } from '@neg/table/block-ui';
import { NegTableDetailRowModule } from '@neg/table/detail-row';
import { NegTableStickyModule } from '@neg/table/sticky';
import { NegTableMaterialModule } from '@neg/table/material';

import { SharedModule, ExampleGroupRegistryService } from '@neg/demo-apps/shared';
import {
  TableExamplesPageComponent,
  AllInOneTableExampleComponent,
  GeneralDemoTableExampleComponent,
  HideColumnsTableExampleComponent,
  ColumnWidthTableExampleComponent,
  RowHeightTableExampleComponent,
  BlockUiTableExampleComponent,
  CellTooltipTableExampleComponent,
  SelectionColumnTableExampleComponent,
  NoDataTableExampleComponent,
  StickyRowTableExampleComponent,
  StickyColumnTableExampleComponent,
  PaginatorTableExampleComponent,
  MatSortTableExampleComponent,
  TransposeTableExampleComponent,
  DetailRowExampleComponent,
  VirtualScrollTableExampleComponent,
  TargetEventsTableExampleComponent,
} from './components';

const MATERIAL = [
  MatProgressSpinnerModule,
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatRadioModule,
  MatFormFieldModule,
  MatSlideToggleModule,
  MatButtonToggleModule,
];

const TABLE_EXAMPLES = [
  TableExamplesPageComponent,
  AllInOneTableExampleComponent,
  GeneralDemoTableExampleComponent,
  HideColumnsTableExampleComponent,
  ColumnWidthTableExampleComponent,
  RowHeightTableExampleComponent,
  BlockUiTableExampleComponent,
  CellTooltipTableExampleComponent,
  SelectionColumnTableExampleComponent,
  NoDataTableExampleComponent,
  StickyRowTableExampleComponent,
  StickyColumnTableExampleComponent,
  PaginatorTableExampleComponent,
  MatSortTableExampleComponent,
  TransposeTableExampleComponent,
  DetailRowExampleComponent,
  VirtualScrollTableExampleComponent,
  TargetEventsTableExampleComponent,
];

const ROUTES = [
  { path: 'all-in-one', component: AllInOneTableExampleComponent, data: { title: 'All In One' } },
  { path: 'demo', component: GeneralDemoTableExampleComponent, data: { title: 'Demo' } },
  { path: 'hide-columns', component: HideColumnsTableExampleComponent, data: { title: 'Hide Columns' } },
  { path: 'column-width', component: ColumnWidthTableExampleComponent, data: { title: 'Column Width' } },
  { path: 'row-height', component: RowHeightTableExampleComponent, data: { title: 'Row Height' } },
  { path: 'no-data', component: NoDataTableExampleComponent, data: { title: 'No Date' } },
  { path: 'virtual-scroll', component: VirtualScrollTableExampleComponent, data: { title: 'Virtual Scroll' } },
  { path: 'pagination', component: PaginatorTableExampleComponent, data: { title: 'Pagination' } },
];

const PLUGIN_ROUTES = [
  { path: 'target-events', component: TargetEventsTableExampleComponent, data: { title: 'Target Events' } },
  { path: 'block-ui', component: BlockUiTableExampleComponent, data: { title: 'Block UI' } },
  { path: 'cell-tooltip', component: CellTooltipTableExampleComponent, data: { title: 'Cell Tooltip' } },
  { path: 'selection-column', component: SelectionColumnTableExampleComponent, data: { title: 'Selection Column' } },
  { path: 'mat-sort', component: MatSortTableExampleComponent, data: { title: 'Sorting with mat-sort' } },
  { path: 'sticky', component: StickyRowTableExampleComponent, data: { title: 'Sticky' } },
  { path: 'transpose', component: TransposeTableExampleComponent, data: { title: 'Transpose' } },
  { path: 'detail-row', component: DetailRowExampleComponent, data: { title: 'Detail Row' } },
];

@NgModule({
  declarations: TABLE_EXAMPLES,
  imports: [
    RouterModule.forChild([
      { path: 'table', component: TableExamplesPageComponent, children: ROUTES },
      { path: 'plugins', component: TableExamplesPageComponent, children: PLUGIN_ROUTES },
    ]),
    SharedModule,
    MATERIAL, MatRippleModule,
    NegTableModule,
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
export class TableDemoModule {
  constructor(registry: ExampleGroupRegistryService, config: NegTableConfigService) {
    config.set('cellTooltip', { autoSetAll: true });
    registry.registerGroupFromRoutes({ id: 'table', title: 'Table' }, ROUTES);
    registry.registerGroupFromRoutes({ id: 'plugins', title: 'Plugins' }, PLUGIN_ROUTES);
  }
}

declare module '@neg/demo-apps/shared/src/lib/example-group/example-group-registry.service' {
  interface ExampleGroupMap {
    table: ExampleGroupMetadata;
    'plugins': ExampleGroupMetadata;
  }
}
