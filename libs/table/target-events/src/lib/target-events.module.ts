import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { PblTableModule } from '@pebula/table';
import { PblTableTargetEventsPluginDirective } from './target-events/target-events-plugin';
import { PblTableCellEditDirective } from './target-events/cell-edit.directive';


@NgModule({
  imports: [ CommonModule, CdkTableModule, PblTableModule ],
  declarations: [ PblTableTargetEventsPluginDirective, PblTableCellEditDirective ],
  exports: [ PblTableTargetEventsPluginDirective, PblTableCellEditDirective  ]
})
export class PblTableTargetEventsModule { }
