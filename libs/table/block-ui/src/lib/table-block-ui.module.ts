import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { NegTableModule } from '@pebula/table';
import { NegTableBlockUiDefDirective } from './block-ui/directives';
import { NegTableBlockUiPluginDirective } from './block-ui/block-ui-plugin';

@NgModule({
  imports: [ CommonModule, CdkTableModule, NegTableModule ],
  declarations: [ NegTableBlockUiDefDirective, NegTableBlockUiPluginDirective ],
  exports: [  NegTableBlockUiDefDirective, NegTableBlockUiPluginDirective  ]
})
export class NegTableBlockUiModule { }
