import { NgModule } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { HideColumnFeatureExampleModule } from './hide-columns/hide-columns.module';
import { ColumnWidthFeatureExampleModule } from './width/column-width.module';
import { ColumnGroupExampleModule } from './column-group/column-group.module';
import { ColumnFilterExampleModule } from './column-filter/column-filter.module';
import { ColumnSortExampleModule } from './column-sort/column-sort.module';
import { CellEditExampleModule } from './cell-edit/cell-edit.module';
import { ColumnReorderExampleModule } from './column-reorder/column-reorder.module';
import { SwitchingColumnDefinitionsExampleModule } from './switching-column-definitions/switching-column-definitions.module';
import { ColumnResizeExampleModule } from './column-resize/column-resize.module';

@NgModule({
  imports: [
    HideColumnFeatureExampleModule,
    ColumnWidthFeatureExampleModule,
    ColumnGroupExampleModule,
    ColumnFilterExampleModule,
    ColumnSortExampleModule,
    CellEditExampleModule,
    ColumnReorderExampleModule,
    SwitchingColumnDefinitionsExampleModule,
    ColumnResizeExampleModule,
  ],
})
export class FeaturesColumnExamplesModule { }

Example.bindModule(FeaturesColumnExamplesModule);
