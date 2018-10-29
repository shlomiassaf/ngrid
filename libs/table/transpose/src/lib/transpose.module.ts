import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { NegTableModule } from '@neg/table';
import { NegTableTransposePluginDirective } from './transpose-plugin.directive';

@NgModule({
  imports: [ CommonModule, MatCheckboxModule, NegTableModule ],
  declarations: [ NegTableTransposePluginDirective ],
  exports: [ NegTableTransposePluginDirective ],
})
export class NegTableTransposeModule { }
