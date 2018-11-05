import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { NegTableModule } from '@neg/table';
import { NegTableTargetEventsPluginDirective } from './target-events/target-events-plugin';
import { NegTableCellEditDirective } from './target-events/cell-edit.directive';


@NgModule({
  imports: [ CommonModule, CdkTableModule, NegTableModule ],
  declarations: [ NegTableTargetEventsPluginDirective, NegTableCellEditDirective ],
  exports: [ NegTableTargetEventsPluginDirective, NegTableCellEditDirective  ]
})
export class NegTableTargetEventsModule { }
