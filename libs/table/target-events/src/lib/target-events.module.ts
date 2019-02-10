import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { PblNgridModule } from '@pebula/table';
import { PblNgridTargetEventsPluginDirective } from './target-events/target-events-plugin';
import { PblNgridCellEditDirective } from './target-events/cell-edit.directive';


@NgModule({
  imports: [ CommonModule, CdkTableModule, PblNgridModule ],
  declarations: [ PblNgridTargetEventsPluginDirective, PblNgridCellEditDirective ],
  exports: [ PblNgridTargetEventsPluginDirective, PblNgridCellEditDirective  ]
})
export class PblNgridTargetEventsModule { }
