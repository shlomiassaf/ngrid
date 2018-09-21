import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { SgTableModule } from '@sac/table';
import { SgTableBlockUiDefDirective } from './block-ui/directives';
import { SgTableBlockUiPluginDirective } from './block-ui/block-ui-plugin';

@NgModule({
  imports: [ CommonModule, CdkTableModule, SgTableModule ],
  declarations: [ SgTableBlockUiDefDirective, SgTableBlockUiPluginDirective ],
  exports: [  SgTableBlockUiDefDirective, SgTableBlockUiPluginDirective  ]
})
export class SgTableBlockUiModule { }
