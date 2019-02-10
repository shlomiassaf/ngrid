import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { PblTableModule } from '@pebula/table';
import { PblTableBlockUiDefDirective } from './block-ui/directives';
import { PblTableBlockUiPluginDirective } from './block-ui/block-ui-plugin';

@NgModule({
  imports: [ CommonModule, CdkTableModule, PblTableModule ],
  declarations: [ PblTableBlockUiDefDirective, PblTableBlockUiPluginDirective ],
  exports: [  PblTableBlockUiDefDirective, PblTableBlockUiPluginDirective  ]
})
export class PblTableBlockUiModule { }
