import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { NegTableModule } from '@neg/table';
import { NegTableTargetEventsPluginDirective } from './target-events/target-events-plugin';


@NgModule({
  imports: [ CommonModule, CdkTableModule, NegTableModule ],
  declarations: [ NegTableTargetEventsPluginDirective ],
  exports: [ NegTableTargetEventsPluginDirective  ]
})
export class NegTableTargetEventsModule { }
