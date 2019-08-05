import { NgModule } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { FocusAndSelectionExampleModule } from './focus-and-selection/focus-and-selection.module';
import { ReuseExampleModule } from './reuse/reuse.module';
import { RowHeightExampleModule } from './row-height/row-height.module';
import { EmptyCollectionTemplateExampleModule } from './empty-collection-template/empty-collection-template.module';
import { VirtualScrollExampleModule } from './virtual-scroll/virtual-scroll.module';
import { GridFillerExampleModule } from './grid-filler/grid-filler.module';

@NgModule({
  imports: [
    FocusAndSelectionExampleModule,
    ReuseExampleModule,
    RowHeightExampleModule,
    EmptyCollectionTemplateExampleModule,
    VirtualScrollExampleModule,
    GridFillerExampleModule,
  ],
})
export class FeaturesGridExamplesModule { }

Example.bindModule(FeaturesGridExamplesModule);
