import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColumnGroupGridExampleModule } from './column-group/column-group.module';

import { GridHeightGridExampleModule } from './concepts/grid/grid-height/grid-height.module';

import { DatasourceIntroductionSimpleModelExampleModule} from './concepts/datasource/simple-model/simple-model.module';
import { WorkingWithPblDataSourceExampleModule } from './concepts/datasource/working-with-pbl-datasource/working-with-pbl-datasource.module';
import { EnablingCustomTriggersExampleModule } from './concepts/datasource/enabling-custom-triggers/enabling-custom-triggers.module';
import { ManualDatasourceTriggerExampleModule } from './concepts/datasource/manual-trigger/manual-trigger.module';

import { ColumnsSimpleModelExampleModule} from './concepts/columns/simple-model/simple-model.module';
import { ColumnsFactoryExampleModule } from './concepts/columns/factory/factory.module';

@NgModule({
  imports: [
    CommonModule,
    GridHeightGridExampleModule,
    ColumnGroupGridExampleModule,

    DatasourceIntroductionSimpleModelExampleModule,
    WorkingWithPblDataSourceExampleModule,
    EnablingCustomTriggersExampleModule,
    ManualDatasourceTriggerExampleModule,

    ColumnsSimpleModelExampleModule,
    ColumnsFactoryExampleModule,
  ]
})
export class ExampleModule { }
