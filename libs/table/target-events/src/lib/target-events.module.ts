import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { SgTableModule } from '@sac/table';
import { SgTableTargetEventsPluginDirective } from './target-events/target-events-plugin';


@NgModule({
  imports: [ CommonModule, CdkTableModule, SgTableModule ],
  declarations: [ SgTableTargetEventsPluginDirective ],
  exports: [ SgTableTargetEventsPluginDirective  ]
})
export class SgTableTargetEventsModule { }
