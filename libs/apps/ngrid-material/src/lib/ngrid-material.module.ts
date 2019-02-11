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

import { CellTooltipGridExampleComponent } from './cell-tooltip/cell-tooltip.component';
import { SelectionColumnGridExampleComponent } from './selection-column/selection-column.component';
import { MatSortGridExampleComponent } from './mat-sort';
import { PaginatorGridExampleComponent } from './paginator';

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
  CellTooltipGridExampleComponent,
  SelectionColumnGridExampleComponent,
  MatSortGridExampleComponent,
  PaginatorGridExampleComponent,
];

const ROUTES = [
  { path: 'cell-tooltip', component: CellTooltipGridExampleComponent, data: { title: 'Cell Tooltip' } },
  { path: 'selection-column', component: SelectionColumnGridExampleComponent, data: { title: 'Selection Column' } },
  { path: 'mat-sort', component: MatSortGridExampleComponent, data: { title: 'Sorting with mat-sort' } },
  { path: 'pagination', component: PaginatorGridExampleComponent, data: { title: 'Pagination' } },
];

@NgModule({
  declarations: DECLARATION,
  imports: [
    RouterModule.forChild(ROUTES),
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
  providers: [ PblNgridRegistryService ],
})
export class NgridMaterialDemoModule {
  constructor(registry: ExampleGroupRegistryService) {
    registry.registerGroup({ id: 'ngridMaterial', title: '@pebula/ngrid-material' });
    registry.registerSubGroupRoutes('ngridMaterial', ROUTES);
  }
}

declare module '@pebula/apps/ngrid/shared/src/lib/example-group/example-group-registry.service' {
  interface ExampleGroupMap {
    ngridMaterial: ExampleGroupMetadata;
  }
}
