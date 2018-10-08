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

import { SgTableModule, SgTableRegistryService } from '@sac/table';
import { SgTableTransposeModule } from '@sac/table/transpose';
import { SgTableBlockUiModule } from '@sac/table/block-ui';
import { SgTableDetailRowModule } from '@sac/table/detail-row';
import { SgTableStickyModule } from '@sac/table/sticky';
import { SgTableCheckboxModule } from '@sac/table/mat-checkbox-column';
import { SgTablePaginatorModule } from '@sac/table/mat-paginator';
import { SgTableMatSortModule } from '@sac/table/mat-sort';

import { SharedModule, ExampleGroupRegistryService } from '@sac/demo-apps/shared';
import {
  TableExamplesPageComponent,
  AllInOneTableExampleComponent,
  BlockUiTableExampleComponent,
  NoDataTableExampleComponent,
  StickyRowTableExampleComponent,
  StickyColumnTableExampleComponent,
  PaginatorTableExampleComponent,
  MatSortTableExampleComponent,
  TransposeTableExampleComponent,
  DetailRowExampleComponent,
  VirtualScrollTableExampleComponent
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
];

const TABLE_EXAMPLES = [
  TableExamplesPageComponent,
  AllInOneTableExampleComponent,
  BlockUiTableExampleComponent,
  NoDataTableExampleComponent,
  StickyRowTableExampleComponent,
  StickyColumnTableExampleComponent,
  PaginatorTableExampleComponent,
  MatSortTableExampleComponent,
  TransposeTableExampleComponent,
  DetailRowExampleComponent,
  VirtualScrollTableExampleComponent,
];

const ROUTES = [
  { path: 'all-in-one', component: AllInOneTableExampleComponent, data: { title: 'All In One' } },
  { path: 'block-ui', component: BlockUiTableExampleComponent, data: { title: 'Block UI' } },
  { path: 'mat-sort', component: MatSortTableExampleComponent, data: { title: 'Sorting with mat-sort' } },
  { path: 'no-data', component: NoDataTableExampleComponent, data: { title: 'No Date' } },
  { path: 'sticky', component: StickyRowTableExampleComponent, data: { title: 'Sticky Plugin' } },
  { path: 'pagination', component: PaginatorTableExampleComponent, data: { title: 'Pagination' } },
  { path: 'transpose', component: TransposeTableExampleComponent, data: { title: 'Transpose' } },
  { path: 'detail-row', component: DetailRowExampleComponent, data: { title: 'Detail Row' } },
  { path: 'virtual-scroll', component: VirtualScrollTableExampleComponent, data: { title: 'Virtual Scroll' } },

];

@NgModule({
  declarations: TABLE_EXAMPLES,
  imports: [
    RouterModule.forChild([
      { path: '', component: TableExamplesPageComponent, children: ROUTES },
    ]),
    SharedModule,
    MATERIAL, MatRippleModule,
    SgTableModule,
    SgTableBlockUiModule,
    SgTableTransposeModule,
    SgTableDetailRowModule,
    SgTableStickyModule,
    SgTableCheckboxModule,
    SgTablePaginatorModule,
    SgTableMatSortModule
  ],
  exports: [ MatRippleModule ], // we need this for detail-row
  providers: [ SgTableRegistryService ],
})
export class TableDemoModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerGroupFromRoutes({ id: 'table', title: 'Table' }, ROUTES);
  }
}

declare module '@sac/demo-apps/shared/src/lib/example-group/example-group-registry.service' {
  interface ExampleGroupMap {
    table: ExampleGroupMetadata
  }
}
